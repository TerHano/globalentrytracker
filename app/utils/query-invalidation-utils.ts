import { type QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/api/query-keys";

/**
 * Invalidates all tracked location related queries
 */
export function invalidateTrackedLocationQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.TRACKED_LOCATIONS,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.TRACKED_LOCATION,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.NOTIFICATION_CHECK,
    }),
  ]);
}

/**
 * Invalidates a specific tracked location query by ID
 */
export function invalidateTrackedLocationById(
  queryClient: QueryClient,
  locationTrackerId: number
) {
  return queryClient.invalidateQueries({
    queryKey: [...QUERY_KEYS.TRACKED_LOCATION, locationTrackerId],
  });
}

/**
 * Invalidates user-related queries
 */
export function invalidateUserQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.ME,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.PERMISSIONS,
    }),
  ]);
}

/**
 * Invalidates notification related queries
 */
export function invalidateNotificationQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.NOTIFICATION_CHECK,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.NOTIFICATION_TYPES,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.ALL_NOTIFICATION_SETTINGS,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.EMAIL_NOTIFICATION_SETTINGS,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.DISCORD_NOTIFICATION_SETTINGS,
    }),
  ]);
}
