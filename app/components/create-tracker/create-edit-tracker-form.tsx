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
import { useEffect } from "react";
import { z } from "zod";
import notificationRadioCardStles from "./notification-type-radio-card.module.css";
import { Bell, BellOff } from "lucide-react";
import type { TrackedLocation } from "~/api/tracked-locations-api";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";
import {
  useCreateUpdateTracker,
  type CreateUpdateTrackerRequest,
} from "~/hooks/api/useCreateUpdateTracker";

interface CreateEditTrackerFormProps {
  trackedLocation?: TrackedLocation;
}

interface FormValues {
  enabled: boolean;
  locationId: string;
  notificationTypeId: string;
  cutOffDate: Date;
}

export const CreateEditTrackerForm = ({
  trackedLocation,
}: CreateEditTrackerFormProps) => {
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
      notifications.show({
        title,
        message,
        color: "teal",
      });
      const newValues = {
        enabled: body.enabled,
        locationId: body.locationId.toString(),
        notificationTypeId: body.notificationTypeId.toString(),
        cutOffDate: dayjs(body.cutOffDate).toDate(),
      };
      form.setInitialValues(newValues);
      form.setValues(newValues);
      queryClient.invalidateQueries({
        queryKey: ["tracked-locations"],
      });
      queryClient.invalidateQueries({ queryKey: ["track-location"] });

      navigate("/dashboard", { viewTransition: true });
    },
    onError: (error) => {
      if (error instanceof Error) {
        const title = isUpdate
          ? "Error updating tracker"
          : "Error creating tracker";
        const message = isUpdate
          ? "Failed to update tracker"
          : "Failed to create tracker";
        notifications.show({
          title,
          message,
          color: "red",
        });
      }
    },
  });

  const { data: appointmentLocations, isLoading: isLocationsLoading } =
    useQuery(locationQuery);
  const { data: notificationTypes, isLoading: isNotificationTypesLoading } =
    useQuery(notificationTypesQuery);

  const defaultNotificationType = notificationTypes?.[0].id.toString() ?? "";

  // const [selectedNotificationTypeId, setSelectedNotificationTypeId] = useState<
  //   string | undefined
  // >(defaultNotificationType);

  const schema = z.object({
    enabled: z.boolean(),
    locationId: z.string().nonempty("Location is required"),
    notificationTypeId: z.string().nonempty("Notification type is required"),
    cutOffDate: z.date().refine((date) => date > new Date(), {
      message: "Date must be in the future",
    }),
  });
  // const dateRangeSchema = z.object({
  //   enabled: z.boolean(),
  //   locationId: z.string().nonempty("Location is required"),
  //   notificationTypeId: z.string().nonempty("Notification type is required"),
  //   //daterange can be 2 dates or null
  //   dateRange: z.nullable(
  //     z.array(z.date()).refine((dates) => dates[0] < dates[1], {
  //       message: "Start date must be before end date",
  //     })
  //   ),
  // });

  //const schema = z.union([beforeDateschema, dateRangeSchema]);

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      enabled: true,
      locationId: "",
      notificationTypeId: defaultNotificationType,
      cutOffDate: dayjs().add(2, "week").toDate(),
    },
    validate: zodResolver(schema),
    // onValuesChange: (values) => {
    //   setSelectedNotificationTypeId(values.notificationTypeId);
    // },
  });

  const isLoading = isLocationsLoading || isNotificationTypesLoading;

  const appointmentLocationOptions =
    appointmentLocations?.map((location) => ({
      value: location.id.toString(),
      label: location.name,
    })) ?? [];

  // const datePicker = useMemo(() => {
  //   const selectedNotificationType = notificationTypes?.find(
  //     (type) => type.id.toString() === selectedNotificationTypeId
  //   )?.type;
  //   switch (selectedNotificationType) {
  //     case NotificationType.Before:
  //       return (
  //         <DatePickerInput
  //           modalProps={{ centered: true }}
  //           firstDayOfWeek={0}
  //           maw={250}
  //           withAsterisk
  //           dropdownType="modal"
  //           label="I want appointments before..."
  //           placeholder="Pick date"
  //           key={form.key("beforeDate")}
  //           {...form.getInputProps("beforeDate")}
  //         />
  //       );
  //     default:
  //       return (
  //         <DatePickerInput
  //           modalProps={{ centered: true }}
  //           firstDayOfWeek={0}
  //           type="range"
  //           maw={400}
  //           withAsterisk
  //           dropdownType="modal"
  //           label="I want appointments between..."
  //           placeholder="Pick date"
  //           key={form.key("dateRange")}
  //           {...form.getInputProps("dateRange")}
  //         />
  //       );
  //   }
  // }, [notificationTypes, selectedNotificationTypeId, form]);

  const handleSubmit = async (values: typeof form.values) => {
    console.log("Submitting form", values);

    const cutOffString = dayjs(values.cutOffDate).format("YYYY-MM-DD");

    const requestBody: CreateUpdateTrackerRequest = {
      id: isUpdate ? trackedLocation.id : 0,
      locationId: Number(values.locationId),
      enabled: isUpdate ? values.enabled : true,
      notificationTypeId: Number(values.notificationTypeId),
      cutOffDate: cutOffString,
    };

    await createUpdateTrackerMutation.mutateAsync(requestBody);
  };

  useEffect(() => {
    if (
      !form.initialized &&
      trackedLocation &&
      defaultNotificationType != undefined
    ) {
      console.log(form.initialized);
      console.log("Tracked location", trackedLocation);
      form.initialize({
        enabled: trackedLocation.enabled,
        locationId: trackedLocation.location.id.toString(),
        notificationTypeId: trackedLocation.notificationType.id.toString(),
        cutOffDate: dayjs(trackedLocation.cutOffDate).toDate(),
      });
      // setSelectedNotificationTypeId(
      //   trackedLocation.notificationType.id.toString()
      // );
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
            clearable={false}
            maw={100}
            withCheckIcon
            checkIconPosition="left"
            comboboxProps={{
              transitionProps: { transition: "pop", duration: 200 },
            }}
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
            comboboxProps={{
              transitionProps: { transition: "pop", duration: 200 },
            }}
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
        <DatePickerInput
          modalProps={{ centered: true }}
          firstDayOfWeek={0}
          maw={200}
          withAsterisk
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
