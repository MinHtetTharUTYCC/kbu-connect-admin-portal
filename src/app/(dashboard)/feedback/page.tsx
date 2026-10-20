'use client';

import type { FeedbackControllerListParams, FeedbackItemDto, FeedbackItemDtoStatus } from '@services/model';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { TopBar } from '@/components/layout/top-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminDeleteFeedback } from '@/hooks/admin/use-admin-delete-feedback';
import { useAdminFeedback } from '@/hooks/admin/use-admin-feedback';
import { useAdminUpdateFeedbackStatus } from '@/hooks/admin/use-admin-update-feedback-status';
import { getFormattedDate } from '@/lib/utils';

const statuses: FeedbackItemDtoStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function FeedbackPage() {
    const searchParams = useSearchParams();
    const [detail, setDetail] = useState<FeedbackItemDto | null>(null);
    const type = searchParams.get('type') as FeedbackControllerListParams['type'] | null;
    const status = searchParams.get('status') as FeedbackControllerListParams['status'] | null;
    const params: FeedbackControllerListParams = { limit: 50, type: type ?? undefined, status: status ?? undefined };
    const { data, isLoading, refetch } = useAdminFeedback(params);
    const { mutateAsync: updateStatus, isPending: isUpdating } = useAdminUpdateFeedbackStatus();
    const { mutateAsync: removeFeedback, isPending: isDeleting } = useAdminDeleteFeedback();
    const feedback = data?.feedback ?? [];

    const setFilter = (key: 'type' | 'status', value: string) => {
        const next = new URLSearchParams(searchParams.toString());
        if (value === 'all') next.delete(key);
        else next.set(key, value);
        window.history.replaceState(null, '', `/feedback?${next.toString()}`);
        void refetch();
    };
    const deleteItem = async (item: FeedbackItemDto) => {
        if (!window.confirm(`Delete “${item.title}”?`)) return;
        await removeFeedback(item.id);
        setDetail(null);
        toast.success('Feedback deleted');
        await refetch();
    };
    const columns: ColumnDef<FeedbackItemDto>[] = [
        {
            accessorKey: 'type',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
            cell: ({ row }) => <Badge variant="outline">{row.original.type === 'BUG' ? 'Bug' : 'Feature Request'}</Badge>
        },
        { accessorKey: 'title', header: ({ column }) => <DataTableColumnHeader column={column} title="Title" /> },
        {
            accessorFn: (row) => row.creator?.name ?? 'Unknown',
            id: 'creator',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted by" />
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => (
                <Select
                    value={row.original.status}
                    disabled={isUpdating}
                    onValueChange={async (value) => {
                        await updateStatus({ id: row.original.id, data: { status: value as FeedbackItemDtoStatus } });
                        toast.success('Feedback status updated');
                        await refetch();
                    }}
                >
                    <SelectTrigger className="w-[145px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map((item) => (
                            <SelectItem key={item} value={item}>
                                {item.replace('_', ' ')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
            cell: ({ row }) => getFormattedDate(row.original.createdAt)
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setDetail(row.original)}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" disabled={isDeleting} onClick={() => void deleteItem(row.original)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            )
        }
    ];
    const toolbar = (
        <div className="flex gap-2">
            <Select value={type ?? 'all'} onValueChange={(value) => setFilter('type', value)}>
                <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="BUG">Bug Reports</SelectItem>
                    <SelectItem value="FEATURE_REQUEST">Feature Requests</SelectItem>
                </SelectContent>
            </Select>
            <Select value={status ?? 'all'} onValueChange={(value) => setFilter('status', value)}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((item) => (
                        <SelectItem key={item} value={item}>
                            {item.replace('_', ' ')}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <TopBar title="Feedback" />
            <div className="flex-1 overflow-y-auto p-4">
                <DataTable columns={columns} data={feedback} isLoading={isLoading} toolbar={toolbar} />
            </div>
            <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{detail?.title}</DialogTitle>
                    </DialogHeader>
                    {detail && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Badge>{detail.type === 'BUG' ? 'Bug' : 'Feature Request'}</Badge>
                                <Badge variant="outline">{detail.status}</Badge>
                            </div>
                            <p className="whitespace-pre-wrap text-sm">{detail.description}</p>
                            <p className="text-sm text-muted-foreground">
                                Submitted by {detail.creator?.name ?? 'Unknown'} on {getFormattedDate(detail.createdAt)}
                            </p>
                            <Button variant="destructive" disabled={isDeleting} onClick={() => void deleteItem(detail)}>
                                Delete
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
