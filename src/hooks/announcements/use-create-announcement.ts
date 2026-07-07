'use client';

import { getAdminControllerGetAnnouncementsQueryKey, useAdminControllerCreateAnnouncement } from '@services/generated/admin/admin';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useCreateAnnouncement(onSuccess: () => void) {
    const queryClient = useQueryClient();

    return useAdminControllerCreateAnnouncement({
        mutation: {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: getAdminControllerGetAnnouncementsQueryKey()
                });

                toast.success('Announcement created and broadcasted');
                onSuccess();
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
