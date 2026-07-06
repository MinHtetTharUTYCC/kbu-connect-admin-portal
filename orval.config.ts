import { defineConfig } from 'orval';
import { publicApiUrl } from './src/lib/constants/app.config';

export default defineConfig({
    KBUConnectAdminApi: {
        input: {
            target: `${publicApiUrl}/api/json`
        },
        output: {
            mode: 'tags-split',
            target: 'services/generated',
            schemas: 'services/model',
            client: 'react-query',
            httpClient: 'axios',
            clean: true,
            override: {
                mutator: {
                    path: 'src/lib/axios/axios-instance.ts',
                    name: 'axiosInstanceFn'
                }
            }
        }
    }
});
