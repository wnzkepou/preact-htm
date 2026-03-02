import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

import path from 'path'
import fs from 'fs'
import { env } from 'process'
import child_process from 'child_process'


const baseFolder =
  env.APPDATA !== undefined && env.APPDATA !== ''
    ? `${env.APPDATA}/ASP.NET/https`
    : `${env.HOME}/.aspnet/https`;

const certificateName = "vite";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
  fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  if (0 !== child_process.spawnSync('dotnet', [
    'dev-certs',
    'https',
    '--export-path',
    certFilePath,
    '--format',
    'Pem',
    '--no-password',
  ], { stdio: 'inherit', }).status) {
    throw new Error("Could not create certificate.");
  }
}

// https://vite.dev/config/
export default defineConfig({
  	plugins: [preact()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    minify: false,
    rollupOptions: {
      //external: ['htm', 'react', 'react-dom'],
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url))
      },
      output: {
        entryFileNames: '/assets/[name].js',
        // chunkFileNames: '/assets/components/[name].js',
        assetFileNames: '/assets/[name].[ext]',
        // manualChunks: {
        //     Carousel: ['./src/components/Carousel.jsx'],
        // }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: 'dnndev.me',
    port: parseInt(env.DEV_SERVER_PORT || '443'),
    allowedHosts: ['dnndev.me'],
    //proxy: {
    //  '^/poi': {
    //    target,
    //    secure: false
    //  }
    //},
    https: {
      key: fs.readFileSync(keyFilePath),
      cert: fs.readFileSync(certFilePath),
    }
  }
})
