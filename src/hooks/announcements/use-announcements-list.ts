'use client';

import { useAdminControllerGetAnnouncements } from '@services/generated/admin/admin';

export function useAnnouncementsList(page = 1, limit = 20) {
    return useAdminControllerGetAnnouncements(
        { page, limit },
        {
            query: {
                staleTime: 5 * 60 * 1000 // 5 minutes
            }
        }
    );
}
