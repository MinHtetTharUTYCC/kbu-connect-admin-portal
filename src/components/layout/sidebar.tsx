'use client';

import { Flag, GraduationCap, LayoutDashboard, Megaphone, ScrollText, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/reports', label: 'Reports', icon: Flag },
    { href: '/audit-logs', label: 'Audit Logs', icon: ScrollText }
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
            <div className="flex items-center gap-2 border-b px-6 py-5">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-primary">KBU Connect</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t px-6 py-4">
                <p className="text-xs text-muted-foreground">Admin Portal v0.1.0</p>
            </div>
        </aside>
    );
}
