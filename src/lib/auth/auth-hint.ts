export const AUTH_HINT_COOKIE = 'kbu_auth_hint';
export const AUTH_HINT_MAX_AGE = 30 * 24 * 60 * 60;

type AuthHint = 'authenticated' | 'unauthenticated';

export function setAuthHint(value: AuthHint): void {
    if (typeof document === 'undefined') return;

    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    // biome-ignore lint/suspicious/noDocumentCookie: The hint must be writable by browser code and readable by the Next proxy.
    document.cookie = `${AUTH_HINT_COOKIE}=${value}; Max-Age=${AUTH_HINT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}
