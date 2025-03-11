import { defineConfig } from 'vite';

export default defineConfig({
    assetsInclude: ['**/*.svg'],
    build: {
        target: 'esnext',
    }
}); 