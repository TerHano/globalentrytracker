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
import { useForm, zodResolver } from "@mantine/form";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationQuery } from "~/api/location-api";
import { notificationTypesQuery } from "~/api/notification-types-api";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { z } from "zod";
import notificationRadioCardStles from "./notification-type-radio-card.module.css";
import { Bell, BellOff, BellRing, TicketsPlane, Watch } from "lucide-react";
import type { TrackedLocation } from "~/api/tracked-locations-api";
import { useNavigate } from "react-router";
import {
  useCreateUpdateTracker,
  type CreateUpdateTrackerRequest,
} from "~/hooks/api/useCreateUpdateTracker";
import { useShowNotification } from "~/hooks/useShowNotification";
import { NotificationTypeEnum } from "~/enum/NotificationType";
import { locationStatesQuery } from "~/api/location-states-api";

interface CreateEditTrackerFormProps {
  trackedLocation?: TrackedLocation;
}

interface FormValues {
  state?: string;
  enabled: boolean;
  locationId: string;
  notificationTypeId: string;
  cutOffDate: string;
}

export const CreateEditTrackerForm = ({
  trackedLocation,
}: CreateEditTrackerFormProps) => {
  const { showNotification, showErrorCodeNotification } = useShowNotification();
  const isUpdate = !!trackedLocation;
  const navigate = useNavigate();

  const { data: appointmentLocations, isLoading: isLocationsLoading } =
    useQuery(locationQuery());
  const { data: notificationTypes, isLoading: isNotificationTypesLoading } =
    useQuery(notificationTypesQuery());
  const { data: states, isLoading: isStatesLoading } = useQuery(
    locationStatesQuery()
  );
  const isLoading =
    isLocationsLoading || isNotificationTypesLoading || isStatesLoading;

  const [filteredAppointmentLocations, setFilteredAppointmentLocations] =
    useState(appointmentLocations);
  const queryClient = useQueryClient();
  const createUpdateTrackerMutation = useCreateUpdateTracker({
    isUpdate,
    onSuccess: (_, body) => {
      const title = isUpdate
        ? "Tracker updated successfully"
        : "Tracker created successfully";
      const message = isUpdate
        ? "Tracker updated successfully"
        : "Tracker created successfully";

      showNotification({
        title,
        message,
        status: "success",
        icon: <TicketsPlane size={16} />,
      });
      const newValues = {
        enabled: body.enabled,
        locationId: body.locationId.toString(),
        notificationTypeId: body.notificationTypeId.toString(),
        cutOffDate: body.cutOffDate,
      };
      form.setInitialValues(newValues);
      //form.setValues(newValues);
      queryClient.invalidateQueries({
        queryKey: ["tracked-locations"],
      });
      queryClient.invalidateQueries({ queryKey: ["track-location"] });

      navigate("/dashboard");
    },
    onError: (error) => {
      //Check if error is of the type ApplicationError
      showErrorCodeNotification(error);
    },
  });

  const defaultNotificationType = notificationTypes?.[0].id.toString() ?? "";

  const schema = z.object({
    //make state optional
    state: z.string().optional(),
    enabled: z.boolean(),
    locationId: z
      .string({ message: "Location is required" })
      .nonempty("Location is required"),
    notificationTypeId: z.string().nonempty("Notification type is required"),
    cutOffDate: z.string().refine((date) => dayjs(date).isAfter(new Date()), {
      message: "Date must be in the future",
    }),
  });

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      enabled: true,
      locationId: "",
      notificationTypeId: defaultNotificationType,
      cutOffDate: dayjs().add(2, "week").format("YYYY-MM-DD"),
    },
    validate: zodResolver(schema),
    onValuesChange: (newValues, oldValues) => {
      if (newValues.state !== oldValues.state) {
        if (!newValues.state) {
          setFilteredAppointmentLocations(appointmentLocations);
          return;
        }
        const filteredLocations = appointmentLocations?.filter(
          (location) => location.state === newValues.state
        );
        setFilteredAppointmentLocations(filteredLocations);
        form.setFieldValue("locationId", "");
      }
    },
  });

  const appointmentLocationOptions =
    filteredAppointmentLocations?.map((location) => ({
      value: location.id.toString(),
      label: `${location.city} (${location.name})`,
      description: location.name,
    })) ?? [];

  const handleSubmit = async (values: typeof form.values) => {
    console.log("Submitting form", values);

    const requestBody: CreateUpdateTrackerRequest = {
      id: isUpdate ? trackedLocation.id : 0,
      locationId: Number(values.locationId),
      enabled: isUpdate ? values.enabled : true,
      notificationTypeId: Number(values.notificationTypeId),
      cutOffDate: values.cutOffDate,
    };

    await createUpdateTrackerMutation.mutateAsync(requestBody);
  };

  useEffect(() => {
    if (
      !form.initialized &&
      trackedLocation &&
      defaultNotificationType != undefined
    ) {
      form.initialize({
        enabled: trackedLocation.enabled,
        locationId: trackedLocation.location.id.toString(),
        notificationTypeId: trackedLocation.notificationType.id.toString(),
        cutOffDate: dayjs(trackedLocation.cutOffDate).format("YYYY-MM-DD"),
      });
    }
  }, [defaultNotificationType, form, trackedLocation]);

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
      onSubmit={form.onSubmit(handleSubmit, (errors) => console.log(errors))}
    >
      <Stack gap="lg">
        {trackedLocation ? (
          <Switch
            size="md"
            label="Enable"
            defaultChecked={trackedLocation.enabled}
            mt={3}
            color="green"
            onLabel={<BellRing size={12} />}
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

        <Group grow align="flex-start">
          <Select
            clearable={false}
            maw={100}
            withCheckIcon
            checkIconPosition="left"
            comboboxProps={{
              transitionProps: { transition: "pop", duration: 200 },
            }}
            data={states}
            label="State"
            //   description="location state"
            {...form.getInputProps("state")}
            key={form.key("state")}
          />
          <Select
            comboboxProps={{
              transitionProps: { transition: "pop", duration: 200 },
            }}
            //searchable
            withAsterisk
            maw={400}
            withCheckIcon
            checkIconPosition="left"
            data={appointmentLocationOptions}
            label="Location"
            placeholder="Pick location"
            key={form.key("locationId")}
            {...form.getInputProps("locationId")}
            //  description="Select the location you want to track."
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
          <SimpleGrid my="xs" cols={{ base: 1, sm: 2, md: 3 }}>
            {notificationTypes?.map((type) => (
              <Radio.Card
                className={notificationRadioCardStles.root}
                key={type.type}
                value={type.id.toString()}
              >
                <Group wrap="nowrap" align="flex-start">
                  <Radio.Indicator size="xs" />
                  <div>
                    <Group gap={5} align="start">
                      <Text className={notificationRadioCardStles.label}>
                        {type.name}
                      </Text>
                      {getIconForNotificationType(type.type)}
                    </Group>
                    <Text className={notificationRadioCardStles.description}>
                      {type.description}
                    </Text>
                  </div>
                </Group>
              </Radio.Card>
            ))}
          </SimpleGrid>
        </Radio.Group>
        <DatePickerInput
          modalProps={{ centered: true }}
          firstDayOfWeek={0}
          maw={300}
          withAsterisk
          description="You will only recieve alerts for appointments before this date."
          dropdownType="modal"
          label="Cutoff Date"
          placeholder="Pick date"
          key={form.key("cutOffDate")}
          {...form.getInputProps("cutOffDate")}
        />

        <Button loading={createUpdateTrackerMutation.isPending} type="submit">
          {isUpdate ? "Update Tracker" : "Create Tracker"}
        </Button>
      </Stack>
    </form>
  );
};

const getIconForNotificationType = (type: NotificationTypeEnum) => {
  const size = 19;
  switch (type) {
    case NotificationTypeEnum.Soonest:
      return <Watch size={size} />;
    case NotificationTypeEnum.Weekends:
      return <TicketsPlane size={size} />;
    default:
      return <Bell size={size} />;
  }
};
