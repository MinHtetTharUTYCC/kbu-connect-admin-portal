'use client';

import { feedbackControllerRemove } from '@services/generated/feedback/feedback';
import { useMutation } from '@tanstack/react-query';

export function useAdminDeleteFeedback() {
    return useMutation({
        mutationFn: (id: string) => feedbackControllerRemove(id)
    });
}
