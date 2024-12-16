import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/index.jsx', // Entry for your React app
                'resources/css/app.css', // CSS entry point
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'), // Alias for cleaner imports
        },
    },
    build: {
        outDir: 'public/build', // Output directory
        manifest: true,         // Generate manifest.json
        rollupOptions: {
            input: {
                main: 'resources/js/index.jsx',
                styles: 'resources/css/app.css', // Explicitly define the CSS input
            },
        },
    },
});
