import { useCallback, useRef } from "react";
import { Bell, BellMinus, PencilLine, Trash2 } from "lucide-react";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { useCreateUpdateTracker } from "~/hooks/api/useCreateUpdateTracker";
import { useDeleteTracker } from "~/hooks/api/useDeleteTracker";
import { useShowNotification } from "~/hooks/useShowNotification";
import { ConfirmDeleteTrackerBody } from "./confirm-delete-tracker-body";
import { LocationTrackerCard } from "../location-tracker-card";
import type { components } from "~/types/api";
import { useOptimisticTrackerToggle } from "~/utils/optimistic-updates-utils";

interface ActionableTrackerCardProps {
  tracker: components["schemas"]["TrackedLocationForUserDto"];
}

export const ActionableTrackerCard = ({
  tracker,
}: ActionableTrackerCardProps) => {
  const { showNotification, showErrorCodeNotification } = useShowNotification();
  const modalId = useRef<string | null>(null);
  const { applyOptimisticUpdate, revertOptimisticUpdate } =
    useOptimisticTrackerToggle(tracker.id);

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
      showErrorCodeNotification(error);
    },
  });

  const updateTrackerMutation = useCreateUpdateTracker({
    isUpdate: true,
    onSuccess: () => {
      showNotification({
        icon: <BellMinus size={16} />,
        title: "Tracker Updated",
        message: "The tracker has been updated successfully.",
        status: "success",
      });
    },
    onError: (error) => {
      showErrorCodeNotification(error);
    },
  });

  const handleDelete = useCallback(async () => {
    await deleteTrackerMutation.mutateAsync({
      params: {
        path: {
          locationTrackerId: tracker.id,
        },
      },
    });
  }, [deleteTrackerMutation, tracker.id]);

  const toggleTracker = useCallback(async () => {
    const newEnabledStatus = !tracker.enabled;

    // Apply optimistic update immediately
    const previousData = applyOptimisticUpdate(newEnabledStatus);

    try {
      await updateTrackerMutation.mutateAsync({
        body: {
          id: tracker.id,
          locationId: tracker.location.id,
          notificationTypeId: tracker.notificationType.id,
          cutOffDate: tracker.cutOffDate,
          enabled: newEnabledStatus,
        },
      });
    } catch (error) {
      // Rollback on error
      revertOptimisticUpdate(previousData);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update tracker";
      showErrorCodeNotification([{ code: "GenericError", message: errorMsg }]);
    }
  }, [
    tracker,
    updateTrackerMutation,
    applyOptimisticUpdate,
    revertOptimisticUpdate,
    showErrorCodeNotification,
  ]);

  const openConfirmDelete = useCallback(() => {
    modalId.current = modals.openConfirmModal({
      title: <Text fw="bold">Delete Tracker</Text>,
      children: <ConfirmDeleteTrackerBody tracker={tracker} />,
      labels: { confirm: "Delete Tracker", cancel: "Cancel" },
      confirmProps: {
        color: "red",
        loading: deleteTrackerMutation.isPending,
      },
      withCloseButton: false,
      onConfirm: () => handleDelete(),
    });
  }, [deleteTrackerMutation.isPending, handleDelete, tracker]);

  return (
    <LocationTrackerCard
      locationTracker={tracker}
      actions={[
        {
          id: "toggle",
          button: {
            onClick: toggleTracker,
            color: tracker.enabled ? "red" : "green",
          },
          leftSection: tracker.enabled ? (
            <BellMinus size={14} />
          ) : (
            <Bell size={14} />
          ),
          children: tracker.enabled ? "Disable Tracker" : "Enable Tracker",
        },
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
