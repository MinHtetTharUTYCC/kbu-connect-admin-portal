'use client';

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { handleBackendError } from '@/lib/error/error-util';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: true,
                        retry: 1
                    }
                },
                mutationCache: new MutationCache({
                    onError: (error, _variables, _context, mutation) => {
                        // Check if the specific hook wants to skip global handling
                        if (mutation.meta?.skipGlobalToast) {
                            return;
                        }

                        // Fall back to your standard error toast
                        handleBackendError(error);
                    }
                })
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
}
