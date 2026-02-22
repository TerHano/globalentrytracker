"use client";
import {
  Button,
  Group,
  Radio,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { useQueryClient } from "@tanstack/react-query";
import notificationRadioCardStles from "./notification-type-radio-card.module.css";
import { Bell, BellOff, BellRing, TicketsPlane, Watch } from "lucide-react";
import { useNavigate } from "react-router";
import { useCreateUpdateTracker } from "~/hooks/api/useCreateUpdateTracker";
import { useShowNotification } from "~/hooks/useShowNotification";
import { NotificationTypeEnum } from "~/enum/NotificationType";
import type { components } from "~/types/api";
import { LocationGroupCombobox } from "./location-group-combobox";
import {
  getDefaultNotificationTypeId,
  getInitialTrackerFormValues,
  toCreateUpdateTrackerRequest,
  toTrackerFormValues,
} from "./form-mappers";
import {
  createEditTrackerFormSchema,
  type TrackerFormValues,
} from "./form-schema";

interface CreateEditTrackerFormProps {
  trackedLocation?: components["schemas"]["TrackedLocationForUserDto"];
  locations: components["schemas"]["AppointmentLocationDto"][];
  notificationTypes: components["schemas"]["NotificationTypeDto"][];
}

export const CreateEditTrackerForm = ({
  trackedLocation,
  locations,
  notificationTypes,
}: CreateEditTrackerFormProps) => {
  const { showNotification, showErrorCodeNotification } = useShowNotification();
  const isUpdate = !!trackedLocation;
  const navigate = useNavigate();

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
        const newValues = toTrackerFormValues(body);
        form.setValues(newValues);
        form.setInitialValues(newValues);
      }
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

  const defaultNotificationTypeId =
    getDefaultNotificationTypeId(notificationTypes);

  const form = useForm<TrackerFormValues>({
    mode: "controlled",
    initialValues: getInitialTrackerFormValues({
      trackedLocation,
      defaultNotificationTypeId,
    }),
    validate: zodResolver(createEditTrackerFormSchema),
  });

  const handleSubmit = async (values: TrackerFormValues) => {
    const requestBody = toCreateUpdateTrackerRequest({
      values,
      isUpdate,
      trackedLocation,
    });

    await createUpdateTrackerMutation.mutateAsync({ body: requestBody });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        {trackedLocation ? (
          <Switch
            size="md"
            label="Tracker Enabled"
            mt={3}
            color="green"
            onLabel={<BellRing size={12} />}
            offLabel={<BellOff size={12} color="red" />}
            {...form.getInputProps("enabled", { type: "checkbox" })}
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
            locations={locations}
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
          mt="xs"
          withAsterisk
          {...form.getInputProps("notificationTypeId")}
        >
          <SimpleGrid my="xs" cols={{ base: 1, sm: 2, md: 3 }}>
            {(notificationTypes ?? []).map((type) => (
              <Radio.Card
                className={notificationRadioCardStles.root}
                key={type.type}
                value={type.id.toString()}
              >
                <Group wrap="nowrap" align="flex-start" gap="sm">
                  <Radio.Indicator mt={2} size="xs" />
                  <div className={notificationRadioCardStles.content}>
                    <Group justify="space-between" align="center" gap="xs">
                      <Text className={notificationRadioCardStles.label}>
                        {type.name}
                      </Text>
                      <span className={notificationRadioCardStles.iconWrapper}>
                        {getIconForNotificationType(type.type)}
                      </span>
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
          w="100%"
          withAsterisk
          valueFormat="MMM D, YYYY"
          minDate={new Date()}
          description="Only notify me for appointments on or before this date."
          dropdownType="modal"
          label="Latest Appointment Date"
          placeholder="Select latest date"
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
