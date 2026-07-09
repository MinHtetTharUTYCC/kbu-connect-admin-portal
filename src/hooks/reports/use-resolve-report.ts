'use client';

import { getAdminControllerGetStatsQueryKey } from '@services/generated/admin/admin';
import { getReportsControllerGetReportsQueryKey, useReportsControllerResolveReport } from '@services/generated/reports/reports';
import type { ReportsListResponseDto } from '@services/model/reportsListResponseDto';
import { useQueryClient } from '@tanstack/react-query';

export function useResolveReport() {
    const queryClient = useQueryClient();
    const reportsListQueryKey = getReportsControllerGetReportsQueryKey();

    return useReportsControllerResolveReport({
        mutation: {
            onSuccess: ({ id }) => {
                queryClient.setQueryData<ReportsListResponseDto>(reportsListQueryKey, (oldData) => {
                    if (!oldData) return oldData;

                    return { ...oldData, reports: oldData.reports.filter((report) => report.id !== id) };
                });

                queryClient.invalidateQueries({ queryKey: getAdminControllerGetStatsQueryKey() });
            }
        }
    });
}
