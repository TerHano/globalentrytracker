import { Button, Flex, Skeleton, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { meQuery } from "~/api/me-api";
import { permissionQuery } from "~/api/permissions-api";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";
import { useShowUpgradeModalContext } from "~/hooks/useShowUpgradeModal";

export const Greeting = () => {
  const { data: trackedLocations } = useQuery(trackedLocationsQuery());
  const { data: meData, isLoading: isMeLoading } = useQuery(meQuery());
  const { data: permissions } = useQuery(permissionQuery());
  const { showUpgradeModal } = useShowUpgradeModalContext();
  const isAddingTrackerDisabled = !permissions?.canCreateTracker;

  const hasTrackers = trackedLocations && trackedLocations.length > 0;

  return (
    <Flex justify="space-between" align="center" gap="lg">
      <Skeleton w="fit-content" visible={isMeLoading}>
        <Text fz="h3" fw="bold">
          {isMeLoading ? "Loading..." : `Hey, ${meData?.firstName} 👋`}
        </Text>
      </Skeleton>
      {hasTrackers &&
        (isAddingTrackerDisabled ? (
          <Button onClick={showUpgradeModal} size="sm">
            Add Tracker
          </Button>
        ) : (
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
        ))}
    </Flex>
  );
};
