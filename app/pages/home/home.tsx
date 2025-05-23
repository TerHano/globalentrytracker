import {
  Button,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import planeImg from "~/assets/images/plane.png";
import { CircleCheckBig, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router";
import { PricingGrid } from "~/components/pricing/pricing-grid";
import { FAQ } from "./faq";
import { HowItWorks } from "./how-it-works";
import useIdScroll from "~/hooks/useIdScroll";
import { useUserAuthenticated } from "~/hooks/useUserAuthenticated";

export const HomePage = () => {
  const { scrollToId } = useIdScroll();
  const { isUserAuthenticated } = useUserAuthenticated();
  return (
    <Container size="xl">
      <Stack mt="lg" gap="xl">
        <Grid justify="center" id="hero">
          <Grid.Col span={{ xs: 12, sm: 8 }}>
            <Stack className="fade-in-up-animation" gap="xs">
              <Text span fw={800} lh="1em" fz="2rem">
                Get Your Global Entry Interview Sooner
              </Text>
              <Text fz="1rem" c="dimmed">
                Get instant notifications when Global Entry interview slots
                become available at your preferred locations.
              </Text>
              {isUserAuthenticated ? (
                <NavLink to="/dashboard">
                  {({ isPending }) => (
                    <Button
                      loading={isPending}
                      size="sm"
                      leftSection={<LayoutDashboard size={16} />}
                    >
                      Go To Dashboard
                    </Button>
                  )}
                </NavLink>
              ) : (
                <Group mt="md" gap="xs">
                  <NavLink to="/signup">
                    {({ isPending }) => (
                      <Button loading={isPending} size="sm">
                        Start Tracking Now
                      </Button>
                    )}
                  </NavLink>
                  <Button
                    onClick={() => {
                      scrollToId("howItWorks");
                    }}
                    variant="light"
                    size="sm"
                  >
                    How It Works
                  </Button>
                </Group>
              )}
              <Group align="center" mt="xs" gap="xs">
                <FeatureTagLine label="Real-time Alerts" />
                <FeatureTagLine label=" Multiple Locations" />
                <FeatureTagLine label="  24/7 Monitoring" />
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col
            maw={300}
            //style={{ animationDelay: "200ms" }}
            className="plane-fade-bob plane-col"
            span={{ xs: 12, sm: 4 }}
          >
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
            <div className="cloud cloud-3" />
            <Image src={planeImg} alt="plane" />
          </Grid.Col>
        </Grid>
        <Paper p="md" radius="xs">
          <HowItWorks />
        </Paper>
        <Stack
          className="fade-in-up-animation"
          justify="center"
          align="center"
          gap="xs"
        >
          <Stack gap={1} justify="center" align="center">
            <Text span fw={800} lh="1em" fz="2rem">
              Pricing
            </Text>
            <Text fw={500} ta="center" fz="1rem" c="dimmed">
              Choose a plan that suits your needs
            </Text>
          </Stack>
          <PricingGrid allowPurchase={false} />
        </Stack>
        <Paper p="md" radius="md">
          <FAQ />
        </Paper>
      </Stack>
    </Container>
  );
};

const FeatureTagLine = ({ label }: { label: string }) => {
  return (
    <Group gap={4}>
      <CircleCheckBig size={14} />
      <Text fw="bold" fz="sm" c="white">
        {label}
      </Text>
    </Group>
  );
};
