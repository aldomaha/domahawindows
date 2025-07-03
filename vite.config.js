// vite.config.js (في مشروع مكتبتك domahawindows)
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/domahawindows.js'),
      name: 'DomahaWindow',
      fileName: (format) => {
        if (format === 'es') return 'domahawindows.js';
        if (format === 'umd') return 'domahawindows.umd.cjs';
        return `domahawindows.${format}.js`;
      },
    },
    // هذا السطر يضمن استخراج CSS كملف منفصل
    cssCodeSplit: true, 

    rollupOptions: {
      output: {
        exports: 'named', // هذا مهم للتصدير الافتراضي

        // هذا الخيار قد يكون مفيدًا لضمان تسمية ملف الـ CSS بشكل صحيح
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'; // تأكد من اسم الملف هنا
          if (assetInfo.name === 'domahawindows.css') return 'style.css'; // إذا كان اسمه الأصلي domahawindows.css
          return assetInfo.name;
        },
      }
    }
  }
});