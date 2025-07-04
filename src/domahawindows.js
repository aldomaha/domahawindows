import './style.css';
export default class DomahaWindow {
  constructor(config = {}) {
    this.steps = Array.isArray(config.steps) && config.steps.length > 0
      ? config.steps
      : [{ title: 'رسالة', content: 'لا يوجد محتوى.' }];
    this.currentStepIndex = 0;
    this.windowElement = null;
    this.config = config;
    this._createWindowElement();
  }

  _createWindowElement() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
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
            <button class="domaha-window-prev domaha-window-confirm">السابق</button>
            <button class="domaha-window-next domaha-window-confirm">التالي</button>
          </div>
        </div>
      </div>
    `;

    this.windowElement = wrapper.firstElementChild;

    this.windowElement.querySelector('.domaha-window-close')
      .addEventListener('click', () => this.close());
    this.windowElement.querySelector('.domaha-window-next')
      .addEventListener('click', () => this.next());
    this.windowElement.querySelector('.domaha-window-prev')
      .addEventListener('click', () => this.prev());
  }

  _updateContent() {
    const titleEl = this.windowElement.querySelector('.domaha-window-title');
    const contentEl = this.windowElement.querySelector('.domaha-window-body p');
    const nextBtn = this.windowElement.querySelector('.domaha-window-next');
    const prevBtn = this.windowElement.querySelector('.domaha-window-prev');

    const step = this.steps[this.currentStepIndex] || { title: '—', content: '—' };

    titleEl.textContent = step.title;
    contentEl.textContent = step.content;

    prevBtn.style.display = this.currentStepIndex === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = this.currentStepIndex === this.steps.length - 1 ? 'إنهاء' : 'التالي';
  }

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this._updateContent();
    } else {
      this.close();
      if (typeof this.config.onFinish === 'function') {
        this.config.onFinish();
      }
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this._updateContent();
    }
  }

  show() {
    this._updateContent();
    document.body.appendChild(this.windowElement);
  }

  close() {
    if (this.windowElement && document.body.contains(this.windowElement)) {
      document.body.removeChild(this.windowElement);
      this.windowElement = null;
    }
  }

  static wizard(steps, onFinish) {
    const win = new DomahaWindow({ steps, onFinish });
    win.show();
  }

  static quiz({ players = [], questions = [], onFinish = () => {} }) {
    let currentQuestion = 0;
    let currentPlayerIndex = 0;
    const scores = Object.fromEntries(players.map(name => [name, 0]));
    const wrapper = document.createElement('div');

  const render = () => {
  const player = players[currentPlayerIndex];
  const q = questions[currentQuestion];

  wrapper.innerHTML = `
    <div class="domaha-window-overlay">
      <div class="domaha-window-content">

        <div class="domaha-window-header">
          <h2 class="domaha-window-title">السؤال ${currentQuestion + 1}</h2>
          <button class="domaha-window-close">&times;</button>
        </div>

        <div class="domaha-window-body">

          <!-- بطاقات المتسابقين -->
          <div style="
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 1.5rem;
          ">
            ${players.map((name, i) => `
              <div style="
                flex: 1;
                padding: 1rem;
                border: 3px solid ${i === currentPlayerIndex ? 'var(--dw-button-bg)' : 'var(--dw-header-border)'};
                border-radius: var(--dw-border-radius);
                text-align: center;
                background: var(--dw-bg);
                box-shadow: ${i === currentPlayerIndex ? '0 0 0 3px var(--dw-button-hover-bg)' : 'none'};
                color: var(--dw-text-color);
                font-family: 'Noto Kufi Arabic', sans-serif;
              ">
                <div style="font-size: 1.1rem; font-weight: bold;">${name}</div>
                <div style="margin-top: 0.3rem; font-size: 0.9rem;">${scores[name]} نقطة</div>
              </div>
            `).join('')}
          </div>

          <!-- السؤال -->
          <p style="font-weight:bold; font-size:1.2rem; margin-bottom:1rem; color: var(--dw-text-color); font-family: 'Noto Kufi Arabic', sans-serif;">
            ${q.question}
          </p>

          <!-- الخيارات -->
          <div style="display:grid; gap:0.5rem;">
            ${q.choices.map((choice, i) => `
              <button class="answer" data-index="${i}" style="
                padding: 0.6rem;
                background: var(--dw-bg);
                border-radius: 0.5rem;
                border: 1px solid var(--dw-header-border);
                color: var(--dw-text-color);
                font-size:1rem;
                cursor: pointer;
                font-family: 'Noto Kufi Arabic', sans-serif;
              ">${choice}</button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  attachHandlers();
};

    const nextTurn = () => {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      if (currentPlayerIndex === 0) currentQuestion++;

      if (currentQuestion < questions.length) {
        render();
      } else {
        if (document.body.contains(wrapper)) {
          document.body.removeChild(wrapper);
        }
        onFinish(scores);
      }
    };

    const attachHandlers = () => {
      wrapper.querySelectorAll('.answer').forEach(button => {
        button.onclick = () => {
          const selected = +button.dataset.index;
          const correct = questions[currentQuestion].correctIndex;
          if (selected === correct) scores[players[currentPlayerIndex]]++;
          nextTurn();
        };
      });

      wrapper.querySelector('.domaha-window-close').onclick = () => {
        if (document.body.contains(wrapper)) {
          document.body.removeChild(wrapper);
          onFinish(scores);
        }
      };
    };

    render();
    document.body.appendChild(wrapper);
  }
}

