/**
 * Questions Data Module
 * Question bank organized by type, pattern, and difficulty
 * Contains question metadata and content
 */

window.CF = window.CF || {};

CF.Questions = (() => {
  /* Type metadata - damage multipliers and labels */
  const TYPE_META = {
    pattern:    { tier: 'recognition',  weight: 0.7,  baseDamage: 15, label: 'Pattern Recognition' },
    complexity: { tier: 'recognition',  weight: 0.8,  baseDamage: 18, label: 'Complexity' },
    chips:      { tier: 'application',  weight: 1.0,  baseDamage: 20, label: 'Fill the Blank' },
    state:      { tier: 'comprehension', weight: 1.25, baseDamage: 25, label: 'State Tracking' },
    trace:      { tier: 'comprehension', weight: 1.25, baseDamage: 25, label: 'Trace Output' },
    nextline:   { tier: 'application',  weight: 1.35, baseDamage: 27, label: 'Next Line' },
    order:      { tier: 'application',  weight: 1.4,  baseDamage: 28, label: 'Order the Lines' },
    flowchart:  { tier: 'application',  weight: 1.4,  baseDamage: 28, label: 'Flowchart Path' },
    invariant:  { tier: 'analysis',     weight: 1.6,  baseDamage: 32, label: 'Invariant / Why' },
    bug:        { tier: 'analysis',     weight: 1.75, baseDamage: 35, label: 'Spot the Bug' },
    numeric:    { tier: 'comprehension', weight: 1.25, baseDamage: 25, label: 'Numeric Answer' }
  };

  /* Question types for filtering */
  const QUESTION_TYPES = [
    'pattern', 'complexity', 'chips', 'state', 'trace',
    'nextline', 'order', 'flowchart', 'invariant', 'bug', 'numeric'
  ];

  /* Difficulty levels */
  const DIFFICULTY_LEVELS = [1, 2, 3];

  /* The question bank - organized by pattern and difficulty */
  const BANK = {
    // Foundations (F1)
    f1: {
      easy: [
        {
          id: 'f1-q1',
          type: 'state',
          title: 'What does this print?',
          prompt: 'Trace the loop by hand.',
          code: 's = ["c","o","d","e"]\nL, R = 0, 3\nwhile L < R:\n    s[L], s[R] = s[R], s[L]\n    L += 1\n    R -= 1\nprint("".join(s))',
          options: ['edoc', 'code', 'ocde', 'deco'],
          correct: 0,
          explanation: 'Two in-place swaps: c\u2194e, then o\u2194d. Strict bound L < R \u2014 the loop stops when L = 2, R = 1.'
        }
      ],
      medium: [
        {
          id: 'f1-q2',
          type: 'bug',
          title: 'Why does this crash?',
          prompt: 'nums = [2, 0, 0, 0]. The loop crashes with IndexError. Why?',
          code: 'r = 1\nwhile nums[r] == 0 and r < len(nums):\n    r += 1',
          options: [
            'The junk test runs first \u2014 once r reaches len(nums), it reads nums[4] on a length-4 array before the bounds check can stop it',
            'The loop needs a write pointer as well',
            'while loops cannot combine two conditions with and',
            'The crash only happens on even-length arrays'
          ],
          correct: 0,
          explanation: 'Primitive 6: bounds FIRST \u2014 while r < n and nums[r] == 0. "and" checks left to right, so the junk test must never see an out-of-range r.'
        }
      ],
      hard: [
        {
          id: 'f1-q3',
          type: 'invariant',
          title: 'What does write equal?',
          prompt: 'nums = [3, 0, 4, 0, 5]. One in-place pass erases the zeros using read r and write w. After the pass:',
          code: 'if nums[r] != 0:\n    nums[w] = nums[r]\n    w += 1\nr += 1',
          options: ['w = 3 \u2014 the clean length; the first 3 cells read [3, 4, 5]', 'w = 2 \u2014 one per zero', 'w = 5 \u2014 the whole array', 'w = 0 \u2014 nothing was written'],
          correct: 0,
          explanation: 'Primitive 4: the final write IS the virtual length. [3, 4, 5, \u2026] with w = 3 \u2014 the tail is harmless garbage.'
        }
      ]
    },
    
    // Converging (P1)
    p1: {
      easy: [
        {
          id: 'p1-q1',
          type: 'pattern',
          title: 'Which pattern fits?',
          prompt: 'Sorted array of integers. Find whether ANY two elements sum to a target value. Fastest approach?',
          options: [
            'P1 \u0013 Two Pointers Converging',
            'P4 \u0013 Sliding Window',
            'P6 \u0013 Prefix Sum',
            'P7 \u0013 Kadane',
            'Hash map lookup',
            'Sort then binary search'
          ],
          correct: 0,
          explanation: 'Sorted input + pair matching \u2192 converge from both ends. O(N) time, O(1) space.'
        }
      ],
      medium: [
        {
          id: 'p1-q5',
          type: 'invariant',
          title: 'Why move the shorter line?',
          prompt: 'In Container With Most Water, why is moving the SHORTER line inward always safe?',
          options: [
            'The taller line is redundant',
            'Any inward move shrinks the width \u2014 the shorter line already caps the height, so no move can beat the current area',
            'We already recorded the maximum, so it does not matter',
            'It is a heuristic \u2014 the algorithm can miss the true optimum'
          ],
          correct: 1,
          explanation: 'Width strictly decreases with any inward move. The shorter line is the bottleneck for height. So the taller line can never produce a better area than what we already have.'
        }
      ],
      hard: [
        {
          id: 'p1-q7',
          type: 'bug',
          title: 'Which input exposes the bug?',
          prompt: 'This 3Sum variant is wrong. What input makes it produce a wrong answer?',
          code: 'res = []\nfor i in range(n - 2):\n    L, R = i + 1, n - 1\n    while L < R:\n        total = nums[i] + nums[L] + nums[R]\n        if total == 0:\n            res.append([nums[i], nums[L], nums[R]])\n            L += 1\n            R -= 1\n        elif total < 0:\n            L += 1\n        else:\n            R -= 1\nreturn res',
          options: ['[-1, 0, 1]', '[-2, 0, 0, 2]', '[0, 0, 0]', '[1, 2, 3]'],
          correct: 1,
          explanation: 'Two different i values produce the same triplet [-2, 0, 2]. The outer anchor never skips duplicates. [-2,0,0,2] triggers this.'
        }
      ]
    },
    
    // Read-Write (P2)
    p2: {
      easy: [
        {
          id: 'p2-q1',
          type: 'pattern',
          title: 'Which pattern fits?',
          prompt: 'Remove all occurrences of a value from an array, in place. Return the new length. Fastest approach?',
          options: [
            'P2 \u0013 Same-direction Read & Write',
            'P1 \u0013 Two Pointers Converging',
            'P4 \u0013 Sliding Window',
            'P6 \u0013 Prefix Sum',
            'Sort then binary search'
          ],
          correct: 0,
          explanation: 'Both pointers start at 0. Read scans, write builds the valid prefix in place.'
        }
      ],
      medium: [
        {
          id: 'p2-q3',
          type: 'trace',
          title: 'What does this return?',
          prompt: 'nums = [0, 0, 1, 1, 1, 2]',
          code: 'slow = 0\nfor fast in range(1, len(nums)):\n    if nums[fast] != nums[slow]:\n        slow += 1\n        nums[slow] = nums[fast]\nreturn slow + 1',
          options: ['3', '6', '2', '[0, 1, 2]'],
          correct: 0,
          explanation: 'slow ends at index 2 (the last unique value 2). Return slow + 1 = 3 = the new logical length.'
        }
      ],
      hard: []
    }
    // Add more patterns as needed...
  };

  /* Get question by ID */
  function getQuestion(id) {
    for (const patternId in BANK) {
      for (const diff in BANK[patternId]) {
        const question = BANK[patternId][diff].find(q => q.id === id);
        if (question) return question;
      }
    }
    return null;
  }

  /* Get questions for a specific level */
  function getQuestionsForLevel(levelId) {
    const level = CF.Campaign.getLevel(levelId);
    if (!level) return [];
    
    const pattern = level.pattern;
    const tier = level.tier;
    const difficulty = level.diff;
    
    // Map tier to difficulty
    const diffMap = { easy: 'easy', medium: 'medium', hard: 'hard', boss: 'hard' };
    const diff = diffMap[tier] || 'easy';
    
    // Get questions for this pattern and difficulty
    const questions = BANK[pattern]?.[diff] || [];
    
    // Shuffle and return first N questions
    return shuffleArray([...questions]).slice(0, level.questions);
  }

  /* Get random question from a pattern */
  function getRandomQuestion(patternId, difficulty) {
    const questions = BANK[patternId]?.[difficulty] || [];
    if (questions.length === 0) return null;
    return questions[Math.floor(Math.random() * questions.length)];
  }

  /* Get all questions */
  function getAllQuestions() {
    const all = [];
    for (const patternId in BANK) {
      for (const diff in BANK[patternId]) {
        all.push(...BANK[patternId][diff]);
      }
    }
    return all;
  }

  /* Get questions by type */
  function getQuestionsByType(type) {
    return getAllQuestions().filter(q => q.type === type);
  }

  /* Get questions by pattern */
  function getQuestionsByPattern(patternId) {
    const questions = [];
    for (const diff in BANK[patternId] || {}) {
      questions.push(...BANK[patternId][diff]);
    }
    return questions;
  }

  /* Get type metadata */
  function getTypeMeta(type) {
    return TYPE_META[type] || TYPE_META.pattern;
  }

  /* Utility: Fisher-Yates shuffle */
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* Validate answer */
  function validateAnswer(question, answer) {
    if (question.options) {
      // Multiple choice
      return answer === question.correct || answer === question.options[question.correct];
    } else if (question.correctAnswer !== undefined) {
      // Direct comparison
      return answer === question.correctAnswer;
    }
    return false;
  }

  /* Get correct answer */
  function getCorrectAnswer(question) {
    if (question.options) {
      return question.options[question.correct];
    }
    return question.correctAnswer;
  }

  /* Public API */
  return {
    TYPE_META,
    QUESTION_TYPES,
    DIFFICULTY_LEVELS,
    BANK,
    getQuestion,
    getQuestionsForLevel,
    getRandomQuestion,
    getAllQuestions,
    getQuestionsByType,
    getQuestionsByPattern,
    getTypeMeta,
    validateAnswer,
    getCorrectAnswer,
    shuffleArray
  };
})();
