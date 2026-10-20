'use client';

import { usePublicControllerGetUserShareMetadata } from '@services/generated/public/public';
import { Image } from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { TopBar } from '@/components/layout/top-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function PublicSharingPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId') || '';
    const router = useRouter();

    const { data: metadata, isLoading } = usePublicControllerGetUserShareMetadata(userId);

    const handleCopy = () => {
        if (metadata?.shareLink) {
            navigator.clipboard.writeText(metadata.shareLink);
            toast({
                title: 'Copied',
                description: 'Share link copied to clipboard',
                variant: 'default'
            });
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <TopBar title="Public Sharing" />

            <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 animate-pulse rounded bg-muted" />
                            ))}
                        </div>
                    ) : !userId ? (
                        <div>
                            <p className="text-muted-foreground">Enter a user ID to view their public sharing metadata</p>
                            <Input
                                placeholder="User ID"
                                onChange={(e) => {
                                    router.replace(`/public-sharing?userId=${e.target.value}`);
                                }}
                                value={userId}
                            />
                            <Button onClick={() => window.location.reload()}>Clear</Button>
                        </div>
                    ) : !metadata ? (
                        <p className="text-muted-foreground">User not found</p>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>{metadata.user?.name ?? 'User'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Share Link</p>
                                        <Input
                                            readOnly
                                            value={metadata.shareLink ?? ''}
                                            placeholder="Copy link to share"
                                            className="flex-1"
                                        />
                                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!metadata.shareLink}>
                                            Copy
                                        </Button>
                                    </div>

                                    {metadata.user?.avatarUrl && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Avatar</p>
                                            <Image
                                                src={metadata.user.avatarUrl}
                                                alt={metadata.user.name ?? 'Avatar'}
                                                width={200}
                                                height={200}
                                                className="rounded-full object-cover"
                                            />
                                            <Button variant="outline" size="sm">
                                                Download
                                            </Button>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <span>{metadata.user?.isPremium ? 'Premium' : 'Free'}</span>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Member Since</p>
                                        <span>{new Date(metadata.user?.createdAt ?? Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
