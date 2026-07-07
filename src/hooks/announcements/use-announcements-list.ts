'use client';

import { useAdminControllerGetAnnouncements } from '@services/generated/admin/admin';
import { AdminControllerGetAnnouncementsParams } from '@services/model/adminControllerGetAnnouncementsParams';

export function useAnnouncementsList(params: AdminControllerGetAnnouncementsParams) {
    return useAdminControllerGetAnnouncements(params, {
        query: {
            staleTime: 5 * 60 * 1000 // 5 minutes
        }
    });
}
