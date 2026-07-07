import { create } from 'zustand';

interface AuthUser {
    name: string;
    email: string;
}

interface AuthStore {
    accessToken: string | null;
    user: AuthUser | null;
    setToken: (accessToken: string) => void;
    setUser: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
    accessToken: null,
    user: null,
    setToken: (accessToken) =>
        set(() => ({
            accessToken
        })),
    setUser: (user) => set(() => ({ user })),
    logout: () => set({ accessToken: null, user: null })
}));
