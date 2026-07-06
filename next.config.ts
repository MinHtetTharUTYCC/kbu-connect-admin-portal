import type { NextConfig } from 'next';
import { publicApiUrl } from '@/lib/constants/app.config';

const nextConfig: NextConfig = {
    reactCompiler: true,

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${publicApiUrl}/:path*`
            }
        ];
    }
};

export default nextConfig;
