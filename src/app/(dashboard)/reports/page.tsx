'use client';

import { format } from 'date-fns';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import { useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBatchDismissReports } from '@/hooks/reports/use-batch-dismiss-reports';
import { usePendingReports } from '@/hooks/reports/use-pending-reports';
import { useReportDetail } from '@/hooks/reports/use-report-detail';
import { useResolveReport } from '@/hooks/reports/use-resolve-report';

const reasonLabels: Record<string, string> = {
    INAPPROPRIATE_BEHAVIOR: 'Inappropriate Behavior',
    FAKE_PROFILE: 'Fake Profile',
    SCAM: 'Scam',
    HARASSMENT: 'Harassment',
    OTHER: 'Other'
};

export default function ReportsPage() {
    const { data: reports, isLoading } = usePendingReports();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [detailId, setDetailId] = useState<string | null>(null);
    const { data: detail } = useReportDetail(detailId ?? '');
    const resolveReport = useResolveReport();
    const batchDismiss = useBatchDismissReports();

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

    return (
        <div>
            <TopBar
                title="Reports"
                actions={
                    selectedIds.size > 0 ? (
                        <Button variant="destructive" onClick={() => batchDismiss.mutate({ data: { reportIds: Array.from(selectedIds) } })}>
                            <XCircle className="mr-1 h-4 w-4" />
                            Dismiss ({selectedIds.size})
                        </Button>
                    ) : undefined
                }
            />
            <div className="p-6">
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 animate-pulse rounded bg-muted" />
                        ))}
                    </div>
                ) : !reports || reports.length === 0 ? (
                    <p className="text-center text-muted-foreground">No pending reports.</p>
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
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <Checkbox checked={selectedIds.has(report.id)} onCheckedChange={() => toggleSelect(report.id)} />
                                    </TableCell>
                                    <TableCell>{report.reporter.name}</TableCell>
                                    <TableCell>{report.reported.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{reasonLabels[report.reason] ?? report.reason}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(report.createdAt), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => setDetailId(report.id)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => resolveReport.mutate({ id: report.id, data: { action: 'RESOLVE' } })}
                                            >
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => resolveReport.mutate({ id: report.id, data: { action: 'DISMISS' } })}
                                            >
                                                <XCircle className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                    </DialogHeader>
                    {detail && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
