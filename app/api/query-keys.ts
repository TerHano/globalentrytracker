export const QUERY_KEYS = {
  // User related
  ME: ["me"],
  PERMISSIONS: ["permissions"],

  // Subscription related
  SUBSCRIPTION: ["subscription"],
  PLANS: ["plans"],

  // Locations related
  LOCATIONS: ["locations"],
  LOCATION_STATES: ["location-states"],
  TRACKED_LOCATIONS: ["tracked-locations"],
  TRACKED_LOCATION: ["tracked-location"],

  // Notifications related
  NOTIFICATION_CHECK: ["notification-check"],
  NOTIFICATION_TYPES: ["notification-types"],
  NEXT_NOTIFICATION: ["next-notification"],
  ALL_NOTIFICATION_SETTINGS: ["all-notification-settings"],
  EMAIL_NOTIFICATION_SETTINGS: ["email-notification-settings"],
  DISCORD_NOTIFICATION_SETTINGS: ["discord-notification-settings"],

  // Admin related
  ALL_USERS: ["admin", "users"],
  ALL_ROLES: ["admin", "roles"],
} as const;
