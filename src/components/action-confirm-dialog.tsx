import { Loader2 } from 'lucide-react';
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

export default function ActionConfirmDialog({
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    onConfirm,
    onClose,
    isPending,
    action
}: {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    isPending: boolean;
    action: string;
}) {
    return (
        <AlertDialog
            open
            onOpenChange={(open) => {
                if (!open && !isPending) onClose();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="grid grid-cols-2 gap-2">
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending}
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirm();
                            }}
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : action}
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
