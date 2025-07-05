// src/domahawindows.js
// هذا الملف يحتوي على الكلاس DomahaWindow الذي ينشئ نوافذ منبثقة تفاعلية.

// استيراد ملف CSS الخاص بالمكتبة. Vite سيتولى معالجة هذا الاستيراد.
import './style.css'; 

export default class DomahaWindow {
    /**
     * الدالة الإنشائية: يتم استدعاؤها عند إنشاء نافذة جديدة.
     * @param {object} config - كائن الإعدادات.
     * @param {Array<Object>} config.steps - مصفوفة الخطوات. كل خطوة تحتوي على 'title' و 'content' أو 'htmlContent'.
     * @param {boolean} [config.autoShow=false] - هل يجب عرض النافذة تلقائياً عند الإنشاء.
     * @param {boolean} [config.closeOnClickOutside=false] - هل تغلق النافذة عند النقر خارجها.
     */
    constructor(config = {}) {
        this.steps = config.steps || [{ title: 'رسالة', content: 'لا يوجد محتوى.' }];
        this.currentStepIndex = 0;
        this.windowElement = null;
        this.config = config; // حفظ الإعدادات للوصول إليها لاحقاً
        this._createWindowElement();

        // إذا كانت autoShow true، اعرض النافذة فوراً
        if (config.autoShow) {
            this.show();
        }

        // ربط حدث الإغلاق عند النقر خارج النافذة إذا كان الخيار مفعلاً
        if (config.closeOnClickOutside) {
            this.windowElement.addEventListener('click', (event) => {
                if (event.target === this.windowElement) { // إذا تم النقر على الـ overlay نفسه
                    this.close();
                }
            });
        }
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
        
        // هيكل HTML الأساسي للنافذة
        windowDiv.innerHTML = `
            <div class="domaha-window-overlay">
                <div class="domaha-window-content">
                    <div class="domaha-window-header">
                        <h2 class="domaha-window-title"></h2>
                        <!-- زر الإغلاق يمكن أن يكون موجوداً أو لا -->
                        <button class="domaha-window-close" aria-label="إغلاق">&times;</button>
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
        this.windowElement = windowDiv.firstElementChild;

        // ربط مستمعي الأحداث بالأزرار
        const closeButton = this.windowElement.querySelector('.domaha-window-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
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

        titleElement.textContent = currentStep.title;

        // تحديث المحتوى: إذا كان هناك htmlContent، استخدم innerHTML، وإلا استخدم textContent
        if (currentStep.htmlContent) {
            innerContentElement.innerHTML = currentStep.htmlContent;
        } else {
            innerContentElement.textContent = currentStep.content;
        }

        prevButton.style.display = this.currentStepIndex === 0 ? 'none' : 'inline-block';
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
            this.close();
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
        return newWindow;
    }

    /**
     * دالة ثابتة لإدارة منطق المسابقة بالكامل.
     * @param {Object} config - إعدادات المسابقة.
     * @param {Array<Object>} config.teams - مصفوفة الفرق.
     * @param {Array<Object>} config.questions - مصفوفة الأسئلة.
     * @param {Function} config.onFinish - دالة رد نداء تُستدعى عند انتهاء المسابقة.
     * @param {HTMLAudioElement} config.audioElement - عنصر الصوت لتشغيل المؤثرات.
     */
    static quiz(config) {
        const { teams, questions, onFinish, audioElement } = config;

        let currentQuestionIndex = 0;
        let currentTeamIndex = 0;
        let quizWindowInstance = null;
        let resultWindowInstance = null;
        let currentScores = Object.fromEntries(teams.map(t => [t.name, t.score]));

        const playSound = (isCorrect) => {
            const soundList = isCorrect
                ? Array.from({ length: 6 }, (_, i) => `/sounds/correct${i + 1}.mp3`)
                : Array.from({ length: 3 }, (_, i) => `/sounds/wrong${i + 1}.mp3`);
            const selectedSound = soundList[Math.floor(Math.random() * soundList.length)];
            
            if (audioElement) {
                audioElement.src = selectedSound;
                audioElement.currentTime = 0;
                audioElement.play().catch(e => console.error('فشل تشغيل الصوت:', e));
            } else {
                console.warn('عنصر الصوت (audioElement) غير موجود في DomahaWindow.quiz.');
            }
        };

        const isFinished = () => !questions || currentQuestionIndex >= questions.length;
        const getCurrentQuestion = () => questions[currentQuestionIndex];
        const getCurrentTeam = () => teams[currentTeamIndex];

        const selectAnswer = (choice) => {
            const isCorrect = choice.is_correct;

            if (isCorrect) {
                currentScores[getCurrentTeam().name]++;
            }

            playSound(isCorrect);

            if (quizWindowInstance) {
                quizWindowInstance.close();
            }

            const resultTitle = isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة!';
            const resultContent = isCorrect ? 'لقد أحسنت الإجابة، رائع!' : 'للأسف، هذه ليست الإجابة الصحيحة. حاول مرة أخرى.';

            resultWindowInstance = new DomahaWindow({
                steps: [{ title: resultTitle, content: resultContent }]
            });
            resultWindowInstance.show();

            resultWindowInstance.windowElement.querySelector('.domaha-window-next').addEventListener('click', () => {
                nextTurn(isCorrect);
                resultWindowInstance.close();
            }, { once: true });
        };

        const nextTurn = (wasCorrect) => {
            if (wasCorrect) {
                currentQuestionIndex++;
                currentTeamIndex = (currentTeamIndex + 1) % teams.length;
            } else {
                currentTeamIndex = (currentTeamIndex + 1) % teams.length;
                if (currentTeamIndex === 0) {
                    currentQuestionIndex++;
                }
            }

            if (!isFinished()) {
                showQuestionWindow();
            } else {
                if (onFinish) {
                    onFinish(currentScores);
                }
            }
        };

        const showQuestionWindow = () => {
            const currentQ = getCurrentQuestion();
            const currentT = getCurrentTeam();

            const choicesHtml = currentQ.choices.map(choice => {
                const choiceJson = JSON.stringify(choice).replace(/"/g, '&quot;');
                return `
                    <button
                        onclick="window.DomahaWindow._handleQuizAnswerClick(${choiceJson})"
                        class="p-4 border-2 rounded-lg text-xl flex items-center justify-center h-full hover:bg-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-white text-gray-800">
                        <span>${choice.choice_text}</span>
                    </button>
                `;
            }).join('');

            const teamsScoresHtml = teams.map(team => {
                const activeClass = team.id === currentT.id ? 'ring-4 ring-offset-2 ring-blue-500' : '';
                return `
                    <div class="p-3 bg-gray-700 rounded-lg shadow text-center ${activeClass}" style="background: var(--dw-bg1);">
                        <p class="text-lg font-bold truncate text-white">${team.name}</p>
                        <p class="text-3xl font-extrabold text-blue-400">${currentScores[team.name]}</p>
                    </div>
                `;
            }).join('');

            const questionHtml = `
                <div class='domaha-quiz-question-container text-right rtl'>
                    <p class="text-gray-600 text-lg mb-4 text-center font-bold" style="color:var(--dw-text-color);">دور الفريق: ${currentT.name}</p>
                    <h3 class="text-3xl md:text-4xl font-bold mb-8 text-center" style="color:var(--dw-title-color);">${currentQ.question_text}</h3>
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

            quizWindowInstance = new DomahaWindow({
                steps: [{ title: `دور فريق: ${currentT.name}`, htmlContent: questionHtml }]
            });

            window.DomahaWindow._currentQuizSelectAnswer = selectAnswer;
            
            quizWindowInstance.show();
        };

