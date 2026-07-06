import { useAuthControllerVerify } from '@services/generated/auth/auth';
import { useRouter } from 'next/navigation';
import { handleBackendError } from '@/lib/error/error-util';
import { useAuthStore } from '@/stores/auth-store';

export function useVerify() {
    const router = useRouter();

    const { setToken } = useAuthStore();

    return useAuthControllerVerify({
        mutation: {
            onSuccess: (data) => {
                setToken(data.access_token);

                router.replace('/');
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
