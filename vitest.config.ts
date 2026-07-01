import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': '/Users/motta/Documents/GitHub/immigrationpoints.com/src',
    },
  },
});
