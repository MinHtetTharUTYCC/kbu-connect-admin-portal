'use client';

import { getAdminControllerGetAnnouncementsQueryKey, useAdminControllerUpdateAnnouncement } from '@services/generated/admin/admin';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useUpdateAnnouncement() {
    const queryClient = useQueryClient();

    return useAdminControllerUpdateAnnouncement({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getAdminControllerGetAnnouncementsQueryKey()
                });
                toast.success('Announcement updated');
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
