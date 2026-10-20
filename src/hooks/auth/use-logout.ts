'use client';

import { useAuthControllerLogout } from '@services/generated/auth/auth';
import { useRouter } from 'next/navigation';
import { setAuthHint } from '@/lib/auth/auth-hint';
import { useAuthStore } from '@/stores/auth-store';

export function useLogout() {
    const router = useRouter();
    const clearUser = useAuthStore((state) => state.clearUser);

    return useAuthControllerLogout({
        mutation: {
            onSuccess: () => {
                clearUser();
                setAuthHint('unauthenticated');
                router.replace('/login');
            }
        }
    });
}
