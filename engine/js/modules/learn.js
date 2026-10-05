/**
 * Learn Module
 * Learning lab functionality
 */

window.CF = window.CF || {};

CF.Learn = (() => {
  const S = CF.State;
  const Q = CF.Questions;

  /* Learning lessons */
  const LESSONS = [
    {
      id: 'lesson-1',
      name: 'Two Pointers Basics',
      icon: '\u25b6',
      desc: 'Learn the fundamentals of two pointers technique',
      pattern: 'p1',
      completed: false
    },
    {
      id: 'lesson-2',
      name: 'Read-Write Pattern',
      icon: '\u2192',
      desc: 'Master the read-write pointer pattern',
      pattern: 'p2',
      completed: false
    },
    {
      id: 'lesson-3',
      name: 'Sliding Window',
      icon: '\ud83d\uddfa',
      desc: 'Understand sliding window technique',
      pattern: 'p4',
      completed: false
    },
    {
      id: 'lesson-4',
      name: 'Prefix Sum',
      icon: '\u2211',
      desc: 'Learn prefix sum and its applications',
      pattern: 'p6',
      completed: false
    }
  ];

  /* Get all lessons */
  function getAllLessons() {
    return [...LESSONS];
  }

  /* Get lesson by ID */
  function getLesson(id) {
    return LESSONS.find(l => l.id === id);
  }

  /* Mark lesson as completed */
  function completeLesson(id) {
    if (!S.profile.lessonProgress) {
      S.profile.lessonProgress = {};
    }
    S.profile.lessonProgress[id] = true;
    S.save();
  }

  /* Check if lesson is completed */
  function isLessonCompleted(id) {
    return S.profile.lessonProgress?.[id] || false;
  }

  /* Get questions for a lesson */
  function getLessonQuestions(lessonId, count = 5) {
    const lesson = getLesson(lessonId);
    if (!lesson) return [];
    
    const questions = Q.getQuestionsByPattern(lesson.pattern);
    return Q.shuffleArray([...questions]).slice(0, count);
  }

  /* Public API */
  return {
    getAllLessons,
    getLesson,
    completeLesson,
    isLessonCompleted,
    getLessonQuestions
  };
})();
