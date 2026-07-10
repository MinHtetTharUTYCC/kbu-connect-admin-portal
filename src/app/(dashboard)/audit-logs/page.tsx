'use client';

import type { AuditLogItemDto } from '@services/model';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useMemo } from 'react';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { TopBar } from '@/components/layout/top-bar';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
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

    const columns = useMemo<ColumnDef<AuditLogItemDto>[]>(
        () => [
            {
                accessorKey: 'timestamp',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Timestamp" />,
                cell: ({ row }) => <span className="text-sm">{format(new Date(row.original.timestamp), 'MMM d, yyyy HH:mm:ss')}</span>
            },
            {
                accessorKey: 'action',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
                cell: ({ row }) => <Badge variant="outline">{row.original.action}</Badge>
            },
            {
                id: 'actor',
                accessorFn: (row) => row.actor.name,
                header: ({ column }) => <DataTableColumnHeader column={column} title="Actor" />,
                cell: ({ row }) => (
                    <div className="text-sm">
                        <p className="font-medium">{row.original.actor.name}</p>
                        <p className="text-muted-foreground">{row.original.actor.email}</p>
                    </div>
                )
            },
            {
                id: 'target',
                accessorFn: (row) => row.target?.name ?? '',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Target" />,
                cell: ({ row }) => {
                    const target = row.original.target;
                    return target ? (
                        <div className="text-sm">
                            <p className="font-medium">{target.name}</p>
                            <p className="text-muted-foreground">{target.email}</p>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    );
                }
            }
        ],
        []
    );

    return (
        <div>
            <TopBar title="Audit Logs" />
            <div className="p-6">
                <DataTable columns={columns} data={logs} isLoading={isLoading} />
                {!isLoading && logs.length > 0 && (
                    <Pagination page={page} totalPages={totalPages} total={data?.total ?? 0} onPageChange={setPage} />
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
