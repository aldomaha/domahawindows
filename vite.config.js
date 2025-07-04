// vite.config.js (في مشروع مكتبتك domahawindows)
import { defineConfig } from 'vite';
import { resolve } from 'path';


export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/domahawindows.js'), // نقطة الدخول الرئيسية لـ JS
      name: 'DomahaWindow', // الاسم العام للمكتبة (لإصدار UMD)
      fileName: (format) => {
        if (format === 'es') return 'domahawindows.js';       // اسم ملف ES Module
        if (format === 'umd') return 'domahawindows.umd.cjs'; // اسم ملف UMD CommonJS
        return `domahawindows.${format}.js`; // لأي تنسيقات أخرى
      },
    },

    // هذا السطر يضمن استخراج CSS كملف منفصل
    cssCodeSplit: true, 

    rollupOptions: {
      // أضف الـ plugin هنا
    
      output: {
        exports: 'named', // يضمن التعامل الصحيح مع التصديات الافتراضية

        // هذا الجزء مهم لضمان أن ملف الـ CSS الذي تم استخراجه
        // سيتم وضعه في مجلد الأصول الصحيح (عادةً جذر مجلد dist)
        // ويُعطى الاسم الصحيح.
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css'; // تأكد من اسم الملف هنا
          }
          return assetInfo.name; 
        },
      }
    }
  }
});