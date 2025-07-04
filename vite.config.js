 // vite.config.js (في مشروع مكتبتك domahawindows)
import { defineConfig } from 'vite';
import { resolve } from 'path';
import postcss from 'rollup-plugin-postcss'; // استيراد الـ plugin

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

    // أزل cssCodeSplit: true من هنا

    rollupOptions: {
      // أضف الـ plugin هنا
      plugins: [
        postcss({
          extract: true, // هذا هو الخيار الحاسم: يجبر Rollup على استخراج CSS إلى ملف منفصل
          minimize: true, // تصغير الـ CSS
          // إذا كنت تستخدم PostCSS plugins أخرى (مثل TailwindCSS)، يمكنك إعدادها هنا
          // plugins: [require('tailwindcss'), require('autoprefixer')],
        }),
      ],
      output: {
        exports: 'named', // هذا مهم للتصدير الافتراضي

        // أزل assetFileNames من هنا إذا كنت تستخدم plugin
        // assetFileNames: (assetInfo) => {
        //   if (assetInfo.name && assetInfo.name.endsWith('.css')) {
        //     return 'style.css';
        //   }
        //   return assetInfo.name;
        // },
      }
    }
  }
});