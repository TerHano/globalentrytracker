"use client";
import {
  Button,
  Group,
  Radio,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { locationQuery } from "~/api/location-api";
import { notificationTypesQuery } from "~/api/notification-types-api";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useMemo, useState } from "react";
import { NotificationType } from "~/enum/NotificationType";
import notificationRadioCardStles from "./notification-type-radio-card.module.css";
import { Bell, BellOff } from "lucide-react";
import type { TrackedLocation } from "~/api/tracked-locations-api";

interface CreateEditTrackerFormProps {
  trackedLocation?: TrackedLocation;
}

export const CreateEditTrackerForm = ({
  trackedLocation,
}: CreateEditTrackerFormProps) => {
  const isUpdate = !!trackedLocation;

  const { data: appointmentLocations, isLoading: isLocationsLoading } =
    useQuery(locationQuery);
  const { data: notificationTypes, isLoading: isNotificationTypesLoading } =
    useQuery(notificationTypesQuery);

  const defaultNotificationType = notificationTypes?.[0].id.toString();

  const [selectedNotificationTypeId, setSelectedNotificationTypeId] = useState<
    string | undefined
  >(defaultNotificationType);

  const form = useForm({
    mode: "uncontrolled",

    initialValues: {
      enabled: true,
      locationId: "",
      notificationTypeId: defaultNotificationType,
      beforeDate: dayjs().add(2, "week").toDate(),
      dateRange: [
        dayjs().add(2, "week").toDate(),
        dayjs().add(3, "week").toDate(),
      ],
    },
    validate: {
      locationId: isNotEmpty("Location is required"),
      notificationTypeId: isNotEmpty("Notification type is required"),
      beforeDate: (value, formValues) =>
        formValues.notificationTypeId === NotificationType.Before.toString()
          ? isNotEmpty("Date is required")(value)
          : null,
      dateRange: (value, formValues) =>
        formValues.notificationTypeId === NotificationType.Between.toString()
          ? isNotEmpty("Date range is required")(value)
          : null,
    },
    onValuesChange: (values) => {
      setSelectedNotificationTypeId(values.notificationTypeId);
    },
  });

  const isLoading = isLocationsLoading || isNotificationTypesLoading;

  const appointmentLocationOptions =
    appointmentLocations?.map((location) => ({
      value: location.id.toString(),
      label: location.name,
    })) ?? [];

  const datePicker = useMemo(() => {
    const selectedNotificationType = notificationTypes?.find(
      (type) => type.id.toString() === selectedNotificationTypeId
    )?.type;
    switch (selectedNotificationType) {
      case NotificationType.Before:
        return (
          <DatePickerInput
            modalProps={{ centered: true }}
            firstDayOfWeek={0}
            maw={250}
            withAsterisk
            dropdownType="modal"
            label="I want appointments before..."
            placeholder="Pick date"
            key={form.key("beforeDate")}
            {...form.getInputProps("beforeDate")}
          />
        );
      default:
        return (
          <DatePickerInput
            modalProps={{ centered: true }}
            firstDayOfWeek={0}
            type="range"
            maw={400}
            withAsterisk
            dropdownType="modal"
            label="I want appointments between..."
            placeholder="Pick date"
            key={form.key("dateRange")}
            {...form.getInputProps("dateRange")}
          />
        );
    }
  }, [selectedNotificationTypeId]);

  useEffect(() => {
    if (trackedLocation) {
      form.initialize({
        enabled: trackedLocation.enabled,
        locationId: trackedLocation.location.id.toString(),
        notificationTypeId: trackedLocation.notificationType.id.toString(),
        beforeDate: dayjs(trackedLocation.startDate).toDate(),
        dateRange: [
          dayjs(trackedLocation.startDate).toDate(),
          dayjs(trackedLocation.endDate).toDate(),
        ],
      });
    }
  }, [trackedLocation]);

  if (isLoading) {
    return (
      <Stack>
        <Skeleton height={40} />
        <Skeleton height={100} />
        <Skeleton height={40} />
      </Stack>
    );
  }
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
      })}
    >
      <Stack gap="xl">
        {trackedLocation ? (
          <Switch
            size="md"
            label="Enabled"
            defaultChecked={trackedLocation.enabled}
            mt={3}
            color="green"
            onLabel={<Bell size={12} />}
            offLabel={<BellOff size={12} color="red" />}
            key={form.key("enabled")}
            {...form.getInputProps("enabled")}
            description={
              <Text component="span" size="xs">
                You will not receive notifications if the tracker is disabled
              </Text>
            }
          />
        ) : null}

        <Group grow align="flex-end">
          <Select
            maw={100}
            withCheckIcon
            checkIconPosition="left"
            data={[
              {
                label: "NJ",
                value: "NJ",
              },
              {
                label: "NY",
                value: "NY",
              },
            ]}
            label="State"
          />
          <Select
            withAsterisk
            maw={400}
            withCheckIcon
            checkIconPosition="left"
            data={appointmentLocationOptions}
            label="Location"
            placeholder="Pick location"
            key={form.key("locationId")}
            {...form.getInputProps("locationId")}
            description="Select the location you want to track."
          />
        </Group>
        <Radio.Group
          name="notificationType"
          label="What type of notification do you want to receive?"
          description="Select the type of notification you want to receive."
          withAsterisk
          {...form.getInputProps("notificationTypeId")}
          key={form.key("notificationTypeId")}
        >
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt="xs">
            {notificationTypes?.map((type) => (
              <Radio.Card
                className={notificationRadioCardStles.root}
                key={type.type}
                value={type.id.toString()}
              >
                <Group wrap="nowrap" align="flex-start">
                  <Radio.Indicator size="xs" />
                  <div>
                    <Text className={notificationRadioCardStles.label}>
                      {type.name}
                    </Text>
                    <Text className={notificationRadioCardStles.description}>
                      {type.description}
                    </Text>
                  </div>
                </Group>
              </Radio.Card>
            ))}
          </SimpleGrid>
        </Radio.Group>

        {datePicker}
        <Button type="submit">
          {isUpdate ? "Update Tracker" : "Create Tracker"}
        </Button>
      </Stack>
    </form>
  );
};
