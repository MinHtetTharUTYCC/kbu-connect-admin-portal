'use client';

import { getAdminControllerGetAnnouncementsQueryKey, useAdminControllerUpdateAnnouncement } from '@services/generated/admin/admin';
import { useQueryClient } from '@tanstack/react-query';

export function useUpdateAnnouncement() {
    const queryClient = useQueryClient();

    return useAdminControllerUpdateAnnouncement({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getAdminControllerGetAnnouncementsQueryKey()
                });
            }
        }
    });
}
