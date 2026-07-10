'use client';

import type { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface TopBarProps {
    title: string;
    actions?: ReactNode;
}

export function TopBar({ title, actions }: TopBarProps) {
    return (
        <header className="flex items-center justify-between border-b bg-background px-6 py-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
    );
}
