'use client';

import type { ReactNode } from 'react';

interface TopBarProps {
    title: string;
    actions?: ReactNode;
}

export function TopBar({ title, actions }: TopBarProps) {
    return (
        <header className="flex items-center justify-between border-b bg-background px-6 py-4">
            <h1 className="text-xl font-semibold">{title}</h1>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
    );
}
