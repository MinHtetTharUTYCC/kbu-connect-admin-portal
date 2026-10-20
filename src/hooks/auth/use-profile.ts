import { useUsersControllerGetMyProfile } from '@services/generated/users/users';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function useProfile(enabled = true) {
    const { user, setUser } = useAuthStore();
    const { data, isLoading, error } = useUsersControllerGetMyProfile({
        query: { enabled: enabled && !user, staleTime: 1000 * 60 * 10 }
    });

    useEffect(() => {
        if (data?.user) setUser({ name: data.user.name, email: data.user.email });
    }, [data, setUser]);

    return { user, isLoading, error };
}
