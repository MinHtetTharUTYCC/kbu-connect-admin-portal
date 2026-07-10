'use client';

import { Ban, Bell, Heart, Megaphone, MessageCircle, ShieldAlert, ThumbsUp, Users } from 'lucide-react';
import { TopBar } from '@/components/layout/top-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/admin/use-admin-stats';

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function StatRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

function SkeletonCards({ count = 7 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={`skeleton-${i}`}>
                    <CardContent className="flex h-24 items-center justify-center">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const { data: stats, isLoading } = useAdminStats();

    return (
        <div>
            <TopBar title="Dashboard" />
            <div className="space-y-6 p-6">
                {isLoading ? (
                    <SkeletonCards />
                ) : stats ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <StatCard title="Total Users" value={stats.users.total} icon={Users} />
                            <StatCard title="Total Matches" value={stats.matches.total} icon={Heart} />
                            <StatCard title="Total Messages" value={stats.messages.total} icon={MessageCircle} />
                            <StatCard title="Total Swipes" value={stats.swipes.total} icon={ThumbsUp} />
                            <StatCard title="Pending Reports" value={stats.reports.pending} icon={ShieldAlert} />
                            <StatCard title="Notifications" value={stats.notifications.total} icon={Bell} />
                            <StatCard title="Shoutouts" value={stats.shoutouts.total} icon={Megaphone} />
                            <StatCard title="Banned Users" value={stats.users.banned} icon={Ban} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4" />
                                        Users Breakdown
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <StatRow label="Admins" value={stats.users.admins} />
                                    <StatRow label="Profile Complete" value={stats.users.profileComplete} />
                                    <StatRow label="New (7 days)" value={stats.users.newLast7Days} />
                                    <StatRow label="New (30 days)" value={stats.users.newLast30Days} />
                                    {Object.entries(stats.users.byGender).length > 0 && (
                                        <>
                                            <div className="border-t pt-2">
                                                <p className="mb-1 text-xs font-medium text-muted-foreground">By Gender</p>
                                            </div>
                                            {Object.entries(stats.users.byGender).map(([gender, count]) => (
                                                <StatRow key={gender} label={gender} value={count} />
                                            ))}
                                        </>
                                    )}
                                    {Object.entries(stats.users.byFaculty).length > 0 && (
                                        <>
                                            <div className="border-t pt-2">
                                                <p className="mb-1 text-xs font-medium text-muted-foreground">By Faculty</p>
                                            </div>
                                            {Object.entries(stats.users.byFaculty).map(([faculty, count]) => (
                                                <StatRow key={faculty} label={faculty} value={count} />
                                            ))}
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <Heart className="h-4 w-4" />
                                        Matches & Swipes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <StatRow label="Active Matches" value={stats.matches.active} />
                                    <StatRow label="Unmatched" value={stats.matches.unmatched} />
                                    <StatRow label="Matches (7 days)" value={stats.matches.newLast7Days} />
                                    <StatRow label="Matches (30 days)" value={stats.matches.newLast30Days} />
                                    <div className="border-t pt-2">
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Swipes</p>
                                    </div>
                                    <StatRow label="Likes" value={stats.swipes.likes} />
                                    <StatRow label="Dislikes" value={stats.swipes.dislikes} />
                                    <StatRow label="New (7 days)" value={stats.swipes.newLast7Days} />
                                    <StatRow label="New (30 days)" value={stats.swipes.newLast30Days} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <MessageCircle className="h-4 w-4" />
                                        Messages & Reports
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <StatRow label="Conversations" value={stats.messages.totalConversations} />
                                    <StatRow label="New (7 days)" value={stats.messages.newLast7Days} />
                                    <StatRow label="New (30 days)" value={stats.messages.newLast30Days} />
                                    <div className="border-t pt-2">
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Reports</p>
                                    </div>
                                    <StatRow label="Total" value={stats.reports.total} />
                                    <StatRow label="Pending" value={stats.reports.pending} />
                                    <StatRow label="Resolved" value={stats.reports.resolved} />
                                    <StatRow label="Dismissed" value={stats.reports.dismissed} />
                                    <StatRow label="New (7 days)" value={stats.reports.newLast7Days} />
                                    {Object.entries(stats.notifications.byType).length > 0 && (
                                        <>
                                            <div className="border-t pt-2">
                                                <p className="mb-1 text-xs font-medium text-muted-foreground">Notifications by Type</p>
                                            </div>
                                            {Object.entries(stats.notifications.byType).map(([type, count]) => (
                                                <StatRow key={type} label={type} value={count} />
                                            ))}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
