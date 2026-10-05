/**
 * Recap UI Module
 * Renders the fight recap screen
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.RecapUI = (() => {
  const S = CF.State;
  const C = CF.Campaign;
  const Q = CF.Questions;
  const Components = CF.UI.Components;

  /* Render the recap screen */
  function render() {
    const recapContent = document.getElementById('recapContent');
    if (!recapContent) return;
    
    recapContent.innerHTML = '';
    
    const result = S.session.fightResult;
    if (!result) {
      recapContent.innerHTML = '<p>No fight result to display.</p>';
      return;
    }
    
    // Create recap card
    const card = Components.createElement('div', { className: 'recap-card' });
    
    // Headline
    const headlineClass = result.won ? 'recap-headline win' : 'recap-headline loss';
    const headlineText = result.won ? 'VICTORY!' : 'DEFEAT';
    
    card.appendChild(Components.createElement('div', {
      className: headlineClass,
      text: headlineText
    }));
    
    // Stars
    if (result.stars) {
      const starsText = '\u2605'.repeat(result.stars);
      card.appendChild(Components.createElement('div', {
        className: 'recap-stars',
        html: starsText
      }));
    }
    
    // Subtitle
    if (result.level) {
      card.appendChild(Components.createElement('div', {
        className: 'recap-subtitle',
        text: `${result.level.name} completed`
      }));
    } else if (result.mode === 'blitz') {
      card.appendChild(Components.createElement('div', {
        className: 'recap-subtitle',
        text: 'Blitz Run completed'
      }));
    }
    
    // Stats
    const stats = Components.createElement('div', { className: 'recap-stats' });
    
    // Accuracy
    const accuracy = S.session.answered > 0 ? 
      Math.round((S.session.correct / S.session.answered) * 100) : 0;
    
    stats.appendChild(createStatCell(S.session.correct, 'CORRECT'));
    stats.appendChild(createStatCell(S.session.answered - S.session.correct, 'WRONG'));
    stats.appendChild(createStatCell(accuracy, 'ACCURACY'));
    stats.appendChild(createStatCell(S.session.combo, 'COMBO'));
    
    card.appendChild(stats);
    
    // Rewards (for campaign mode)
    if (result.level && result.won) {
      const rewards = Components.createElement('div', { className: 'recap-rewards' });
      
      // XP reward
      const xpReward = Components.createElement('div', {
        className: `recap-reward ${result.newBest ? 'new-best' : ''}`
      });
      xpReward.appendChild(Components.createElement('div', {
        className: 'recap-reward-val',
        text: `+${result.xpGained || 0}`
      }));
      xpReward.appendChild(Components.createElement('div', {
        className: 'recap-reward-lbl',
        text: 'XP'
      }));
      rewards.appendChild(xpReward);
      
      // Coins reward
      const coinsReward = Components.createElement('div', {
        className: `recap-reward ${result.newBest ? 'new-best' : ''}`
      });
      coinsReward.appendChild(Components.createElement('div', {
        className: 'recap-reward-val',
        text: `+${result.coinsGained || 0}`
      }));
      coinsReward.appendChild(Components.createElement('div', {
        className: 'recap-reward-lbl',
        text: 'COINS'
      }));
      rewards.appendChild(coinsReward);
      
      card.appendChild(rewards);
    }
    
    // Question log
    if (S.session.roundLog && S.session.roundLog.length > 0) {
      card.appendChild(Components.createElement('div', {
        className: 'recap-section-title',
        text: 'Question Log'
      }));
      
      const log = Components.createElement('div', { className: 'recap-log' });
      
      S.session.roundLog.forEach((entry, index) => {
        const row = Components.createElement('div', {
          className: `recap-row ${entry.correct ? 'ok' : 'fail'}`
        });
        
        row.appendChild(Components.createElement('div', {
          className: 'recap-num',
          text: index + 1
        }));
        
        row.appendChild(Components.createElement('div', {
          className: 'recap-mark',
          text: entry.correct ? '\u2713' : '\u2717'
        }));
        
        row.appendChild(Components.createElement('div', {
          className: 'recap-title',
          text: entry.questionTitle || 'Question'
        }));
        
        row.appendChild(Components.createElement('div', {
          className: 'recap-type',
          text: entry.questionType || 'unknown'
        }));
        
        row.appendChild(Components.createElement('div', {
          className: 'recap-time',
          text: C.formatTime(entry.time || 0)
        }));
        
        log.appendChild(row);
      });
      
      card.appendChild(log);
    }
    
    // Actions
    const actions = Components.createElement('div', { className: 'recap-actions' });
    
    if (result.level) {
      // Replay button
      const replayBtn = Components.createButton('Replay', {
        className: 'btn primary',
        onClick: () => {
          CF.UI.Navigation.showFight(result.level.id);
        }
      });
      actions.appendChild(replayBtn);
    }
    
    // Next level button (if won and in campaign)
    if (result.won && result.level) {
      const nextLevel = C.getNextLevel(result.level.id);
      if (nextLevel) {
        const nextBtn = Components.createButton('Next Level', {
          className: 'btn primary',
          onClick: () => {
            CF.UI.Navigation.showFight(nextLevel.id);
          }
        });
        actions.appendChild(nextBtn);
      }
    }
    
    // Continue button
    const continueBtn = Components.createButton('Continue', {
      className: 'btn ghost',
      onClick: () => {
        CF.UI.Navigation.showMap();
      }
    });
    actions.appendChild(continueBtn);
    
    card.appendChild(actions);
    recapContent.appendChild(card);
  }

  /* Create stat cell */
  function createStatCell(value, label) {
    const cell = Components.createElement('div', { className: 'recap-stat' });
    cell.appendChild(Components.createElement('div', {
      className: 'recap-stat-val',
      text: value
    }));
    cell.appendChild(Components.createElement('div', {
      className: 'recap-stat-lbl',
      text: label
    }));
    return cell;
  }

  /* Public API */
  return {
    render
  };
})();
