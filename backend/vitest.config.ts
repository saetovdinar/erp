import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: [ 'tests/**/*.test.ts' ],

        // все файлы по очереди: у тестов общая БД erp_test
        fileParallelism: false,
        hookTimeout: 15000,
        testTimeout: 20000,
        env: {
            NODE_ENV: 'test',
            DATABASE_URL: 'postgres://mintcenter@localhost:5432/erp_test'
        }
    }
});
