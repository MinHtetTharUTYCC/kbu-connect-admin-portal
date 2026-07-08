import { type ClassValue, clsx } from 'clsx';
import { format, isThisMonth, isThisWeek, isThisYear, isToday, isYesterday } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFormattedDate(dateStr: string): string {
    const date = new Date(dateStr);

    if (isToday(date)) {
        return `Today ${format(date, 'hh:mm a')}`;
    } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'hh:mm a')}`;
    } else if (isThisWeek(date)) {
        return format(date, `EEE 'at' hh:mm a`);
    } else if (isThisMonth(date)) {
        return format(date, `MMM d`);
    } else if (isThisYear(date)) {
        return format(date, `MMM d 'at' hh:mm a`);
    } else {
        //other years
        return format(date, 'MMM d, yyyy');
    }
}
