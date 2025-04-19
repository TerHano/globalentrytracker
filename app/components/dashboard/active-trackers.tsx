import { Button, Image, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import { NavLink } from "react-router";
import {
  trackedLocationsQuery,
  type TrackedLocation,
} from "~/api/tracked-locations-api";
import { Empty } from "../ui/empty";
import notificationBellIcon from "~/assets/icons/notification-bell.png";
import { LocationTrackerCard } from "../location-tracker-card";
import { BellMinus, PencilLine, Trash2 } from "lucide-react";
import { modals } from "@mantine/modals";
import { useDeleteTracker } from "~/hooks/api/useDeleteTracker";
import { ConfirmDeleteTrackerBody } from "./confirm-delete-tracker-body";
import { useShowNotification } from "~/hooks/useShowNotification";

export const ActiveTrackers = () => {
  const { data, isLoading } = useQuery(trackedLocationsQuery());

  const trackedLocationsList = useMemo(() => {
    if (!data && isLoading) {
      return <Skeleton height={200} w="full" />;
    }
    if (!data || data.length === 0) {
      return (
        <>
          <Empty
            action={
              <NavLink to={"/create-tracker"}>
                <Button>Add Tracker</Button>
              </NavLink>
            }
            icon={
              <Image
                h={60}
                w={60}
                src={notificationBellIcon}
                alt="No Trackers"
              />
            }
            title="No Trackers"
            description="You have no active trackers. Add one to start tracking your
            locations."
          />{" "}
        </>
      );
    }
    return data.map((location) => (
      <ActionableLocationTrackerCard key={location.id} tracker={location} />
    ));
  }, [data, isLoading]);

  return (
    <section className="flex flex-col gap-4">
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Stack>
          <Stack gap={0}>
            <Text fw="bold" fz={{ base: "h5", sm: "h3" }}>
              Trackers
            </Text>
            <Text c="dimmed" fz={{ base: "xs", sm: "sm" }}>
              Here you can see all your trackers
            </Text>
          </Stack>

          {trackedLocationsList}
        </Stack>
      </Paper>
    </section>
  );
};

const ActionableLocationTrackerCard = ({
  tracker,
}: {
  tracker: TrackedLocation;
}) => {
  const { showNotification } = useShowNotification();

  const modalId = useRef<string | null>(null);

  console.log("TrackerCard", tracker);

  const deleteTrackerMutation = useDeleteTracker({
    onSuccess: () => {
      if (modalId.current) {
        modals.close(modalId.current);
      }
      showNotification({
        icon: <BellMinus size={16} />,
        title: "Tracker Deleted",
        message: "The tracker has been deleted successfully.",
        status: "success",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          icon: <BellMinus size={16} />,
          title: "Error Deleting Tracker",
          message: error.message,
          status: "error",
        });
        console.error("Error deleting tracker:", error);
      }
    },
  });
  const handleDelete = useCallback(async () => {
    await deleteTrackerMutation.mutateAsync(tracker.id);
  }, [deleteTrackerMutation, tracker.id]);
  const openConfirmDelete = useCallback(() => {
    modalId.current = modals.openConfirmModal({
      title: <Text fw="bold">Delete Tracker</Text>,
      children: <ConfirmDeleteTrackerBody tracker={tracker} />,

      labels: { confirm: "Delete Tracker", cancel: "Cancel" },
      confirmProps: {
        color: "red",
        loading: deleteTrackerMutation.isPending,
      },

      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDelete(),
    });
  }, [deleteTrackerMutation.isPending, handleDelete, tracker]);

  return (
    <LocationTrackerCard
      locationTracker={tracker}
      actions={[
        {
          id: "edit",
          link: { to: `/edit-tracker/${tracker.id}` },
          leftSection: <PencilLine size={14} />,
          children: "Edit Tracker",
        },
        {
          id: "delete",
          button: {
            onClick: openConfirmDelete,
            color: "red",
          },
          leftSection: <Trash2 size={14} />,
          children: "Delete Tracker",
        },
      ]}
    />
  );
};
