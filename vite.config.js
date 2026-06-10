import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],

    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:7267',
                changeOrigin: true,
                secure: false
            }
        }
    }
})