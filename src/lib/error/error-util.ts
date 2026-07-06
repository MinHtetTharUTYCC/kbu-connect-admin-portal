import { toast } from 'sonner';

type BackendErrorLike = {
    code?: unknown;
    message?: unknown;
    response?: {
        status?: unknown;
        data?: {
            message?: unknown;
        };
    };
};

export const getBackendErrorMessage = (err: unknown, fallback = 'An unexpected error occurred'): string => {
    const error = typeof err === 'object' && err !== null ? (err as BackendErrorLike) : undefined;

    if (!error) {
        return fallback;
    }

    const code = typeof error.code === 'string' ? error.code : undefined;
    const status = typeof error.response?.status === 'number' ? error.response.status : undefined;
    const rawErrorMessage = typeof error.message === 'string' ? error.message.toLowerCase() : '';

    if (
        code === 'ECONNREFUSED' ||
        code === 'ECONNRESET' ||
        code === 'ETIMEDOUT' ||
        code === 'ENOTFOUND' ||
        code === 'EAI_AGAIN' ||
        rawErrorMessage.includes('econnrefused') ||
        rawErrorMessage.includes('network error') ||
        rawErrorMessage.includes('fetch failed')
    ) {
        return 'Server is temporarily unavailable.';
    }

    if (status && status >= 500) {
        return 'Server is having trouble right now.';
    }

    const rawMessage = error.response?.data?.message ?? error.message;

    if (Array.isArray(rawMessage)) {
        const firstError = rawMessage[0];

        if (firstError && typeof firstError === 'object' && firstError.constraints) {
            const firstConstraint = Object.values(firstError.constraints)[0];

            if (typeof firstConstraint === 'string') {
                return firstConstraint;
            }
        }

        if (typeof firstError === 'string') {
            return firstError;
        }
    }

    if (typeof rawMessage === 'string') {
        return rawMessage;
    }

    return fallback;
};

export const handleBackendError = (err: unknown, fallback = 'An unexpected error occurred') => {
    const displayMessage = getBackendErrorMessage(err, fallback);

    toast.error(displayMessage);
};
