// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // <- enables `vi` globally
    setupFiles: ['./src/vitest.setup.ts']
  }
});
