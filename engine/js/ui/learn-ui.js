/**
 * Learn UI Module
 * Renders the learning lab screen
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.LearnUI = (() => {
  const S = CF.State;
  const Components = CF.UI.Components;

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

  /* Render the learn screen */
  function render() {
    const learnContent = document.getElementById('learnContent');
    if (!learnContent) return;
    
    learnContent.innerHTML = '';
    
    // Header
    const header = Components.createElement('div', { className: 'shop-header' });
    
    const backBtn = Components.createButton('\u2190 Menu', {
      className: 'back-btn',
      onClick: () => CF.UI.Navigation.showMenu()
    });
    header.appendChild(backBtn);
    
    learnContent.appendChild(header);
    
    // Title
    learnContent.appendChild(Components.createElement('div', {
      className: 'map-title',
      text: 'Learning Lab'
    }));
    
    // Progress
    const progress = Components.createElement('div', {
      className: 'lsn-progress',
      text: 'Interactive Lessons'
    });
    learnContent.appendChild(progress);
    
    // Lessons grid
    const grid = Components.createElement('div', { className: 'shop-grid' });
    
    LESSONS.forEach(lesson => {
      const card = createLessonCard(lesson);
      grid.appendChild(card);
    });
    
    learnContent.appendChild(grid);
  }

  /* Create lesson card */
  function createLessonCard(lesson) {
    const isCompleted = S.profile.lessonProgress?.[lesson.id];
    
    const card = Components.createElement('div', {
      className: `lsn-card ${isCompleted ? 'done' : ''}`,
      onClick: () => {
        startLesson(lesson);
      }
    });
    
    // Icon
    card.appendChild(Components.createElement('div', {
      className: 'lsn-icon',
      html: lesson.icon
    }));
    
    // Body
    const body = Components.createElement('div', { className: 'lsn-body' });
    
    // Name
    body.appendChild(Components.createElement('div', {
      className: 'lsn-name',
      text: lesson.name
    }));
    
    // Description
    body.appendChild(Components.createElement('div', {
      className: 'lsn-desc',
      text: lesson.desc
    }));
    
    card.appendChild(body);
    
    // Status
    if (isCompleted) {
      card.appendChild(Components.createElement('div', {
        className: 'lsn-go',
        text: 'COMPLETED'
      }));
    } else {
      card.appendChild(Components.createElement('div', {
        className: 'lsn-go',
        text: 'START'
      }));
    }
    
    return card;
  }

  /* Start a lesson */
  function startLesson(lesson) {
    // For now, just show a placeholder
    const learnContent = document.getElementById('learnContent');
    if (!learnContent) return;
    
    learnContent.innerHTML = '';
    
    const card = Components.createElement('div', {
      className: 'lsn-done-card',
      children: [
        Components.createElement('div', {
          className: 'lsn-done-icon',
          html: lesson.icon
        }),
        Components.createElement('div', {
          className: 'lsn-done-title',
          text: 'Lesson Coming Soon!'
        }),
        Components.createElement('div', {
          className: 'lsn-done-sub',
          text: `The ${lesson.name} lesson is under development.`
        }),
        Components.createElement('div', {
          className: 'lsn-done-note',
          text: 'Check back later for interactive lessons with visualizations, explanations, and AI tutoring.'
        }),
        Components.createButton('Back to Lessons', {
          className: 'btn primary',
          onClick: () => render()
        })
      ]
    });
    
    learnContent.appendChild(card);
  }

  /* Public API */
  return {
    render,
    startLesson
  };
})();
