'use client';

import { feedbackControllerList } from '@services/generated/feedback/feedback';
import type { FeedbackControllerListParams } from '@services/model';
import { useQuery } from '@tanstack/react-query';

export function useAdminFeedback(params?: FeedbackControllerListParams) {
    return useQuery({
        queryKey: ['feedback', params],
        queryFn: () => feedbackControllerList(params),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true
    });
}
