// src/domahawindows.js
// هذا الملف يحتوي على الكلاس DomahaWindow الذي ينشئ نوافذ منبثقة تفاعلية.

// استيراد ملف CSS الخاص بالمكتبة. Vite سيتولى معالجة هذا الاستيراد.
import './style.css'; 

export default class DomahaWindow {
    /**
     * الدالة الإنشائية: يتم استدعاؤها عند إنشاء نافذة جديدة.
     * @param {object} config - كائن الإعدادات.
     * @param {Array<Object>} config.steps - مصفوفة الخطوات. كل خطوة تحتوي على 'title' و 'content' أو 'htmlContent'.
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
        // أزرار التذييل (السابق والتالي/إنهاء)
        const footerButtons = `
            <button class="domaha-window-prev domaha-window-confirm">السابق</button>
            <button class="domaha-window-next domaha-window-confirm">التالي</button>
        `;
        
        // هيكل HTML الأساسي للنافذة
        windowDiv.innerHTML = `
            <div class="domaha-window-overlay">
                <div class="domaha-window-content">
                    <div class="domaha-window-header">
                        <h2 class="domaha-window-title"></h2>
                        <button class="domaha-window-close">&times;</button>
                    </div>
                    <div class="domaha-window-body">
                        <!-- هذا العنصر سيحتوي على المحتوى الفعلي للخطوة (نص أو HTML) -->
                        <div class="domaha-window-inner-content"></div> 
                    </div>
                    <div class="domaha-window-footer">
                        ${footerButtons}
                    </div>
                </div>
            </div>
        `;
        // الحصول على العنصر الأساسي للنافذة (الـ overlay)
        this.windowElement = windowDiv.firstElementChild;

        // ربط مستمعي الأحداث بالأزرار
        this.windowElement.querySelector('.domaha-window-close').addEventListener('click', () => this.close());
        this.windowElement.querySelector('.domaha-window-next').addEventListener('click', () => this.next());
        this.windowElement.querySelector('.domaha-window-prev').addEventListener('click', () => this.prev());
    }
    
    /**
     * دالة داخلية لتحديث محتوى النافذة (العنوان، النص، حالة الأزرار).
     */
    _updateContent() {
        const titleElement = this.windowElement.querySelector('.domaha-window-title');
        const innerContentElement = this.windowElement.querySelector('.domaha-window-inner-content');
        const nextButton = this.windowElement.querySelector('.domaha-window-next');
        const prevButton = this.windowElement.querySelector('.domaha-window-prev');

        const currentStep = this.steps[this.currentStepIndex];

        // تحديث العنوان
        titleElement.textContent = currentStep.title;

        // تحديث المحتوى: إذا كان هناك htmlContent، استخدم innerHTML، وإلا استخدم textContent
        if (currentStep.htmlContent) {
            innerContentElement.innerHTML = currentStep.htmlContent;
        } else {
            innerContentElement.textContent = currentStep.content;
        }

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
     * دالة ثابتة لتسهيل إنشاء نافذة متعددة الخطوات (ساحر).
     * @param {Array<Object>} steps - مصفوفة الخطوات.
     * @returns {DomahaWindow} - كائن النافذة الذي تم إنشاؤه.
     */
    static wizard(steps) {
        const newWindow = new DomahaWindow({ steps: steps });
        newWindow.show();
        return newWindow; // نُرجع الكائن لتمكين التفاعل معه لاحقاً
    }

    /**
     * دالة ثابتة لإنشاء نافذة سؤال المسابقة.
     * @param {Object} question - كائن السؤال الحالي (question_text, choices).
     * @param {Array<Object>} teams - مصفوفة الفرق (id, name, score).
     * @param {Object} currentTeam - كائن الفريق الحالي.
     * @param {Function} onAnswerSelected - دالة رد نداء تُستدعى عند اختيار إجابة.
     * @returns {DomahaWindow} - كائن النافذة الذي تم إنشاؤه.
     */
    static quizQuestion(question, teams, currentTeam, onAnswerSelected) {
        // بناء خيارات الإجابة يدويًا في HTML String
        const choicesHtml = question.choices.map(choice => {
            // نستخدم JSON.stringify و replace لضمان تمرير الكائن بشكل صحيح كـ String في onclick
            const choiceJson = JSON.stringify(choice).replace(/"/g, '&quot;');
            return `
                <button
                    onclick="window.DomahaWindow._handleQuizAnswerClick(${choiceJson})"
                    class="p-4 border-2 rounded-lg text-xl flex items-center justify-center h-full hover:bg-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-white text-gray-800">
                    <span>${choice.choice_text}</span>
                </button>
            `;
        }).join('');

        // بناء HTML لأسماء الفرق والنقاط
        const teamsScoresHtml = teams.map(team => {
            const activeClass = team.id === currentTeam.id ? 'ring-4 ring-offset-2 ring-blue-500' : '';
            return `
                <div class="p-3 bg-gray-700 rounded-lg shadow text-center ${activeClass}" style="background: var(--dw-bg1);">
                    <p class="text-lg font-bold truncate text-white">${team.name}</p>
                    <p class="text-3xl font-extrabold text-blue-400">${team.score}</p>
                </div>
            `;
        }).join('');

        const questionHtml = `
            <div class='domaha-quiz-question-container text-right rtl'>
                <p class="text-gray-600 text-lg mb-4 text-center font-bold" style="color:var(--dw-text-color);">دور الفريق: ${currentTeam.name}</p>
                <h3 class="text-3xl md:text-4xl font-bold mb-8 text-center" style="color:var(--dw-title-color);">${question.question_text}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${choicesHtml}
                </div>
                <div class="mt-6 text-center">
                    <p class="text-2xl font-bold" style="color:var(--dw-title-color);">
                        الفرق والنقاط:
                    </p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        ${teamsScoresHtml}
                    </div>
                </div>
            </div>
        `;

        // إنشاء نافذة DomahaWindow
        const quizWindowInstance = new DomahaWindow({
            steps: [{ title: `دور فريق: ${currentTeam.name}`, htmlContent: questionHtml }]
        });

        // هذا هو الجزء الذي يربط النقر في DomahaWindow بكود Alpine.js
        // سنحتاج إلى دالة عالمية مؤقتة للتعامل مع النقر على الإجابة
        window.DomahaWindow._currentOnAnswerSelected = onAnswerSelected;
        window.DomahaWindow._handleQuizAnswerClick = (choice) => {
            if (window.DomahaWindow._currentOnAnswerSelected) {
                window.DomahaWindow._currentOnAnswerSelected(choice);
            }
            // يمكن إغلاق النافذة هنا أو تركها لدالة رد النداء
            quizWindowInstance.close(); 
        };

        quizWindowInstance.show();
        return quizWindowInstance;
    }

    // دوال مساعدة داخلية لربط أحداث المسابقة
    static _currentOnAnswerSelected = null;
    static _handleQuizAnswerClick(choice) {
        // هذه الدالة سيتم استدعاؤها من onclick داخل HTML المحقون
        // ثم ستقوم باستدعاء الدالة الأصلية في Alpine.js
        if (window.DomahaWindow._currentOnAnswerSelected) {
            window.DomahaWindow._currentOnAnswerSelected(choice);
        }
    }
}
