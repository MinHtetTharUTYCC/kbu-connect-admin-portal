import { AuthProvider } from '@/components/auth-provider';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <main className="flex-1 overflow-auto">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    );
}
