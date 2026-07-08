'use client';

import { useReportsControllerGetReports } from '@services/generated/reports/reports';
import type { ReportsControllerGetReportsParams } from '@services/model';

export function useReports(params: ReportsControllerGetReportsParams) {
    return useReportsControllerGetReports(params, {
        query: {
            staleTime: 30_000
        }
    });
}
