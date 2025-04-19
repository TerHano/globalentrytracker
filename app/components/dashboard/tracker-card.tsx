import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  InputWrapper,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { EllipsisVerticalIcon, PencilLine, Trash2 } from "lucide-react";
import { useCallback, useRef } from "react";
import { Link } from "react-router";
import type { TrackedLocation } from "~/api/tracked-locations-api";
import { useDeleteTracker } from "~/hooks/api/useDeleteTracker";
import { ConfirmDeleteTrackerBody } from "./confirm-delete-tracker-body";
import { NotificationTypeEnum } from "~/enum/NotificationType";
import { useShowNotification } from "~/hooks/useShowNotification";

export interface TrackerCardProps {
  tracker: TrackedLocation;
  canEdit?: boolean;
}

export const TrackerCard = ({ tracker, canEdit = true }: TrackerCardProps) => {
  const { showNotification } = useShowNotification();

  const { id, enabled, location } = tracker;
  const modalId = useRef<string | null>(null);

  console.log("TrackerCard", tracker);

  const deleteTrackerMutation = useDeleteTracker({
    onSuccess: () => {
      showNotification({
        title: "Tracker deleted successfully",
        message: "Your tracker has been deleted successfully.",
        status: "success",
        icon: <Trash2 size={16} />,
      });
      if (modalId.current) {
        modals.close(modalId.current);
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error deleting tracker",
          message: error.message,
          status: "error",
          icon: <Trash2 size={16} />,
        });
        console.error("Error deleting tracker:", error);
      }
    },
  });
  const handleDelete = useCallback(async () => {
    await deleteTrackerMutation.mutateAsync(id);
  }, [deleteTrackerMutation, id]);

  const openConfirmDelete = useCallback(() => {
    modalId.current = modals.openConfirmModal({
      title: "Are you sure?",
      children: <ConfirmDeleteTrackerBody tracker={tracker} />,

      labels: { confirm: "Delete Tracker", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleteTrackerMutation.isPending },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDelete(),
    });
  }, [deleteTrackerMutation.isPending, handleDelete, tracker]);

  const getNotificationTypeText = (type: NotificationTypeEnum) => {
    switch (type) {
      case NotificationTypeEnum.Soonest:
        return "Soonest";
      case NotificationTypeEnum.Weekends:
        return "Weekends";
    }
    return "Unknown";
  };

  return (
    <Card withBorder p="sm">
      <Stack gap={3}>
        <Flex justify="space-between" align="center">
          <Badge
            size="xs"
            radius="xs"
            color={enabled ? "green" : "red"}
            variant="light"
          >
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
          {canEdit && (
            <Menu>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <EllipsisVerticalIcon size={12} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  viewTransition
                  to={`/edit-tracker/${id}`}
                  leftSection={<PencilLine size={14} />}
                >
                  Edit Tracker
                </Menu.Item>
                <Menu.Item
                  onClick={openConfirmDelete}
                  color="red"
                  leftSection={<Trash2 size={14} />}
                >
                  Delete Tracker
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Flex>
        <Stack>
          <Text fw="bold" fz={{ base: "md", sm: "lg" }}>
            {location.name}
          </Text>

          <InputWrapper label="Notification Type">
            <Text size="xs" c="dimmed">
              {getNotificationTypeText(
                tracker.notificationType.type as NotificationTypeEnum
              )}
            </Text>
          </InputWrapper>
        </Stack>
      </Stack>
    </Card>
  );
};
