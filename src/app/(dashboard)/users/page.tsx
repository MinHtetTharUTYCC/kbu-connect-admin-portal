'use client';

import type { AdminUserItemDto } from '@services/model';
import type { AdminControllerGetUsersSortOrder } from '@services/model';
import type { AdminControllerGetUsersParams } from '@services/model/adminControllerGetUsersParams';
import type { ColumnDef } from '@tanstack/react-table';
import { Ban, CheckCircle, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import ActionConfirmDialog from '@/components/action-confirm-dialog';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { TopBar } from '@/components/layout/top-bar';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllUsers } from '@/hooks/admin/use-all-users';
import { useBanUser } from '@/hooks/ban/use-ban-user';
import { useUnbanUser } from '@/hooks/ban/use-unban-user';

function getParams(searchParams: URLSearchParams): AdminControllerGetUsersParams {
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const search = searchParams.get('search') ?? undefined;
    const sortOrder = (searchParams.get('sortOrder') ?? undefined) as AdminControllerGetUsersSortOrder | undefined;
    const isBannedParam = searchParams.get('isBanned');

    const bannedMapping: Record<string, boolean> = {
        banned: true,
        active: false
    };

    return {
        page,
        limit: 20,
        search,
        sortOrder,
        isBanned: isBannedParam ? bannedMapping[isBannedParam] : undefined
    };
}

function UsersContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentParams = getParams(searchParams);

    const [localSearch, setLocalSearch] = useState(currentParams.search);
    const [banTarget, setBanTarget] = useState<{ id: string; name: string } | null>(null);
    const [unbanTarget, setUnbanTarget] = useState<{ id: string; name: string } | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setLocalSearch(currentParams.search);
    }, [currentParams.search]);

    const updateSearchParams = useCallback(
        (key: string, value: string, resetPage = false) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === '' || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
            if (resetPage) params.delete('page');
            router.replace(`/users?${params.toString()}`);
        },
        [searchParams, router]
    );

    const handleSearchChange = useCallback(
        (value: string) => {
            setLocalSearch(value);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                updateSearchParams('search', value, true);
            }, 300);
        },
        [updateSearchParams]
    );

    const { data, users, isLoading } = useAllUsers(currentParams);
    const { mutateAsync: banUser, isPending: isBanning } = useBanUser();
    const { mutateAsync: unbanUser, isPending: isUnbanning } = useUnbanUser();

    const totalPages = data ? Math.ceil(data.total / (currentParams.limit || 20)) : 1;

    const setPage = useCallback(
        (p: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (p <= 1) {
                params.delete('page');
            } else {
                params.set('page', String(p));
            }
            router.replace(`/users?${params.toString()}`);
        },
        [searchParams, router]
    );

    const handleBan = async () => {
        if (banTarget) {
            await banUser(
                { data: { userId: banTarget.id, reason: 'Banned by admin' } },
                {
                    onSuccess: () => {
                        setBanTarget(null);
                        toast.success('User banned');
                    }
                }
            );
        }
    };

    const handleUnban = async () => {
        if (unbanTarget) {
            await unbanUser(
                { data: { userId: unbanTarget.id } },
                {
                    onSuccess: () => {
                        setUnbanTarget(null);
                        toast.success('User unbanned');
                    }
                }
            );
        }
    };

    const columns = useMemo<ColumnDef<AdminUserItemDto>[]>(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
                cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>
            },
            {
                accessorKey: 'email',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />
            },
            {
                accessorKey: 'faculty',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Faculty" />
            },
            {
                accessorKey: 'gender',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />
            },
            {
                id: 'status',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
                accessorFn: (row) => (row.isBanned ? 'Banned' : row.isAdmin ? 'Admin' : 'Active'),
                cell: ({ row }) => {
                    const user = row.original;
                    return user.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                    ) : user.isAdmin ? (
                        <Badge>Admin</Badge>
                    ) : (
                        <Badge variant="secondary">Active</Badge>
                    );
                }
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const user = row.original;
                    return user.isBanned ? (
                        <Button variant="ghost" size="sm" onClick={() => setUnbanTarget({ id: user.id, name: user.name })}>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Unban
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => setBanTarget({ id: user.id, name: user.name })}>
                            <Ban className="mr-1 h-4 w-4" />
                            Ban
                        </Button>
                    );
                }
            }
        ],
        []
    );

    const bannedSelectorValue = currentParams.isBanned === true ? 'banned' : currentParams.isBanned === false ? 'active' : undefined;

    const toolbar = (
        <div className="flex items-center gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by name or email..."
                    value={localSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>
            <Select value={bannedSelectorValue} onValueChange={(value) => updateSearchParams('isBanned', value, true)}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
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
    );

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <TopBar title="Users" />
            <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <DataTable columns={columns} data={users} isLoading={isLoading} toolbar={toolbar} />
                </div>

                {!isLoading && users.length > 0 && (
                    <Pagination page={currentParams.page || 1} totalPages={totalPages} total={data?.total ?? 0} onPageChange={setPage} />
                )}
            </div>

            {banTarget && (
                <ActionConfirmDialog
                    title={'Ban User'}
                    message={`Are you sure you want to ban ${banTarget?.name}? This will remove all their matches and prevent
                            them from using the platform.`}
                    onConfirm={handleBan}
                    onClose={() => setBanTarget(null)}
                    isPending={isBanning}
                    action={'Ban'}
                />
            )}

            {unbanTarget && (
                <ActionConfirmDialog
                    title={'Unban User'}
                    message={`Are you sure you want to unban ${unbanTarget?.name}? This will allow them to use the platform again.`}
                    onConfirm={handleUnban}
                    onClose={() => setUnbanTarget(null)}
                    isPending={isUnbanning}
                    action={'Unban'}
                />
            )}
        </div>
    );
}

export default function UsersPage() {
    return (
        <Suspense>
            <UsersContent />
        </Suspense>
    );
}
