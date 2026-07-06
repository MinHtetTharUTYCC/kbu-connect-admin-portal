import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';

export const metadata: Metadata = {
    title: 'KBU Connect Admin',
    description: 'Admin portal for KBU Connect'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    {children}
                    <Toaster position="top-right" richColors />
                </QueryProvider>
            </body>
        </html>
    );
}
