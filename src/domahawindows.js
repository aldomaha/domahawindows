// src/domahawindows.js (في مشروع مكتبتك domahawindows)
export default class DomahaWindow {
    /**
     * الدالة الإنشائية: يتم استدعاؤها عند إنشاء نافذة جديدة.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(config = {}) {
        // إذا كان المحتوى HTML، فسنستخدمه مباشرة.
        // وإلا، سنعود إلى النص العادي.
        this.steps = config.steps || [{ title: 'رسالة', content: 'لا يوجد محتوى.' }];
        this.currentStepIndex = 0;
        this.windowElement = null;
        this._createWindowElement();
    }

    /**
     * دالة داخلية لبناء هيكل النافذة (HTML).
     * يتم استدعاؤها مرة واحدة فقط في الـ constructor.
     */
    _createWindowElement() {
        const windowDiv = document.createElement('div');
        const footerButtons = `
            <button class="domaha-window-prev domaha-window-confirm">السابق</button>
            <button class="domaha-window-next domaha-window-confirm">التالي</button>
        `;
        
        windowDiv.innerHTML = `
            <div class="domaha-window-overlay">
                <div class="domaha-window-content">
                    <div class="domaha-window-header">
                        <h2 class="domaha-window-title"></h2>
                        <button class="domaha-window-close">&times;</button>
                    </div>
                    <div class="domaha-window-body">
                        <div class="domaha-window-inner-content"></div> 
                    </div>
                    <div class="domaha-window-footer">
                        ${footerButtons}
                    </div>
                </div>
            </div>
        `;
        this.windowElement = windowDiv.firstElementChild;

        // ربط الأزرار بالدوال الخاصة بها.
        this.windowElement.querySelector('.domaha-window-close').addEventListener('click', () => this.close());
        this.windowElement.querySelector('.domaha-window-next').addEventListener('click', () => this.next());
        this.windowElement.querySelector('.domaha-window-prev').addEventListener('click', () => this.prev());
    }
    
    /**
     * دالة داخلية لتحديث محتوى النافذة (العنوان، النص، حالة الأزرار).
     */
    _updateContent() {
        const titleElement = this.windowElement.querySelector('.domaha-window-title');
        const innerContentElement = this.windowElement.querySelector('.domaha-window-inner-content'); // استهداف العنصر الجديد
        const nextButton = this.windowElement.querySelector('.domaha-window-next');
        const prevButton = this.windowElement.querySelector('.domaha-window-prev');

        const currentStep = this.steps[this.currentStepIndex];

        // تحديث العنوان
        titleElement.textContent = currentStep.title;

        // تحديث المحتوى: إذا كان HTML، استخدم innerHTML، وإلا استخدم textContent
        if (currentStep.htmlContent) { // سنستخدم خاصية جديدة لـ HTML
            innerContentElement.innerHTML = currentStep.htmlContent;
        } else {
            innerContentElement.textContent = currentStep.content;
        }

        // إخفاء زر "السابق" في الخطوة الأولى.
        prevButton.style.display = this.currentStepIndex === 0 ? 'none' : 'inline-block';
        
        // تغيير نص زر "التالي" إلى "إنهاء" في الخطوة الأخيرة.
        nextButton.textContent = (this.currentStepIndex === this.steps.length - 1) ? 'إنهاء' : 'التالي';
    }

    // ... بقية دوال الكلاس (next, prev, show, close, static wizard) تبقى كما هي ...
}