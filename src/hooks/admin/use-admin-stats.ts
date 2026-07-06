'use client';

import { useAdminControllerGetStats } from '@services/generated/admin/admin';

export function useAdminStats() {
    return useAdminControllerGetStats({
        query: {
            staleTime: 4 * 60 * 1000,
            refetchOnWindowFocus: true
        }
    });
}
