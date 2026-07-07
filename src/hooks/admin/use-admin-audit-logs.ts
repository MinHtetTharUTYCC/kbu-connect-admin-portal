'use client';

import { useAdminControllerGetAuditLogs } from '@services/generated/admin/admin';
import type { AdminControllerGetAuditLogsParams } from '@services/model';

export function useAdminAuditLogs(params?: AdminControllerGetAuditLogsParams) {
    return useAdminControllerGetAuditLogs(params, {
        query: {
            staleTime: 5 * 60 * 1000
        }
    });
}
