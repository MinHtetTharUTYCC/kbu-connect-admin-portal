import { useAuthControllerVerifyAsAdmin } from '@services/generated/auth/auth';
import { useAuthStore } from '@/stores/auth-store';

export function useVerify() {
    const { setToken } = useAuthStore();

    return useAuthControllerVerifyAsAdmin({
        mutation: {
            onSuccess: (data) => {
                setToken(data.access_token);
            }
        }
    });
}
