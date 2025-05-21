import { Outlet } from "react-router";
import { GlobalEntryTrackerShell } from "~/components/appshell/global-entry-tracker-shell";

export default function DefaultLayout() {
  return (
    <GlobalEntryTrackerShell>
      <Outlet />
    </GlobalEntryTrackerShell>
  );
}
