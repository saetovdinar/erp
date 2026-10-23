import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: [ 'tests/**/*.test.ts' ],

        // все файлы по очереди: у тестов общая БД erp_test (docker, порт 5434);
        // перед первым прогоном — npm run db:test-prepare
        fileParallelism: false,
        hookTimeout: 15000,
        testTimeout: 20000,
        env: {
            NODE_ENV: 'test',
            DATABASE_URL: 'postgres://erp:erp@localhost:5434/erp_test',
            JWT_SECRET: 'test-secret-erp'
        }
    }
});
