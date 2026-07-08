'use client';

import type { AdminControllerGetAnnouncementsParams } from '@services/model/adminControllerGetAnnouncementsParams';
import { format } from 'date-fns';
import { Plus, Trash2, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import { toast } from 'sonner';
import ActionConfirmDialog from '@/components/action-confirm-dialog';
import { TopBar } from '@/components/layout/top-bar';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAnnouncementsList } from '@/hooks/announcements/use-announcements-list';
import { useCreateAnnouncement } from '@/hooks/announcements/use-create-announcement';
import { useDeleteAnnouncement } from '@/hooks/announcements/use-delete-announcement';

function getParams(params: URLSearchParams): AdminControllerGetAnnouncementsParams {
    const page = Math.max(1, Number(params.get('page')) || 1);
    return { page, limit: 5 };
}

function AnnouncementsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { page, limit } = getParams(searchParams);

    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

    const { data, isLoading } = useAnnouncementsList({ page, limit });
    const { mutateAsync: createAnnouncement, isPending: isCreatingAnnouncement } = useCreateAnnouncement();
    const { mutateAsync: deleteAnnouncement, isPending: isDeletingAnnouncement } = useDeleteAnnouncement();

    const announcements = data?.data ?? [];
    const totalPages = data ? Math.ceil(data.total / limit) : 1;

    const setPage = useCallback(
        (p: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (p <= 1) {
                params.delete('page');
            } else {
                params.set('page', String(p));
            }
            router.replace(`/announcements?${params.toString()}`);
        },
        [searchParams, router]
    );

    const handleCreate = async () => {
        if (!title.trim() || !body.trim()) return;
        await createAnnouncement(
            { data: { title, body } },
            {
                onSuccess: () => {
                    setShowCreate(false);
                    setTitle('');
                    setBody('');
                    toast.success('Announcement created and broadcasted');
                }
            }
        );
    };

    const handleDelete = async () => {
        if (deleteTarget) {
            await deleteAnnouncement(
                { id: deleteTarget.id },
                {
                    onSuccess: () => {
                        setDeleteTarget(null);
                        toast.success('Announcement deleted');
                    }
                }
            );
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <TopBar
                title="Announcements"
                actions={
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Announcement
                    </Button>
                }
            />

            <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 animate-pulse rounded bg-muted" />
                            ))}
                        </div>
                    ) : announcements.length === 0 ? (
                        <p className="text-center text-muted-foreground">No announcements yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((a) => (
                                <Card key={a.id}>
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div>
                                            <CardTitle>{a.title}</CardTitle>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {format(new Date(a.createdAt), 'MMM d, yyyy HH:mm')}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget({ id: a.id, title: a.title })}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{a.body}</p>
                                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Users className="h-3 w-3" />
                                            {a.recipientCount} recipients
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                {!isLoading && announcements.length > 0 && (
                    <Pagination page={page} totalPages={totalPages} total={data?.total ?? 0} onPageChange={setPage} />
                )}
            </div>

            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Announcement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="body">Body</Label>
                            <Textarea
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Announcement description"
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreate(false)} disabled={isCreatingAnnouncement}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={!title.trim() || !body.trim() || isCreatingAnnouncement}>
                            {isCreatingAnnouncement ? 'Creating...' : 'Create & Broadcast'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {deleteTarget && (
                <ActionConfirmDialog
                    title="Delete Announcement"
                    message={`Are you sure you want to delete "${deleteTarget.title}"? This will remove all notification rows for this announcement.`}
                    onConfirm={async () => {
                        if (deleteTarget) {
                            await deleteAnnouncement(
                                { id: deleteTarget.id },
                                {
                                    onSuccess: () => {
                                        setDeleteTarget(null);
                                        toast.success('Announcement deleted');
                                    }
                                }
                            );
                        }
                    }}
                    onClose={() => setDeleteTarget(null)}
                    isPending={isDeletingAnnouncement}
                    action="Delete"
                />
            )}

            {deleteTarget && (
                <ActionConfirmDialog
                    title={'Delete Announcement'}
                    message={`Are you sure you want to delete "${deleteTarget.title}"? This will remove all notification rows for this announcement.`}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                    isPending={isDeletingAnnouncement}
                    action={'Delete'}
                />
            )}
        </div>
    );
}

export default function AnnouncementsPage() {
    return (
        <Suspense>
            <AnnouncementsContent />
        </Suspense>
    );
}
