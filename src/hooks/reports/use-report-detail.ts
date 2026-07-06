'use client';

import { useReportsControllerGetReportDetails } from '@services/generated/reports/reports';

export function useReportDetail(id: string) {
    return useReportsControllerGetReportDetails(id, {
        query: {
            staleTime: 60_000,
            enabled: !!id
        }
    });
}
