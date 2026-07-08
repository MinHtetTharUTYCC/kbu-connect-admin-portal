'use client';

import type {
    ReportItemDtoReason,
    ReportsControllerGetReportsParams,
    ReportsControllerGetReportsSortOrder,
    ReportsControllerGetReportsStatus
} from '@services/model';
import { CheckCircle, Eye, Loader2, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import { toast } from 'sonner';

import { TopBar } from '@/components/layout/top-bar';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBatchDismissReports } from '@/hooks/reports/use-batch-dismiss-reports';
import { useReportDetail } from '@/hooks/reports/use-report-detail';
import { useReports } from '@/hooks/reports/use-reports';
import { useResolveReport } from '@/hooks/reports/use-resolve-report';
import { getFormattedDate } from '@/lib/utils';

const reasonLabels: Record<keyof typeof ReportItemDtoReason, string> = {
    INAPPROPRIATE_BEHAVIOR: 'Inappropriate Behavior',
    FAKE_PROFILE: 'Fake Profile',
    SCAM: 'Scam',
    HARASSMENT: 'Harassment',
    OTHER: 'Other'
};

function getParams(params: URLSearchParams): ReportsControllerGetReportsParams {
    const page = Math.max(1, Number(params.get('page')) || 1);
    const status = (params.get('status') ?? 'all') as ReportsControllerGetReportsStatus | 'all';
    const sortOrder = (params.get('sortOrder') ?? undefined) as ReportsControllerGetReportsSortOrder | undefined;

    return {
        page,
        limit: 20,
        status: status === 'all' ? undefined : status,
        sortOrder
    };
}

function ReportsContent() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const currentParams = getParams(searchParams);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [detailId, setDetailId] = useState<string | null>(null);

    const { data: reportsData, isLoading } = useReports(currentParams);
    const { data: detail, isLoading: isDetailLoading } = useReportDetail(detailId ?? '');
    const { mutate: resolveReport, isPending: isResolvingReport } = useResolveReport();
    const { mutate: batchDismiss, isPending: isBatchDismissing } = useBatchDismissReports();

    const reports = reportsData?.reports ?? [];
    const totalPages = reportsData?.totalPages ?? 0;

    const updateSearchParams = useCallback(
        (key: string, value: string, resetPage = false) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === '' || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
            if (resetPage) params.delete('page');
            router.replace(`/reports?${params.toString()}`);
        },
        [searchParams, router]
    );

    const setPage = useCallback(
        (p: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (p <= 1) {
                params.delete('page');
            } else {
                params.set('page', String(p));
            }
            router.replace(`/reports?${params.toString()}`);
        },
        [searchParams, router]
    );

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (!reports) return;
        if (selectedIds.size === reports.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(reports.map((r) => r.id)));
        }
    };

    const handleResolveReport = (id: string, action: 'RESOLVE' | 'DISMISS') => {
        resolveReport(
            { id, data: { action } },
            {
                onSuccess: () => {
                    toast.success(`Report ${action === 'RESOLVE' ? 'resolved' : 'dismissed'}`);
                }
            }
        );
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <TopBar
                title="Reports"
                actions={
                    selectedIds.size > 0 ? (
                        <Button
                            variant="destructive"
                            onClick={() => batchDismiss({ data: { reportIds: Array.from(selectedIds) } })}
                            disabled={isBatchDismissing}
                        >
                            <XCircle className="mr-1 h-4 w-4" />
                            Dismiss ({selectedIds.size})
                        </Button>
                    ) : undefined
                }
            />
            <div className="flex-1 p-4 flex flex-col overflow-hidden">
                <div className="flex-1 space-y-4">
                    <div className="mt-4 flex items-center gap-2">
                        <Select value={currentParams.status} onValueChange={(value) => updateSearchParams('status', value, true)}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="DISMISSED">Dismissed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={currentParams.sortOrder} onValueChange={(value) => updateSearchParams('sortOrder', value, true)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest</SelectItem>
                                <SelectItem value="asc">Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
                            ))}
                        </div>
                    ) : reports.length === 0 ? (
                        <p className="text-center text-muted-foreground">No reports found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox checked={selectedIds.size === reports.length} onCheckedChange={toggleAll} />
                                    </TableHead>
                                    <TableHead>Reporter</TableHead>
                                    <TableHead>Reported</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.has(report.id)}
                                                onCheckedChange={() => toggleSelect(report.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{report.reporter.name}</TableCell>
                                        <TableCell>{report.reported.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{reasonLabels[report.reason] ?? report.reason}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    report.status === 'PENDING'
                                                        ? 'default'
                                                        : report.status === 'RESOLVED'
                                                          ? 'secondary'
                                                          : 'destructive'
                                                }
                                            >
                                                {report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{getFormattedDate(report.createdAt)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => setDetailId(report.id)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {report.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={isResolvingReport}
                                                            onClick={() => handleResolveReport(report.id, 'RESOLVE')}
                                                        >
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={isResolvingReport}
                                                            onClick={() => handleResolveReport(report.id, 'DISMISS')}
                                                        >
                                                            <XCircle className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
                {!isLoading && reports.length > 0 && (
                    <Pagination page={currentParams.page || 1} totalPages={totalPages} total={totalPages} onPageChange={setPage} />
                )}
            </div>

            <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                    </DialogHeader>
                    {isDetailLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        detail && (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reporter</p>
                                    <p>
                                        {detail.reporter.name} ({detail.reporter.email})
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reported</p>
                                    <p>
                                        {detail.reported.name} ({detail.reported.email})
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reason</p>
                                    <Badge variant="outline">{reasonLabels[detail.reason] ?? detail.reason}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                                    <p className="text-sm">{detail.description || 'No description provided.'}</p>
                                </div>
                                {detail.chatContext && detail.chatContext.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-sm font-medium text-muted-foreground">Chat Context</p>
                                        <div className="max-h-60 space-y-2 overflow-auto rounded-md border p-3">
                                            {detail.chatContext.map((msg) => (
                                                <div key={msg.id} className="text-sm">
                                                    <span className="font-medium">
                                                        {msg.senderId === detail.reporterId ? detail.reporter.name : detail.reported.name}:
                                                    </span>{' '}
                                                    {msg.content}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function ReportsPage() {
    return (
        <Suspense>
            <ReportsContent />
        </Suspense>
    );
}
