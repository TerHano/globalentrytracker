import dayjs from "dayjs";
import { z } from "zod";

export interface TrackerFormValues {
  enabled: boolean;
  locationId: string;
  notificationTypeId: string;
  cutOffDate: string;
}

export const createEditTrackerFormSchema = z.object({
  enabled: z.boolean(),
  locationId: z
    .string({ message: "Location is required" })
    .nonempty("Location is required"),
  notificationTypeId: z.string().nonempty("Notification type is required"),
  cutOffDate: z.string().refine((date) => dayjs(date).isAfter(new Date()), {
    message: "Date must be in the future",
  }),
});
