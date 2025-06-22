import { create } from 'zustand';

interface ProfileStore {
  selectedProfile: string | null;
  setSelectedProfile: (profile: string) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  selectedProfile: null,
  setSelectedProfile: (profile) => set({ selectedProfile: profile }),
}));
