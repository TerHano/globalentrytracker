import { useContext } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Box,
  Collapse,
  Group,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { meQuery } from "~/api/me-api";
import { appointmentHistoryQuery } from "~/api/appointment-history-api";
import { ShowUpgradeModalContext } from "~/context/show-upgrade-modal-context";

const PAID_ROLE_CODES = ["subscriber", "admin", "friends_family"];

interface AppointmentHistoryChartProps {
  locationId: number;
}

function HistoryChart({ locationId }: AppointmentHistoryChartProps) {
  const { data, isPending } = useQuery(appointmentHistoryQuery(locationId, 30));

  if (isPending) {
    return <Skeleton h={160} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="sm">
        No history available yet for this location.
      </Text>
    );
  }

  const chartData = data.map((d) => ({
    date: dayjs(d.date).format("MMM D"),
    slots: d.maxAppointments,
  }));

  return (
    <AreaChart
      h={160}
      data={chartData}
      dataKey="date"
      series={[{ name: "slots", color: "blue" }]}
      curveType="natural"
      withDots
      strokeWidth={3}
      yAxisProps={{ allowDecimals: false, width: 32 }}
      connectNulls
    />
  );
}

export function AppointmentHistoryChart({
  locationId,
}: AppointmentHistoryChartProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const upgradeModalContext = useContext(ShowUpgradeModalContext);

  const { data: me, isPending: mePending } = useQuery(meQuery());

  const isPaid =
    !mePending && me?.role?.code
      ? PAID_ROLE_CODES.includes(me.role.code)
      : false;

  if (mePending) {
    return null;
  }

  if (!isPaid) {
    return (
      <Stack gap={4} pt={4}>
        <Group gap={6} c="dimmed">
          <Lock size={12} />
          <Text size="xs">Availability history is a paid feature</Text>
          <Button
            size="compact-xs"
            variant="subtle"
            onClick={() => upgradeModalContext?.showUpgradeModal()}
          >
            Upgrade
          </Button>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap={6} pt={4}>
      <Button
        size="compact-xs"
        variant="subtle"
        color="gray"
        onClick={toggle}
        rightSection={
          opened ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        }
        justify="flex-start"
        px={0}
      >
        <Text size="xs" c="dimmed">
          {opened ? "Hide" : "Show"} availability history
        </Text>
      </Button>
      <Collapse in={opened}>
        <Box h={160} w="100%">
          <HistoryChart locationId={locationId} />
        </Box>
      </Collapse>
    </Stack>
  );
}
