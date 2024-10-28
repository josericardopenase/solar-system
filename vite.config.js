import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'public/*',   // Source folder
                    dest: 'public'     // Destination folder inside dist
                }
            ]
        })
    ]
});
