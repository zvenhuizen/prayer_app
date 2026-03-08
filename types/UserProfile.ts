export type PrayerFocus =
  | "personal"
  | "lifegroup"
  | "family"
  | "friends"
  | "church"
  | "thanksgiving";

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  churchId: string | null;
  prayerSchedule: {
    monday: PrayerFocus;
    tuesday: PrayerFocus;
    wednesday: PrayerFocus;
    thursday: PrayerFocus;
    friday: PrayerFocus;
    saturday: PrayerFocus;
    sunday: PrayerFocus;
  };
  reminderTimes: Array<{
    time: string;
    label: string;
    text?: string;
  }>;
};