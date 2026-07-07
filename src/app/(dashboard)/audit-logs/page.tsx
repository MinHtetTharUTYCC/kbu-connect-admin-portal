'use client';

import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminAuditLogs } from '@/hooks/admin/use-admin-audit-logs';

function AuditLogsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = 20;

    const { data, isLoading } = useAdminAuditLogs({ page, limit });

    const logs = data?.logs ?? [];
    const totalPages = data ? Math.ceil(data.total / limit) : 1;

    const setPage = useCallback(
        (p: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (p <= 1) {
                params.delete('page');
            } else {
                params.set('page', String(p));
            }
            router.replace(`/audit-logs?${params.toString()}`);
        },
        [searchParams, router]
    );

    return (
        <div>
            <TopBar title="Audit Logs" />
            <div className="p-6">
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 animate-pulse rounded bg-muted" />
                        ))}
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Actor</TableHead>
                                    <TableHead>Target</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-sm">{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{log.action}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="font-medium">{log.actor.name}</p>
                                                <p className="text-muted-foreground">{log.actor.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {log.target ? (
                                                <div className="text-sm">
                                                    <p className="font-medium">{log.target.name}</p>
                                                    <p className="text-muted-foreground">{log.target.email}</p>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Pagination page={page} totalPages={totalPages} total={data?.total ?? 0} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    );
}

export default function AuditLogsPage() {
    return (
        <Suspense>
            <AuditLogsContent />
        </Suspense>
    );
}
