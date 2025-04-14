import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update the service worker
      manifest: {
        name: "OrgPro CRM",
        short_name: "OrgPro",
        description: "Turn Leads to Gold.",
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/signin',
        icons: [
          {
            src: '/assets/icons/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/icons/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
  },
});
