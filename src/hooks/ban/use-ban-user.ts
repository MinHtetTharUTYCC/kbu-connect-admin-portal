'use client';

import { getAdminControllerGetStatsQueryKey, getAdminControllerGetUsersQueryKey } from '@services/generated/admin/admin';
import { useBanControllerBanUser } from '@services/generated/admin-ban-management/admin-ban-management';
import { useQueryClient } from '@tanstack/react-query';

export function useBanUser() {
    const queryClient = useQueryClient();

    return useBanControllerBanUser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getAdminControllerGetUsersQueryKey() });
                queryClient.invalidateQueries({ queryKey: getAdminControllerGetStatsQueryKey() });
            }
        }
    });
}
