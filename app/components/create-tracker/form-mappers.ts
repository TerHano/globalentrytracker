import dayjs from "dayjs";
import type { CreateUpdateTrackerRequest } from "~/hooks/api/useCreateUpdateTracker";
import type { components } from "~/types/api";
import type { TrackerFormValues } from "./form-schema";

type TrackedLocation = components["schemas"]["TrackedLocationForUserDto"];
type NotificationType = components["schemas"]["NotificationTypeDto"];

interface InitialValuesArgs {
  trackedLocation?: TrackedLocation;
  defaultNotificationTypeId: string;
}

interface ToRequestBodyArgs {
  values: TrackerFormValues;
  isUpdate: boolean;
  trackedLocation?: TrackedLocation;
}

export const getDefaultNotificationTypeId = (
  notificationTypes: NotificationType[],
) => notificationTypes.at(0)?.id?.toString() ?? "";

export const getInitialTrackerFormValues = ({
  trackedLocation,
  defaultNotificationTypeId,
}: InitialValuesArgs): TrackerFormValues => {
  if (trackedLocation) {
    return {
      enabled: trackedLocation.enabled,
      locationId: trackedLocation.location.id.toString(),
      notificationTypeId: trackedLocation.notificationType.id.toString(),
      cutOffDate: dayjs(trackedLocation.cutOffDate).format("YYYY-MM-DD"),
    };
  }

  return {
    enabled: true,
    locationId: "",
    notificationTypeId: defaultNotificationTypeId,
    cutOffDate: dayjs().add(2, "week").format("YYYY-MM-DD"),
  };
};

export const toCreateUpdateTrackerRequest = ({
  values,
  isUpdate,
  trackedLocation,
}: ToRequestBodyArgs): CreateUpdateTrackerRequest & { id: number } => ({
  id: isUpdate && trackedLocation ? trackedLocation.id : 0,
  locationId: Number(values.locationId),
  enabled: isUpdate ? values.enabled : true,
  notificationTypeId: Number(values.notificationTypeId),
  cutOffDate: values.cutOffDate,
});

export const toTrackerFormValues = (
  requestBody: CreateUpdateTrackerRequest,
): TrackerFormValues => ({
  enabled: requestBody.enabled,
  locationId: requestBody.locationId.toString(),
  notificationTypeId: requestBody.notificationTypeId.toString(),
  cutOffDate: requestBody.cutOffDate,
});
