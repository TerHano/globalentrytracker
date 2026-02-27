import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export interface AppointmentHistoryDto {
  date: string; // DateOnly serialized as "YYYY-MM-DD"
  maxAppointments: number;
}

export const appointmentHistoryQuery = (locationId: number, days = 30) =>
  queryOptions({
    queryKey: QUERY_KEYS.APPOINTMENT_HISTORY(locationId, days),
    queryFn: async () => {
      const response = await fetchClient.GET(
        "/api/v1/location/{locationId}/history" as never,
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params: { path: { locationId }, query: { days } } as any,
          credentials: "include",
        } as never,
      );
      return validateResponse(response) as AppointmentHistoryDto[];
    },
  });
