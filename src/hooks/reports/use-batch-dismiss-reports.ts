'use client';

import { useReportsControllerBatchDismissReports } from '@services/generated/reports/reports';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useBatchDismissReports() {
    const queryClient = useQueryClient();

    return useReportsControllerBatchDismissReports({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/reports'] });
                queryClient.invalidateQueries({ queryKey: ['/admin/stats'] });
                toast.success('Reports dismissed');
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
