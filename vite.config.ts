import { defineConfig } from 'vite';

export default defineConfig({
    base: '/2048race/',
    assetsInclude: ['**/*.svg'],
    build: {
        target: 'esnext',
    }
}); 