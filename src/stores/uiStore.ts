import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  modalOpen: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  modalOpen: null,
  openModal: (id: string) => set({ modalOpen: id }),
  closeModal: () => set({ modalOpen: null }),
  toast: null,
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 5000);
  },
  hideToast: () => set({ toast: null }),
}));



