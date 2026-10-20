'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useProfile } from '@/hooks/auth/use-profile';
import { setAuthHint } from '@/lib/auth/auth-hint';

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { user, isLoading, error } = useProfile(true);
    const unauthorized = (error as { statusCode?: number } | null)?.statusCode === 401;

    useEffect(() => {
        if (unauthorized) {
            setAuthHint('unauthenticated');
            router.replace('/login');
        } else if (!isLoading && user) {
            setAuthHint('authenticated');
        }
    }, [isLoading, router, unauthorized, user]);

    return children;
}
