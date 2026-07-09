'use client';

import { useAuthControllerLoginAsAdmin } from '@services/generated/auth/auth';

export function useLogin() {
    return useAuthControllerLoginAsAdmin();
}
