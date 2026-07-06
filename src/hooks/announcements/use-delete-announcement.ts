'use client';

import { getAdminControllerGetAnnouncementsQueryKey, useAdminControllerDeleteAnnouncement } from '@services/generated/admin/admin';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useDeleteAnnouncement(onSuccess: () => void) {
    const queryClient = useQueryClient();

    return useAdminControllerDeleteAnnouncement({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getAdminControllerGetAnnouncementsQueryKey()
                });
                toast.success('Announcement deleted');
                onSuccess();
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
