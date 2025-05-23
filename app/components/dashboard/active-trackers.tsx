import {
  Button,
  Group,
  Image,
  Paper,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import { NavLink } from "react-router";
import {
  trackedLocationsQuery,
  type TrackedLocation,
} from "~/api/tracked-locations-api";
import { Empty } from "../ui/empty";
import noTrackersImg from "~/assets/icons/no-trackers-bell.png";
import { LocationTrackerCard } from "../location-tracker-card";
import {
  Bell,
  BellMinus,
  CalendarX,
  CircleHelp,
  PencilLine,
  Trash2,
} from "lucide-react";
import { modals } from "@mantine/modals";
import { useDeleteTracker } from "~/hooks/api/useDeleteTracker";
import { ConfirmDeleteTrackerBody } from "./confirm-delete-tracker-body";
import { useShowNotification } from "~/hooks/useShowNotification";
import { useCreateUpdateTracker } from "~/hooks/api/useCreateUpdateTracker";
import { LabelValue } from "../ui/label-value";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { nextNotificationQuery } from "~/api/next-notification-api";
import { DeleteAllTrackersButton } from "../delete-all-trackers-button";

export const ActiveTrackers = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(trackedLocationsQuery());
  const { data: nextNotification } = useQuery({
    ...nextNotificationQuery(),
    refetchInterval: 1000 * 60 * 5,
    throwOnError: false,
  });

  const nextNotificationDate = useMemo(() => {
    if (nextNotification) {
      return dayjs(nextNotification).format("MM/DD/YYYY, hh:mm A");
    }
    return "--";
  }, [nextNotification]);

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
                {({ isPending }) => (
                  <Button loading={isPending}>Add Tracker</Button>
                )}
              </NavLink>
            }
            icon={<Image h={60} w={60} src={noTrackersImg} alt="No Trackers" />}
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
            <Group justify="space-between">
              <Stack gap={0}>
                <Text fw="bold" fz={{ base: "h5", sm: "h3" }}>
                  Trackers
                </Text>
                <Text c="dimmed" fz={{ base: "xs", sm: "sm" }}>
                  Here you can see all your trackers
                </Text>
              </Stack>
              <LabelValue
                labelRightSection={
                  <Tooltip
                    multiline
                    w={200}
                    label={t(
                      "This is the next time the application will scan for appointments that match your preferences."
                    )}
                  >
                    <CircleHelp size={14} />
                  </Tooltip>
                }
                label={t("Next Check By")}
              >
                <Text c="dimmed">{nextNotificationDate}</Text>
              </LabelValue>
            </Group>
          </Stack>

          {trackedLocationsList}
        </Stack>
      </Paper>
      {data && data.length > 0 ? (
        <Group p="xs" justify="center" gap={3}>
          <Text fw={600} c="dimmed" fz="sm">
            Got your appointment?
          </Text>
          <DeleteAllTrackersButton
            buttonProps={{
              children: "Delete All Your Trackers",
              variant: "subtle",
              color: "red",
              size: "compact-xs",
              rightSection: <CalendarX size={12} />,
            }}
          />
        </Group>
      ) : null}
    </section>
  );
};

const ActionableLocationTrackerCard = ({
  tracker,
}: {
  tracker: TrackedLocation;
}) => {
  const { showNotification, showErrorCodeNotification } = useShowNotification();

  const modalId = useRef<string | null>(null);

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
    await deleteTrackerMutation.mutateAsync(tracker.id);
  }, [deleteTrackerMutation, tracker.id]);

  const toggleTracker = useCallback(async () => {
    await updateTrackerMutation.mutateAsync({
      id: tracker.id,
      locationId: tracker.location.id,
      notificationTypeId: tracker.notificationType.id,
      cutOffDate: tracker.cutOffDate,
      enabled: !tracker.enabled,
    });
  }, [tracker, updateTrackerMutation]);

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
