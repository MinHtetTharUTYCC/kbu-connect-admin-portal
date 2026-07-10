import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableSkeletonProps {
    columnCount: number;
    rowCount?: number;
}

export function DataTableSkeleton({ columnCount, rowCount = 5 }: DataTableSkeletonProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: columnCount }).map((_, i) => (
                            <TableHead key={i}>
                                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <TableRow key={i}>
                            {Array.from({ length: columnCount }).map((_, j) => (
                                <TableCell key={j}>
                                    <div className="h-4 animate-pulse rounded bg-muted" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
