// frontend/src/store/slices/ui.js
import { create } from 'zustand';

const useUIStore = create((set) => ({
  darkMode: false,
  sidebarOpen: true,
  activeView: 'realtime', // other values: 'historical', 'intel'
  activeModal: null,      // modal identifiers e.g., 'alertDetails', 'packetInfo'

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setView: (view) => set({ activeView: view }),
  openModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null }),
}));

export default useUIStore;
