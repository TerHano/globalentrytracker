import { ActionIcon, Button, Flex, Skeleton, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link, NavLink } from "react-router";
import { meQuery } from "~/api/me-api";
import { permissionQuery } from "~/api/permissions-api";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";

export const Greeting = () => {
  const { data: trackedLocations } = useQuery(trackedLocationsQuery());
  const { data: meData, isLoading: isMeLoading } = useQuery(meQuery());
  const { data: permissions } = useQuery(permissionQuery());

  const isAddingTrackerDisabled = !permissions?.canCreateTracker;

  const hasTrackers = trackedLocations && trackedLocations.length > 0;

  return (
    <Flex justify="space-between" align="center" gap="lg">
      <Skeleton w="fit-content" visible={isMeLoading}>
        <Text fz="h3" fw="bold">
          {isMeLoading ? "Loading..." : `Hey, ${meData?.firstName} 👋`}
        </Text>
      </Skeleton>
      {hasTrackers && (
        <>
          <NavLink
            data-disabled={isAddingTrackerDisabled}
            to={"/create-tracker"}
          >
            {({ isPending }) => (
              <Button size="sm" loading={isPending}>
                Add Tracker
              </Button>
            )}
          </NavLink>
          {/* <Button
            visibleFrom="xs"
            onClick={(e) =>
              isAddingTrackerDisabled ? e.preventDefault() : null
            }
            component={Link}
            data-disabled={isAddingTrackerDisabled}
            to="/create-tracker"
            size="sm"
          >
            Add Tracker
          </Button> */}
          <ActionIcon component={Link} to="/create-tracker" hiddenFrom="xs">
            <Plus />
          </ActionIcon>
        </>
      )}
    </Flex>
  );
};
