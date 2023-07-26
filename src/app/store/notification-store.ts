import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { clearAllNotifications } from "../utils/notification.util";

export interface NotificationStore {
  numOfNewNotifications: number;
  increaseNumOfNewNotifications: (value?: number) => void; // default increase by 1
  refreshNumOfNewNotifications: () => void;
  getNumOfNewNotifcations: () => number;
}

// Use persist to store data in local storage
// Zustand will handle the data sync between local storage and in-app state
export const useNotificationStore = create<NotificationStore>()(
  subscribeWithSelector((set, get) => ({
    numOfNewNotifications: 0,
    increaseNumOfNewNotifications: async (value = 1) => {
      if(value <= 0) return;
      set((state) => ({
        numOfNewNotifications: state.numOfNewNotifications + value,
      }));
    },
    refreshNumOfNewNotifications: async () => {
      set({ numOfNewNotifications: 0 });
      await clearAllNotifications();
    },
    getNumOfNewNotifcations: () => get().numOfNewNotifications,
  }))
);