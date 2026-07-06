'use client';

import { Ban, CheckCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllUsers } from '@/hooks/admin/use-all-users';
import { useBanUser } from '@/hooks/ban/use-ban-user';
import { useUnbanUser } from '@/hooks/ban/use-unban-user';

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const [isBanned, setIsBanned] = useState<string>('all');
    const [banTarget, setBanTarget] = useState<{ id: string; name: string } | null>(null);
    const [unbanTarget, setUnbanTarget] = useState<{ id: string; name: string } | null>(null);

    const { data, isLoading } = useAllUsers({
        search: search || undefined,
        isBanned: isBanned === 'banned' ? true : isBanned === 'active' ? false : undefined
    });
    const { mutateAsync: banUser, isPending: isBanning } = useBanUser(() => setBanTarget(null));
    const { mutateAsync: unbanUser, isPending: isUnbanning } = useUnbanUser(() => setUnbanTarget(null));

    const users = data?.data ?? [];

    return (
        <div>
            <TopBar title="Users" />
            <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={isBanned} onValueChange={setIsBanned}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 animate-pulse rounded bg-muted" />
                        ))}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Faculty</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.faculty}</TableCell>
                                    <TableCell>{user.gender}</TableCell>
                                    <TableCell>
                                        {user.isBanned ? (
                                            <Badge variant="destructive">Banned</Badge>
                                        ) : user.isAdmin ? (
                                            <Badge>Admin</Badge>
                                        ) : (
                                            <Badge variant="secondary">Active</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.isBanned ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setUnbanTarget({ id: user.id, name: user.name })}
                                            >
                                                <CheckCircle className="mr-1 h-4 w-4" />
                                                Unban
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setBanTarget({ id: user.id, name: user.name })}
                                            >
                                                <Ban className="mr-1 h-4 w-4" />
                                                Ban
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <AlertDialog open={!!banTarget} onOpenChange={() => setBanTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ban User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to ban <strong>{banTarget?.name}</strong>? This will remove all their matches and prevent
                            them from using the platform.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isBanning}
                            onClick={async () => {
                                if (banTarget) {
                                    await banUser({ data: { userId: banTarget.id, reason: 'Banned by admin' } });
                                }
                            }}
                        >
                            Ban User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!unbanTarget} onOpenChange={() => setUnbanTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unban User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to unban <strong>{unbanTarget?.name}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isUnbanning}
                            onClick={async () => {
                                if (unbanTarget) {
                                    await unbanUser({ data: { userId: unbanTarget.id } });
                                }
                            }}
                        >
                            Unban User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
