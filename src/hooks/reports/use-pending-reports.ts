'use client';

import { useReportsControllerGetPendingReports } from '@services/generated/reports/reports';

export function usePendingReports() {
    return useReportsControllerGetPendingReports({
        query: {
            staleTime: 30_000
        }
    });
}
