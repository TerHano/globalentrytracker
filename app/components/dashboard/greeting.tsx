import { ActionIcon, Button, Flex, Skeleton, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { meQuery } from "~/api/me-api";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";

export const Greeting = () => {
  const { data: trackedLocations } = useQuery(trackedLocationsQuery());
  const { data: meData, isLoading: isMeLoading } = useQuery(meQuery());

  if (isMeLoading) {
    return <Skeleton height={30} w="50%" />;
  }

  const hasTrackers = trackedLocations && trackedLocations.length > 0;

  return (
    <Flex justify="space-between" align="center" gap="lg">
      <Text fz="h3" fw="bold">
        {isMeLoading ? "Loading..." : `Hey, ${meData?.firstName} 👋`}
      </Text>
      {hasTrackers && (
        <>
          <Button
            visibleFrom="xs"
            component={Link}
            to="/create-tracker"
            size="sm"
          >
            Add Tracker
          </Button>
          <ActionIcon component={Link} to="/create-tracker" hiddenFrom="xs">
            <Plus />
          </ActionIcon>
        </>
      )}
    </Flex>
  );
};
