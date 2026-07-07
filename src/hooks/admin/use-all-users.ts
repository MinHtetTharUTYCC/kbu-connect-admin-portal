'use client';

import { useAdminControllerGetUsers } from '@services/generated/admin/admin';
import type { AdminControllerGetUsersParams } from '@services/model';

export function useAllUsers(params: AdminControllerGetUsersParams) {
    return useAdminControllerGetUsers(params, {
        query: {
            staleTime: 1000 * 60 * 5 // 5 minutes
        }
    });
}
