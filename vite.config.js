// vite.config.js (في مشروع مكتبتك domahawindows)
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/domahawindows.js'), // نقطة الدخول الرئيسية لـ JS
      name: 'DomahaWindow', // الاسم العام للمكتبة
      fileName: (format) => {
        if (format === 'es') return 'domahawindows.js';       // اسم ملف ES Module
        if (format === 'umd') return 'domahawindows.umd.cjs'; // اسم ملف UMD CommonJS
        return `domahawindows.${format}.js`; // لأي تنسيقات أخرى
      },
    },
    
    // هذا السطر يضمن استخراج CSS كملف منفصل
    cssCodeSplit: true, 

    rollupOptions: {
      output: {
        exports: 'named', // يضمن التعامل الصحيح مع التصديات الافتراضية

        // هذا الجزء هو الأكثر أهمية لضمان تسمية ملف الـ CSS وإخراجه
        assetFileNames: (assetInfo) => {
          // إذا كان الملف هو CSS (ويحتوي على .css في اسمه)
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css'; // أو 'domahawindows.css' إذا كنت تفضل هذا الاسم
          }
          return assetInfo.name; // للتعامل مع الأصول الأخرى (مثل الصور إذا وجدت)
        },
      }
    }
  }
});