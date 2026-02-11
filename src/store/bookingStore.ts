import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookingState, UserDetails, Service, TimeSlot } from "@/lib/types";
import { BookingStep } from "@/lib/types";

/**
 * Extended Zustand store for booking state management
 */
interface BookingStoreState extends BookingState {
  setBookingId: (id: string) => void;
  setStep: (step: number) => void;
  setService: (service: Service) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: TimeSlot | null) => void;
  setUserDetails: (user: UserDetails) => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

/**
 * Initial state for the booking store
 */
const initialState: BookingState = {
  bookingId: "",
  service: "",
  date: null,
  time: null,
  comments: "",
  user: {
    firstName: "",
    lastName: "",
    phone: "",
    comments: "",
  },
  step: BookingStep.SERVICE_SELECTION,
};

/**
 * Zustand store with persistence middleware
 */
export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setBookingId: (id: string) => {
        set({ bookingId: id });
      },

      setStep: (step: number) => {
        if (step >= 0 && step <= 3) {
          set({ step });
        }
      },

      setService: (service: Service) => {
        set({ service });
      },

      setDate: (date: Date | null) => {
        set({ date });
      },

      setTime: (time: TimeSlot | null) => {
        set({ time });
      },

      setUserDetails: (user: UserDetails) => {
        set({ user });
      },

      nextStep: () => {
        set((state) => ({
          step: Math.min(state.step + 1, 3),
        }));
      },

      prevStep: () => {
        set((state) => ({
          step: Math.max(state.step - 1, 0),
        }));
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "booking-store",
      storage: {
        getItem: (name: string) => {
          if (typeof window === "undefined") return null;
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name: string, value: unknown) => {
          if (typeof window === "undefined") return;
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          if (typeof window === "undefined") return;
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
