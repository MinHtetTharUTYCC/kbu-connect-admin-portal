'use client';

import { useReportsControllerResolveReport } from '@services/generated/reports/reports';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useResolveReport() {
    const queryClient = useQueryClient();

    return useReportsControllerResolveReport({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/reports'] });
                queryClient.invalidateQueries({ queryKey: ['/admin/stats'] });
                toast.success('Report resolved');
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
