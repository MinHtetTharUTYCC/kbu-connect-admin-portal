'use client';

import { feedbackControllerUpdateStatus } from '@services/generated/feedback/feedback';
import type { UpdateFeedbackStatusDto } from '@services/model';
import { useMutation } from '@tanstack/react-query';

export function useAdminUpdateFeedbackStatus() {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateFeedbackStatusDto }) => feedbackControllerUpdateStatus(id, data)
    });
}
