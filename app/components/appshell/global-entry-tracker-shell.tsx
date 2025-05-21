import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import { AppHeader } from "./app-header/app-header";
import type { PropsWithChildren } from "react";

export const GlobalEntryTrackerShell = ({ children }: PropsWithChildren) => {
  return (
    <AppShell padding="md" header={{ height: 50 }}>
      <AppShellHeader>
        <AppHeader />
      </AppShellHeader>
      <AppShellMain>
        <div className="container">{children}</div>
      </AppShellMain>
    </AppShell>
  );
};
