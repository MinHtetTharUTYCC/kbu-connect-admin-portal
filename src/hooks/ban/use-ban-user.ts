'use client';

import { getAdminControllerGetStatsQueryKey, getAdminControllerGetUsersQueryKey } from '@services/generated/admin/admin';
import { useBanControllerBanUser } from '@services/generated/admin-ban-management/admin-ban-management';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useBanUser(onSuccess: () => void) {
    const queryClient = useQueryClient();

    return useBanControllerBanUser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getAdminControllerGetUsersQueryKey() });
                queryClient.invalidateQueries({ queryKey: getAdminControllerGetStatsQueryKey() });

                toast.success('User banned');
                onSuccess();
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
