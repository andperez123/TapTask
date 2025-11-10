export const APP_TITLE = "TapTask";
export const APP_DESCRIPTION = "The marketplace for iPhone automations";

export const CATEGORIES = [
  "Productivity",
  "Entertainment",
  "Utilities",
  "Health",
  "Social",
  "Education",
] as const;

export type Category = typeof CATEGORIES[number];




