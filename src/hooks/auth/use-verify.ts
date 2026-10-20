import { useAuthControllerVerifyAsAdmin } from '@services/generated/auth/auth';
import { useRouter } from 'next/navigation';
import { setAuthHint } from '@/lib/auth/auth-hint';

export function useVerify() {
    const router = useRouter();

    return useAuthControllerVerifyAsAdmin({
        mutation: {
            onSuccess: () => {
                setAuthHint('authenticated');
                router.replace('/');
            }
        }
    });
}
