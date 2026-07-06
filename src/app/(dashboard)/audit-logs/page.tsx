'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminAuditLogs } from '@/hooks/admin/use-admin-audit-logs';

export default function AuditLogsPage() {
    const [page, setPage] = useState(1);
    const limit = 20;
    const { data, isLoading } = useAdminAuditLogs({ page, limit });

    const logs = data?.logs ?? [];
    const totalPages = data ? Math.ceil(data.total / limit) : 1;

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

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {page} of {totalPages} ({data?.total ?? 0} total)
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
