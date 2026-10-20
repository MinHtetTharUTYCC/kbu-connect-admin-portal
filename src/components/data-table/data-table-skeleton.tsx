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
                        {Array.from({ length: columnCount }, (_, index) => ({ id: `item-${index}` })).map((item) => (
                            <TableHead key={item.id}>
                                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rowCount }, (_, index) => ({ id: `row-${index}` })).map((row) => (
                        <TableRow key={row.id}>
                            {Array.from({ length: columnCount }, (_, index) => ({ id: `cell-${index}` })).map((cell) => (
                                <TableCell key={cell.id}>
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
