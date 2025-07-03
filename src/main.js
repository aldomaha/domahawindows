export default class DomahaWindow {
    /**
     * الدالة الإنشائية: يتم استدعاؤها عند إنشاء نافذة جديدة.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(config = {}) {
        // حفظ الخطوات التي تم تمريرها.
        this.steps = config.steps || [{ title: 'رسالة', content: 'لا يوجد محتوى.' }];
        // تتبع الخطوة الحالية (دائمًا نبدأ من الصفر).
        this.currentStepIndex = 0;
        // خاصية لحفظ عنصر النافذة بعد إنشائه.
        this.windowElement = null;
        // بناء عنصر النافذة في الذاكرة.
        this._createWindowElement();
    }

    /**
     * دالة داخلية لبناء هيكل النافذة (HTML).
     * يتم استدعاؤها مرة واحدة فقط في الـ constructor.
     */
    _createWindowElement() {
        const windowDiv = document.createElement('div');
        const footerButtons = `
            <button class="domaha-window-prev">السابق</button>
            <button class="domaha-window-next">التالي</button>
        `;
        
        windowDiv.innerHTML = `
            <div class="domaha-window-overlay">
                <div class="domaha-window-content">
                    <div class="domaha-window-header">
                        <h2 class="domaha-window-title"></h2>
                        <button class="domaha-window-close">&times;</button>
                    </div>
                    <div class="domaha-window-body">
                        <p></p>
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
        const contentElement = this.windowElement.querySelector('.domaha-window-body p');
        const nextButton = this.windowElement.querySelector('.domaha-window-next');
        const prevButton = this.windowElement.querySelector('.domaha-window-prev');

        // تحديث العنوان والمحتوى بناءً على الخطوة الحالية.
        titleElement.textContent = this.steps[this.currentStepIndex].title;
        contentElement.textContent = this.steps[this.currentStepIndex].content;

        // إخفاء زر "السابق" في الخطوة الأولى.
        prevButton.style.display = this.currentStepIndex === 0 ? 'none' : 'inline-block';
        
        // تغيير نص زر "التالي" إلى "إنهاء" في الخطوة الأخيرة.
        nextButton.textContent = (this.currentStepIndex === this.steps.length - 1) ? 'إنهاء' : 'التالي';
    }

    /**
     * دالة الانتقال للخطوة التالية.
     */
    next() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this._updateContent();
        } else {
            this.close(); // إغلاق النافذة عند الضغط على "إنهاء".
        }
    }

    /**
     * دالة الرجوع للخطوة السابقة.
     */
    prev() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this._updateContent();
        }
    }

    /**
     * دالة إظهار النافذة.
     */
    show() {
        // تحديث المحتوى ليعرض الحالة الصحيحة قبل الإظهار.
        this._updateContent();
        document.body.appendChild(this.windowElement);
    }

    /**
     * دالة إغلاق النافذة.
     */
    close() {
        if (document.body.contains(this.windowElement)) {
            document.body.removeChild(this.windowElement);
        }
    }
    
    /**
     * دالة ثابتة لتسهيل إنشاء نافذة متعددة الخطوات.
     */
    static wizard(steps) {
        const newWindow = new DomahaWindow({ steps: steps });
        newWindow.show();
    }
}