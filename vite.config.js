import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'import.meta.env.POSTHOG_API_KEY': JSON.stringify(env.POSTHOG_API_KEY),
      'import.meta.env.POSTHOG_HOST': JSON.stringify(env.POSTHOG_HOST),
    },
  };
});
