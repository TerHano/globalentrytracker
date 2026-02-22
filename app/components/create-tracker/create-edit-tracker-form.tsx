"use client";
import {
  Button,
  Group,
  Radio,
  SimpleGrid,
  Skeleton,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationTypesQuery } from "~/api/notification-types-api";
import { DatePickerInput } from "@mantine/dates";
import { useEffect } from "react";
import { z } from "zod";
import notificationRadioCardStles from "./notification-type-radio-card.module.css";
import { Bell, BellOff, BellRing, TicketsPlane, Watch } from "lucide-react";
import { useNavigate } from "react-router";
import {
  useCreateUpdateTracker,
  type CreateUpdateTrackerRequest,
} from "~/hooks/api/useCreateUpdateTracker";
import { useShowNotification } from "~/hooks/useShowNotification";
import { NotificationTypeEnum } from "~/enum/NotificationType";
import type { components } from "~/types/api";
import { locationsQuery } from "~/api/location-api";
import { LocationGroupCombobox } from "./location-group-combobox";

interface CreateEditTrackerFormProps {
  trackedLocation?: components["schemas"]["TrackedLocationForUserDto"];
}

interface FormValues {
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
    useQuery(locationsQuery());
  const { data: notificationTypes, isLoading: isNotificationTypesLoading } =
    useQuery(notificationTypesQuery());
  const isLoading = isLocationsLoading || isNotificationTypesLoading;

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
      if (body) {
        const newValues = {
          enabled: body.enabled,
          locationId: body.locationId.toString(),
          notificationTypeId: body.notificationTypeId.toString(),
          cutOffDate: body.cutOffDate,
        };
        form.setInitialValues(newValues);
      }
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

  const defaultNotificationType =
    notificationTypes?.at(0)?.id?.toString() ?? "";

  const schema = z.object({
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
  });

  const handleSubmit = async (values: typeof form.values) => {
    console.log("Submitting form", values);

    const requestBody: CreateUpdateTrackerRequest = {
      id: isUpdate ? trackedLocation.id : 0,
      locationId: Number(values.locationId),
      enabled: isUpdate ? values.enabled : true,
      notificationTypeId: Number(values.notificationTypeId),
      cutOffDate: values.cutOffDate,
    };

    await createUpdateTrackerMutation.mutateAsync({ body: requestBody });
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

        <Stack gap="xs">
          <Text fw={500} size="sm">
            Airport Location <span style={{ color: "red" }}>*</span>
          </Text>
          <LocationGroupCombobox
            locations={appointmentLocations}
            value={form.values.locationId || ""}
            onChange={(value) => {
              const finalValue = value ?? "";
              form.setFieldValue("locationId", finalValue);
            }}
            placeholder="Search by city, state, or airport name"
          />
          {form.errors.locationId && (
            <Text size="xs" c="red">
              {form.errors.locationId}
            </Text>
          )}
        </Stack>

        <Radio.Group
          name="notificationType"
          label="What type of notification do you want to receive?"
          description="Select the type of notification you want to receive."
          withAsterisk
          {...form.getInputProps("notificationTypeId")}
          key={form.key("notificationTypeId")}
        >
          <SimpleGrid my="xs" cols={{ base: 1, sm: 2, md: 3 }}>
            {(notificationTypes ?? []).map((type) => (
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