        window.DomahaWindow._handleQuizAnswerClick = (choice) => {
            if (DomahaWindow._currentQuizSelectAnswer) {
                DomahaWindow._currentQuizSelectAnswer(choice);
            }
        };

        showQuestionWindow();

        return {
            closeQuiz: () => {
                if (quizWindowInstance) quizWindowInstance.close();
                if (resultWindowInstance) resultWindowInstance.close();
            }
        };
    }

    // متغيرات ودوال مساعدة داخلية لربط أحداث المسابقة
    static _currentQuizSelectAnswer = null;
    static _handleQuizAnswerClick(choice) {
        if (DomahaWindow._currentQuizSelectAnswer) {
            DomahaWindow._currentQuizSelectAnswer(choice);
        }
    }

    /**
     * دالة ثابتة لتهيئة النوافذ التصريحية من HTML.
     * يتم استدعاؤها مرة واحدة عند تحميل الصفحة.
     */
    static init() {
        document.querySelectorAll('[dw-window]').forEach(element => {
            const title = element.getAttribute('dw-title') || 'نافذة Domaha';
            const content = element.getAttribute('dw-content') || '';
            const htmlContent = element.innerHTML; // نأخذ المحتوى الداخلي كـ HTML

            const config = {
                steps: [{
                    title: title,
                    htmlContent: htmlContent // نستخدم htmlContent للمحتوى الداخلي
                }],
                autoShow: element.hasAttribute('dw-show-on-load'), // هل تظهر تلقائياً
                closeOnClickOutside: element.hasAttribute('dw-close-on-click-outside') // هل تغلق بالنقر خارجها
            };

            const windowInstance = new DomahaWindow(config);

            // ربط زر الإغلاق إذا كان موجوداً داخل العنصر التصريحي
            const closeButton = element.querySelector('[dw-close]');
            if (closeButton) {
                closeButton.addEventListener('click', () => windowInstance.close());
            }

            // ربط زر الفتح إذا كان موجوداً
            const openButtonId = element.getAttribute('dw-open-button');
            if (openButtonId) {
                const openButton = document.getElementById(openButtonId);
                if (openButton) {
                    openButton.addEventListener('click', () => windowInstance.show());
                }
            }

            // إزالة العنصر الأصلي من الـ DOM بعد معالجته
            element.remove();
        });
    }
}

// استدعاء DomahaWindow.init() تلقائياً عند تحميل DOM
document.addEventListener('DOMContentLoaded', () => {
    DomahaWindow.init();
});
