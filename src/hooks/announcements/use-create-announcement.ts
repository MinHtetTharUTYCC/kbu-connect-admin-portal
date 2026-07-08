'use client';

import { getAdminControllerGetAnnouncementsQueryKey, useAdminControllerCreateAnnouncement } from '@services/generated/admin/admin';
import { useQueryClient } from '@tanstack/react-query';

export function useCreateAnnouncement() {
    const queryClient = useQueryClient();

    return useAdminControllerCreateAnnouncement({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getAdminControllerGetAnnouncementsQueryKey()
                });
            }
        }
    });
}
