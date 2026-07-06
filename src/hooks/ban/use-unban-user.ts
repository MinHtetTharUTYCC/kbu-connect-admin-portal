'use client';

import { getAdminControllerGetStatsQueryKey, getAdminControllerGetUsersQueryKey } from '@services/generated/admin/admin';
import { useBanControllerUnbanUser } from '@services/generated/admin-ban-management/admin-ban-management';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useUnbanUser(onSuccess: () => void) {
    const queryClient = useQueryClient();

    return useBanControllerUnbanUser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getAdminControllerGetUsersQueryKey() });
                queryClient.invalidateQueries({ queryKey: getAdminControllerGetStatsQueryKey() });
                toast.success('User unbanned');
                onSuccess();
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
