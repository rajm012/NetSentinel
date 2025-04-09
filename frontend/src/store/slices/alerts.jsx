// frontend/src/store/slices/alerts.js
import { create } from 'zustand';

const useAlertStore = create((set, get) => ({
  alerts: [],
  maxAlerts: 300,

  addAlert: (newAlert) => {
    const { alerts, maxAlerts } = get();
    const updated = [...alerts, newAlert];

    if (updated.length > maxAlerts) {
      updated.shift(); // remove oldest if max limit reached
    }

    set({ alerts: updated });
  },

  clearAlerts: () => set({ alerts: [] }),

  markAsRead: (id) => {
    const { alerts } = get();
    const updated = alerts.map(alert =>
      alert.id === id ? { ...alert, read: true } : alert
    );
    set({ alerts: updated });
  },

  setMaxAlerts: (max) => set({ maxAlerts: max }),

  getUnseenCount: () => get().alerts.filter(a => !a.read).length,

  filterBySeverity: (severity) =>
    get().alerts.filter(a => a.severity === severity),
}));

export default useAlertStore;
