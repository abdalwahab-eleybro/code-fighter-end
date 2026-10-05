/**
 * UI Components Module
 * Reusable UI components and helpers
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.Components = (() => {
  const S = CF.State;
  const C = CF.Campaign;
  const Q = CF.Questions;

  /* Create DOM element helper */
  function createElement(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.className) el.className = options.className;
    if (options.id) el.id = options.id;
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    if (options.style) Object.assign(el.style, options.style);
    if (options.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        el.setAttribute(key, value);
      }
    }
    if (options.children) {
      options.children.forEach(child => {
        if (typeof child === 'string') {
          el.appendChild(document.createTextNode(child));
        } else {
          el.appendChild(child);
        }
      });
    }
    if (options.onClick) el.addEventListener('click', options.onClick);
    return el;
  }

  /* Create icon element */
  function createIcon(icon, className = '') {
    return createElement('span', { className: `icon ${className}`, html: icon });
  }

  /* Create button */
  function createButton(text, options = {}) {
    const btn = createElement('button', {
      className: options.className || 'btn',
      text: text,
      onClick: options.onClick
    });
    if (options.id) btn.id = options.id;
    if (options.type) btn.type = options.type;
    if (options.disabled) btn.disabled = true;
    return btn;
  }

  /* Create menu button */
  function createMenuButton(icon, title, subtitle, onClick, id = '') {
    return createElement('button', {
      id: id,
      className: 'menu-btn',
      onClick: onClick,
      children: [
        createIcon(icon),
        createElement('div', {
          children: [
            createElement('strong', { text: title }),
            createElement('small', { text: subtitle })
          ]
        })
      ]
    });
  }

  /* Create card */
  function createCard(options = {}) {
    const card = createElement('div', {
      className: options.className || 'menu-card',
      children: options.children || []
    });
    if (options.id) card.id = options.id;
    return card;
  }

  /* Create profile bar */
  function createProfileBar() {
    const bar = createElement('div', {
      id: 'profileBar',
      className: 'profile-bar'
    });
    
    // Fighter icon
    const fighter = S.getFighter(S.profile.equippedFighter);
    bar.appendChild(createElement('div', {
      className: 'prof-fighter',
      html: fighter.icon
    }));
    
    // XP
    bar.appendChild(createElement('div', {
      className: 'prof-item',
      children: [
        createIcon('&#9733;'),
        createElement('span', {
          className: 'val',
          text: S.profile.playerLevel
        }),
        createElement('span', {
          className: 'lbl',
          text: 'LVL'
        })
      ]
    }));
    
    // Coins
    bar.appendChild(createElement('div', {
      className: 'prof-item',
      children: [
        createIcon('&#128176;'),
        createElement('span', {
          className: 'val',
          text: S.profile.coins
        }),
        createElement('span', {
          className: 'lbl',
          text: 'COINS'
        })
      ]
    }));
    
    // XP Bar
    const xpBar = createElement('div', { className: 'xp-bar' });
    const xpFill = createElement('div', { className: 'xp-fill' });
    const currentXP = S.profile.xp;
    const nextLevelXP = S.xpForLevel(S.profile.playerLevel + 1);
    const prevLevelXP = S.xpForLevel(S.profile.playerLevel);
    const xpPercent = nextLevelXP > 0 ? ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100 : 100;
    xpFill.style.width = `${xpPercent}%`;
    xpBar.appendChild(xpFill);
    bar.appendChild(xpBar);
    
    // Spacer
    bar.appendChild(createElement('div', { className: 'prof-spacer' }));
    
    // Stats
    const progress = C.getProgressSummary();
    bar.appendChild(createElement('div', {
      className: 'prof-item',
      children: [
        createIcon('&#9733;'),
        createElement('span', {
          className: 'val',
          text: progress.cleared
        }),
        createElement('span', {
          className: 'lbl',
          text: 'CLEARED'
        })
      ]
    }));
    
    bar.appendChild(createElement('div', {
      className: 'prof-item',
      children: [
        createIcon('&#127935;'),
        createElement('span', {
          className: 'val',
          text: progress.totalStars
        }),
        createElement('span', {
          className: 'lbl',
          text: 'STARS'
        })
      ]
    }));
    
    return bar;
  }

  /* Update profile bar */
  function updateProfileBar() {
    const bar = document.getElementById('profileBar');
    if (!bar) return;
    
    // Update fighter icon
    const fighterIcon = bar.querySelector('.prof-fighter');
    if (fighterIcon) {
      const fighter = S.getFighter(S.profile.equippedFighter);
      fighterIcon.innerHTML = fighter.icon;
    }
    
    // Update level
    const lvlEl = bar.querySelector('.prof-item .val');
    if (lvlEl && lvlEl.textContent.includes('LVL')) {
      // Find the parent and update
      const lvlParent = lvlEl.closest('.prof-item');
      if (lvlParent) {
        const valEl = lvlParent.querySelector('.val');
        if (valEl) valEl.textContent = S.profile.playerLevel;
      }
    }
    
    // Update coins
    const coinsEl = bar.querySelectorAll('.prof-item .val')[1];
    if (coinsEl) {
      coinsEl.textContent = S.profile.coins;
    }
    
    // Update XP bar
    const xpFill = bar.querySelector('.xp-fill');
    if (xpFill) {
      const currentXP = S.profile.xp;
      const nextLevelXP = S.xpForLevel(S.profile.playerLevel + 1);
      const prevLevelXP = S.xpForLevel(S.profile.playerLevel);
      const xpPercent = nextLevelXP > 0 ? ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100 : 100;
      xpFill.style.width = `${xpPercent}%`;
    }
    
    // Update stats
    const progress = C.getProgressSummary();
    const clearedEl = bar.querySelectorAll('.prof-item .val')[2];
    const starsEl = bar.querySelectorAll('.prof-item .val')[3];
    if (clearedEl) clearedEl.textContent = progress.cleared;
    if (starsEl) starsEl.textContent = progress.totalStars;
  }

  /* Create level card */
  function createLevelCard(level) {
    const isCleared = S.profile.campaignLevels[level.id]?.cleared;
    const stars = S.profile.campaignLevels[level.id]?.stars || 0;
    const isUnlocked = S.isLevelUnlocked(level.id);
    const isLocked = !isUnlocked;
    const isBoss = level.tier === 'boss';
    
    const card = createElement('div', {
      className: `level-card ${isCleared ? 'cleared' : ''} ${isBoss ? 'boss' : ''} ${isLocked ? 'locked' : ''}`,
      onClick: isLocked ? null : () => {
        // Start the level
        CF.UI.Navigation.showFight(level.id);
      }
    });
    
    // Icon
    const archetype = CF.Fighters.getArchetype(level.enemy);
    card.appendChild(createElement('div', {
      className: 'level-icon',
      html: archetype.icon
    }));
    
    // Body
    const body = createElement('div', { className: 'level-body' });
    
    // Name and tier badge
    const nameRow = createElement('div', {
      className: 'level-name',
      html: `${level.name} <span class="tier-badge tier-${level.tier}">${C.tierIcon(level.tier, isCleared, isUnlocked)}</span>`
    });
    body.appendChild(nameRow);
    
    // Meta
    body.appendChild(createElement('div', {
      className: 'level-meta',
      text: `${level.questions} Qs &middot; ${level.diff} Diff`
    }));
    
    // Stars if cleared
    if (isCleared) {
      const starsText = '\u2605'.repeat(stars);
      body.appendChild(createElement('div', {
        className: 'level-stars',
        text: starsText
      }));
    }
    
    // Locked reason
    if (isLocked) {
      const reason = C.lockedReason(level.id);
      body.appendChild(createElement('div', {
        className: 'level-locked',
        text: reason || 'Locked'
      }));
    }
    
    card.appendChild(body);
    
    return card;
  }

  /* Create question display */
  function createQuestionDisplay(question) {
    const wrap = createElement('div', { className: 'question-panel' });
    
    // Badge
    if (question.type) {
      const typeMeta = Q.getTypeMeta(question.type);
      wrap.appendChild(createElement('div', {
        className: 'question-badge',
        text: typeMeta.label
      }));
    }
    
    // Title
    wrap.appendChild(createElement('div', {
      className: 'question-title',
      text: question.title
    }));
    
    // Prompt
    if (question.prompt) {
      wrap.appendChild(createElement('div', {
        className: 'question-prompt',
        text: question.prompt
      }));
    }
    
    // Code
    if (question.code) {
      wrap.appendChild(createElement('div', {
        className: 'question-code',
        text: question.code
      }));
    }
    
    // Create answer options based on question type
    const answerEl = createAnswerOptions(question);
    if (answerEl) {
      wrap.appendChild(answerEl);
    }
    
    return wrap;
  }

  /* Create answer options based on question type */
  function createAnswerOptions(question) {
    switch (question.type) {
      case 'pattern':
      case 'complexity':
      case 'bug':
      case 'invariant':
        return createMCQOptions(question);
      case 'chips':
        return createChipOptions(question);
      case 'state':
      case 'trace':
        return createMCQOptions(question);
      case 'nextline':
        return createMCQOptions(question);
      case 'order':
        return createOrderOptions(question);
      case 'flowchart':
        return createMCQOptions(question);
      case 'numeric':
        return createNumericInput(question);
      default:
        return createMCQOptions(question);
    }
  }

  /* Create multiple choice options */
  function createMCQOptions(question) {
    const list = createElement('div', { className: 'mcq-list' });
    
    question.options.forEach((option, index) => {
      const optionEl = createElement('div', {
        className: 'mcq-option',
        attributes: { 'data-letter': String.fromCharCode(65 + index) },
        text: option,
        onClick: () => {
          // Handle answer selection
          selectAnswer(index);
        }
      });
      list.appendChild(optionEl);
    });
    
    return list;
  }

  /* Create chip options */
  function createChipOptions(question) {
    const row = createElement('div', { className: 'chips-row' });
    
    question.tokens.forEach((token, index) => {
      const chip = createElement('div', {
        className: 'chip',
        text: token,
        onClick: () => {
          selectAnswer(index);
        }
      });
      row.appendChild(chip);
    });
    
    return row;
  }

  /* Create order options */
  function createOrderOptions(question) {
    const list = createElement('div', { className: 'order-list' });
    
    question.options.forEach((option, index) => {
      const item = createElement('div', {
        className: 'order-item',
        onClick: () => {
          // Toggle selection
        },
        children: [
          createElement('div', { className: 'order-slot', text: index + 1 }),
          createElement('div', { className: 'order-line', text: option })
        ]
      });
      list.appendChild(item);
    });
    
    return list;
  }

  /* Create numeric input */
  function createNumericInput(question) {
    const display = createElement('div', { className: 'numeric-display' });
    const pad = createElement('div', { className: 'numeric-pad' });
    
    // Create number pad
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '\u232B'];
    keys.forEach(key => {
      const keyEl = createElement('div', {
        className: `numeric-key ${key === 'C' ? 'danger' : key === '\u232B' ? 'ghost' : ''}`,
        text: key,
        onClick: () => {
          // Handle key press
        }
      });
      pad.appendChild(keyEl);
    });
    
    const submit = createButton('SUBMIT', {
      className: 'submit-answer',
      onClick: () => {
        // Submit answer
      }
    });
    
    const container = createElement('div');
    container.appendChild(display);
    container.appendChild(pad);
    container.appendChild(submit);
    
    return container;
  }

  /* Helper to select answer */
  let currentQuestion = null;
  let answerCallback = null;
  
  function setAnswerCallback(callback) {
    answerCallback = callback;
  }
  
  function selectAnswer(index) {
    if (answerCallback && currentQuestion) {
      answerCallback(currentQuestion, index);
    }
  }
  
  function setCurrentQuestion(question) {
    currentQuestion = question;
  }

  /* Public API */
  return {
    createElement,
    createIcon,
    createButton,
    createMenuButton,
    createCard,
    createProfileBar,
    updateProfileBar,
    createLevelCard,
    createQuestionDisplay,
    createAnswerOptions,
    createMCQOptions,
    createChipOptions,
    createOrderOptions,
    createNumericInput,
    setAnswerCallback,
    setCurrentQuestion
  };
})();
