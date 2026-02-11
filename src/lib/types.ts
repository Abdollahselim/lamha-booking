/**
 * User Details Interface
 * Contains all personal information for the booking
 */
export interface UserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  comments: string;
  terms?: boolean;
}

/**
 * Booking State Interface
 * Represents the current state of the booking wizard
 */
export interface BookingState {
  bookingId?: string;
  service: string;
  date: Date | null;
  time: string | null;
  user: UserDetails;
  step: number;
  comments: string;
}

/**
 * Available time slots for booking
 * Formatted as 12-hour time with AM/PM
 */
export const TIME_SLOTS = [
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
  "12:00 AM",
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

/**
 * Days of the week (excluding Sunday)
 */
export const AVAILABLE_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type AvailableDay = (typeof AVAILABLE_DAYS)[number];

/**
 * Available services for booking
 */
export const SERVICES = [
  "فحص نظر عام",
  "تركيب العدسات اللاصقة",
  "اختيار الاطار",
  "تعديل العدسات",
  "صيانة",
] as const;

export type Service = (typeof SERVICES)[number];

/**
 * Booking steps for the wizard
 */
export enum BookingStep {
  SERVICE_SELECTION = 0,
  DATE_TIME = 1,
  PATIENT_INFO = 2,
  CONFIRMATION = 3,
}
