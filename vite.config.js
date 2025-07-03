// vite.config.js (في مشروع مكتبتك domahawindows)
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/domahawindows.js'),
      name: 'DomahaWindow',
      fileName: (format) => {
        if (format === 'es') return 'domahawindows.js';       // لملف ES Module
        if (format === 'umd') return 'domahawindows.umd.cjs'; // لملف UMD CommonJS
        return `domahawindows.${format}.js`; // لأي تنسيقات أخرى
      },
    },
    rollupOptions: {
      // تأكد من أن هذا القسم موجود
      output: {
        // هذا هو السطر الحاسم!
        // يخبر Rollup أن التصديرات يجب أن تكون حتمًا كـ "named exports"
        // وفي حالة وجود 'export default'، سيتم التعامل معه كـ "default" مسمى.
        exports: 'named', 
      }
    }
  }
});