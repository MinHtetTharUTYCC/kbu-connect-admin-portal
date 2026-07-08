'use client';

import { getAdminControllerGetStatsQueryKey, getAdminControllerGetUsersQueryKey } from '@services/generated/admin/admin';
import { useBanControllerUnbanUser } from '@services/generated/admin-ban-management/admin-ban-management';
import { useQueryClient } from '@tanstack/react-query';

export function useUnbanUser() {
    const queryClient = useQueryClient();

    return useBanControllerUnbanUser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getAdminControllerGetUsersQueryKey() });
                queryClient.invalidateQueries({ queryKey: getAdminControllerGetStatsQueryKey() });
            }
        }
    });
}
