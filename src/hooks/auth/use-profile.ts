'use client';

import { useUsersControllerGetMyProfile } from '@services/generated/users/users';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function useProfile() {
    const { user, setUser, accessToken } = useAuthStore();

    const { data, isLoading } = useUsersControllerGetMyProfile({
        query: {
            enabled: !!accessToken && !user,
            staleTime: 1000 * 60 * 10
        }
    });

    useEffect(() => {
        if (data?.user) {
            setUser({ name: data.user.name, email: data.user.email });
        }
    }, [data, setUser]);

    return { user, isLoading };
}
