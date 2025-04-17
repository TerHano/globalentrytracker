import { Button, Flex, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { meQuery, type me } from "~/api/me-api";
import {
  trackedLocationsQuery,
  type TrackedLocation,
} from "~/api/tracked-locations-api";

interface GreetingProps {
  initialData: {
    me: me;
    trackedLocations: TrackedLocation[];
  };
}

export const Greeting = ({ initialData }: GreetingProps) => {
  const { data: trackedLocations } = useQuery({
    ...trackedLocationsQuery,
    initialData: initialData.trackedLocations,
  });

  const { data: meData, isLoading: isMeLoading } = useQuery({
    ...meQuery,
    initialData: initialData.me,
  });

  const hasTrackers = trackedLocations && trackedLocations.length > 0;

  return (
    <Flex justify="space-between" align="center" gap="lg">
      <Text fz="h3" fw="bold">
        {isMeLoading ? "Loading..." : `Welcome back, ${meData.firstName} 👋`}
      </Text>
      {hasTrackers && (
        <Button viewTransition component={Link} to="/create-tracker" size="sm">
          Add Tracker
        </Button>
      )}
    </Flex>
  );
};
