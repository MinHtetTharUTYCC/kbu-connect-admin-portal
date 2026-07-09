'use client';

import { useReportsControllerBatchDismissReports } from '@services/generated/reports/reports';
import { useQueryClient } from '@tanstack/react-query';

export function useBatchDismissReports() {
    const queryClient = useQueryClient();

    return useReportsControllerBatchDismissReports({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/reports'] });
                queryClient.invalidateQueries({ queryKey: ['/admin/stats'] });
            }
        }
    });
}
