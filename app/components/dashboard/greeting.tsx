"use client";

import { Button, Flex, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { meQuery, type me } from "~/api/me-api";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";

interface GreetingProps {
  me: me;
}

export const Greeting = ({ me }: GreetingProps) => {
  const { data: trackedLocations, isLoading } = useQuery(trackedLocationsQuery);

  const { data: meData } = useQuery({ ...meQuery, initialData: me });

  const hasTrackers = trackedLocations && trackedLocations.length > 0;

  return (
    <Flex justify="space-between" align="center" gap="lg">
      <Text fz="h3" fw="bold">
        Hello {meData.firstName} 👋
      </Text>
      {hasTrackers && (
        <Button component={Link} to="/create-tracker" size="sm">
          Add Tracker
        </Button>
      )}
    </Flex>
  );
};
