import { create } from 'zustand';

interface AuthStore {
    accessToken: string | null;
    setToken: (accessToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
    accessToken: null,
    setToken: (accessToken) =>
        set(() => ({
            accessToken
        })),
    logout: () => set({ accessToken: null })
}));
