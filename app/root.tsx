import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./app.css";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "~/i18n/i18n";
import pageNotFoundImg from "~/assets/icons/404.png";
import serverErrorImg from "~/assets/icons/500.png";

dayjs.extend(customParseFormat);

import {
  Button,
  ColorSchemeScript,
  Image,
  MantineProvider,
  Stack,
  createTheme,
  mantineHtmlProps,
  Text,
  Container,
} from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import React from "react";
import { UpgradeModalProvider } from "./provider/upgrade-modal-provider";
import { ArrowLeft } from "lucide-react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },
];

//const queryClient = new QueryClient();

const theme = createTheme({
  fontFamily: "Montserrat, sans-serif",
});

export function Layout({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            throwOnError: true,
          },
        },
      })
  );

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript defaultColorScheme="dark" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <ModalsProvider>
            <Notifications autoClose={3000} />
            <QueryClientProvider client={queryClient}>
              <UpgradeModalProvider>{children}</UpgradeModalProvider>
            </QueryClientProvider>
          </ModalsProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  const showFriendlyError = false;

  if (showFriendlyError) {
    if (isRouteErrorResponse(error)) {
      return (
        <Container
          className="fade-in-up-animation"
          fluid
          style={{ justifyItems: "center", alignItems: "center" }}
          p="lg"
          h="100vh"
        >
          <Stack
            className="fade-in-up-animation"
            w="100%"
            maw="40rem"
            justify="center"
            align="center"
            gap="md"
          >
            <Image src={pageNotFoundImg} w="8rem" />
            <Stack w="100%" justify="center" align="center" gap="xs">
              <Text span fw={800} lh="1em" fz="1.5rem">
                Oops! Page not found
              </Text>
              <Text ta="center" span fw={500} lh="1em" fz={14}>
                We couldn&apos;t find the page you&apos;re looking for. It might
                have been removed, had its name changed, or is temporarily
                unavailable.
              </Text>
            </Stack>
            <Button
              variant="subtle"
              color="gray"
              component={Link}
              to="/"
              leftSection={<ArrowLeft size={16} />}
            >
              Back to Home
            </Button>
          </Stack>
        </Container>
      );
    } else {
      return (
        <Container
          className="fade-in-up-animation"
          fluid
          style={{ justifyItems: "center", alignContent: "center" }}
          p="lg"
          h="100vh"
        >
          <Stack maw="40rem" justify="center" align="center" gap="md">
            <Image src={serverErrorImg} w="8rem" />
            <Text span fw={800} lh="1em" fz="1.5rem">
              Uh oh! Something went wrong
            </Text>
            <Text ta="center" span fw={500} lh="1em" fz={14}>
              We encountered an error while processing your request. Please try
              again later.
            </Text>
            <Button
              variant="subtle"
              color="gray"
              component={Link}
              to="/"
              leftSection={<ArrowLeft size={16} />}
            >
              Back to Home
            </Button>
          </Stack>
        </Container>
      );
    }
  }

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
