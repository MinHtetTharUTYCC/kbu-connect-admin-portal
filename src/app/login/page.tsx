'use client';

import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/auth/use-login';
import { useVerify } from '@/hooks/auth/use-verify';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');

    const { mutateAsync: loginAsAdmin, isPending: isLoginPending } = useLogin();
    const { mutateAsync: verify, isPending: isVerifyPending } = useVerify();

    const handleEmailSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;

        await loginAsAdmin(
            { data: { email } },
            {
                onSuccess: () => {
                    setStep('otp');
                }
            }
        );
    };

    const handleOtpSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!code) return;

        await verify(
            { data: { email, code } },
            {
                onSuccess: () => {
                    setEmail('');
                    setCode('');
                    router.replace('/');
                }
            }
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Admin Portal</CardTitle>
                    <CardDescription>KBU Connect Administration</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'email' ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoginPending}>
                                {isLoginPending ? 'Sending...' : 'Continue'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Verification Code</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isVerifyPending}>
                                {isVerifyPending ? 'Verifying...' : 'Sign In'}
                            </Button>
                            <Button type="button" variant="ghost" className="w-full" onClick={() => setStep('email')}>
                                Back
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
