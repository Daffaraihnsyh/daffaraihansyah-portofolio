import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    base: './',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                skills: resolve(__dirname, 'skills.html'),
                projects: resolve(__dirname, 'projects.html'),
                contact: resolve(__dirname, 'contact.html'),
                portfolio: resolve(__dirname, 'portfolio.html'),
            }
        }
    }
})