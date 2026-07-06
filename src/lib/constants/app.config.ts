import 'dotenv/config';

export const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!publicApiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in the environment variables.');
}

export const baseUrl = process.env.NODE_ENV === 'development' ? '/api' : publicApiUrl;
