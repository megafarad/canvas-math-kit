import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: '/canvas-math-kit/',
    plugins: [react(), tailwindcss()],
    root: '.',
});
