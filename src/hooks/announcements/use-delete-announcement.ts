'use client';

import { getAdminControllerGetAnnouncementsQueryKey, useAdminControllerDeleteAnnouncement } from '@services/generated/admin/admin';
import { useQueryClient } from '@tanstack/react-query';

export function useDeleteAnnouncement() {
    const queryClient = useQueryClient();

    return useAdminControllerDeleteAnnouncement({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getAdminControllerGetAnnouncementsQueryKey()
                });
            }
        }
    });
}
