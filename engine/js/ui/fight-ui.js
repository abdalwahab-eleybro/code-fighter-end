/**
 * Fight UI Module
 * Renders and manages the fight screen
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.FightUI = (() => {
  const S = CF.State;
  const C = CF.Campaign;
  const Q = CF.Questions;
  const Components = CF.UI.Components;

  let currentLevel = null;
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let fightStartTime = 0;
  let timerInterval = null;

  /* Start a fight for a specific level */
  function startFight(levelId) {
    currentLevel = C.getLevel(levelId);
    if (!currentLevel) {
      console.error('Level not found:', levelId);
      CF.UI.Navigation.showMap();
      return;
    }

    // Reset session for this fight
    S.resetSession({
      mode: 'campaign',
      campaignLevel: levelId,
      enemyArchetype: currentLevel.enemy,
      questionsRemaining: currentLevel.questions,
      playerHP: 100 + (S.profile.upgrades.maxHP || 0) * 10,
      enemyHP: 100,
      enemyMaxHP: 100
    });

    // Get questions for this level
    currentQuestions = Q.getQuestionsForLevel(levelId);
    if (currentQuestions.length === 0) {
      console.error('No questions found for level:', levelId);
      CF.UI.Navigation.showMap();
      return;
    }

    currentQuestionIndex = 0;
    fightStartTime = Date.now();

    // Update UI
    updateFightUI();
    
    // Start timer
    startTimer();

    // Show first question
    showQuestion(currentQuestions[0]);
  }

  /* Start blitz mode */
  function startBlitz() {
    // Reset session for blitz
    S.resetSession({
      mode: 'blitz',
      questionsRemaining: 10,
      playerHP: 100 + (S.profile.upgrades.maxHP || 0) * 10,
      enemyHP: 100,
      enemyMaxHP: 100
    });

    // Get random questions
    const allQuestions = Q.getAllQuestions();
    currentQuestions = Q.shuffleArray([...allQuestions]).slice(0, 10);
    currentQuestionIndex = 0;
    fightStartTime = Date.now();

    // Update UI
    updateFightUI();
    
    // Start timer
    startTimer();

    // Show first question
    showQuestion(currentQuestions[0]);
  }

  /* Show a question */
  function showQuestion(question) {
    const questionWrap = document.getElementById('questionWrap');
    if (!questionWrap) return;
    
    // Clear previous content
    questionWrap.innerHTML = '';
    
    // Create question display
    const questionEl = Components.createQuestionDisplay(question);
    questionWrap.appendChild(questionEl);
    
    // Set up answer callback
    Components.setCurrentQuestion(question);
    Components.setAnswerCallback(handleAnswer);
    
    // Update question counter
    const counter = document.getElementById('questionCounter');
    if (counter) {
      counter.textContent = `Q${currentQuestionIndex + 1} / ${currentQuestions.length}`;
    }
    
    // Reset tier timer
    const tierTimer = document.getElementById('tierTimer');
    if (tierTimer) {
      tierTimer.textContent = '0.0s';
      tierTimer.dataset.tier = 'perfect';
    }
    
    // Clear feedback
    const feedback = document.getElementById('fightFeedback');
    if (feedback) feedback.textContent = '';
    
    // Start question timer
    S.session.questionStartTime = Date.now();
  }

  /* Handle answer selection */
  function handleAnswer(question, answerIndex) {
    const now = Date.now();
    const elapsed = now - S.session.questionStartTime;
    
    // Check if answer is correct
    const isCorrect = Q.validateAnswer(question, answerIndex);
    
    // Calculate tier based on time
    let tier = 'perfect';
    if (elapsed > 3000) tier = 'great';
    if (elapsed > 6000) tier = 'good';
    if (elapsed > 9000) tier = 'slow';
    
    // Update stats
    S.session.answered++;
    if (isCorrect) {
      S.session.correct++;
      S.session.combo++;
      S.session.maxCombo = Math.max(S.session.maxCombo, S.session.combo);
      
      // Perfect answer bonus
      if (tier === 'perfect') {
        S.session.perfectAnswers++;
      }
      
      // Calculate damage
      const typeMeta = Q.getTypeMeta(question.type);
      let damage = typeMeta.baseDamage;
      
      // Tier multiplier
      const tierMultipliers = { perfect: 1.5, great: 1.2, good: 1.0, slow: 0.8 };
      damage = Math.round(damage * (tierMultipliers[tier] || 1.0));
      
      // Combo multiplier
      if (S.session.combo > 1) {
        damage = Math.round(damage * (1 + (S.session.combo * 0.1)));
      }
      
      // Apply damage to enemy
      S.session.enemyHP = Math.max(0, S.session.enemyHP - damage);
      
      // Show feedback
      const feedback = document.getElementById('fightFeedback');
      if (feedback) {
        feedback.textContent = 'Correct! +' + damage + ' damage';
        feedback.className = 'fight-feedback correct';
      }
      
      // Play animation
      playAttackAnimation('player', damage, tier);
      
      // Check if enemy is defeated
      if (S.session.enemyHP <= 0) {
        // Enemy defeated - player wins
        setTimeout(() => {
          endFight(true);
        }, 1000);
        return;
      }
    } else {
      // Wrong answer - player takes damage
      S.session.combo = 0;
      
      // Calculate damage to player
      let damage = 10; // Base damage for wrong answer
      
      // Enemy archetype multiplier
      const archetypeMultipliers = { bot: 1.0, ghost: 1.2, boss: 1.5 };
      damage = Math.round(damage * (archetypeMultipliers[S.session.enemyArchetype] || 1.0));
      
      // Apply damage to player
      S.session.playerHP = Math.max(0, S.session.playerHP - damage);
      
      // Show feedback
      const feedback = document.getElementById('fightFeedback');
      if (feedback) {
        feedback.textContent = 'Wrong! -' + damage + ' HP';
        feedback.className = 'fight-feedback wrong';
      }
      
      // Play animation
      playAttackAnimation('enemy', damage, tier);
      
      // Check if player is defeated
      if (S.session.playerHP <= 0) {
        // Player defeated
        setTimeout(() => {
          endFight(false);
        }, 1000);
        return;
      }
    }
    
    // Move to next question
    currentQuestionIndex++;
    S.session.questionsRemaining--;
    
    // Update UI
    updateFightUI();
    
    // Check if all questions answered
    if (currentQuestionIndex >= currentQuestions.length || S.session.questionsRemaining <= 0) {
      // Check who won
      const playerWon = S.session.enemyHP <= 0;
      setTimeout(() => {
        endFight(playerWon);
      }, 1000);
      return;
    }
    
    // Show next question
    setTimeout(() => {
      showQuestion(currentQuestions[currentQuestionIndex]);
    }, 500);
  }

  /* End the fight */
  function endFight(playerWon) {
    // Stop timer
    stopTimer();
    
    // Calculate elapsed time
    const elapsedMs = Date.now() - fightStartTime;
    
    if (S.session.mode === 'campaign' && currentLevel) {
      // Complete campaign level
      const result = C.completeFight(currentLevel.id, playerWon, S.session, elapsedMs);
      
      // Show recap
      S.session.fightResult = {
        won: playerWon,
        level: currentLevel,
        elapsedMs,
        ...result
      };
      
      CF.UI.Navigation.showRecap();
    } else if (S.session.mode === 'blitz') {
      // Blitz mode - show recap
      S.session.fightResult = {
        won: playerWon,
        elapsedMs,
        mode: 'blitz'
      };
      
      CF.UI.Navigation.showRecap();
    }
  }

  /* Update fight UI */
  function updateFightUI() {
    // Update health bars
    const playerHealth = document.getElementById('fightPlayerHealth');
    const enemyHealth = document.getElementById('fightEnemyHealth');
    
    if (playerHealth) {
      const percent = (S.session.playerHP / (100 + (S.profile.upgrades.maxHP || 0) * 10)) * 100;
      playerHealth.style.width = `${percent}%`;
    }
    
    if (enemyHealth) {
      const percent = (S.session.enemyHP / S.session.enemyMaxHP) * 100;
      enemyHealth.style.width = `${percent}%`;
    }
    
    // Update enemy name
    const enemyName = document.getElementById('fightEnemyName');
    if (enemyName) {
      const archetype = CF.Fighters.getArchetype(S.session.enemyArchetype);
      enemyName.textContent = archetype.icon + ' ' + archetype.name;
    }
    
    // Update boss banner
    updateBossBanner();
  }

  /* Update boss banner */
  function updateBossBanner() {
    const banner = document.getElementById('bossBanner');
    if (!banner) return;
    
    if (currentLevel && currentLevel.tier === 'boss') {
      banner.style.display = 'block';
      banner.textContent = `BOSS FIGHT: ${currentLevel.name}`;
    } else {
      banner.style.display = 'none';
    }
  }

  /* Start timer */
  function startTimer() {
    stopTimer();
    
    const timerEl = document.getElementById('fightTimer');
    if (!timerEl) return;
    
    let startTime = Date.now();
    
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const seconds = Math.floor(elapsed / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      timerEl.textContent = `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
    }, 100);
  }

  /* Stop timer */
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  /* Play attack animation */
  function playAttackAnimation(attacker, damage, tier) {
    const arena = document.getElementById('fightArena');
    const player = document.getElementById('fightPlayer');
    const enemy = document.getElementById('fightEnemy');
    
    if (!arena || !player || !enemy) return;
    
    // Shake arena
    arena.classList.add('shake');
    arena.style.setProperty('--shake-int', '15px');
    
    // Damage popup
    const popup = document.createElement('div');
    popup.className = `damage-popup tier-${tier}`;
    popup.textContent = damage;
    
    if (attacker === 'player') {
      // Position near enemy
      popup.style.left = '70%';
      popup.style.top = '40%';
      arena.appendChild(popup);
      
      // Player attack animation
      player.classList.add('lunge');
      
      // Enemy hit animation
      enemy.classList.add('hit');
      
      setTimeout(() => {
        player.classList.remove('lunge');
        enemy.classList.remove('hit');
      }, 850);
    } else {
      // Position near player
      popup.style.left = '30%';
      popup.style.top = '40%';
      arena.appendChild(popup);
      
      // Enemy attack animation
      enemy.classList.add('attacking');
      
      // Player hit animation
      player.classList.add('hit');
      
      setTimeout(() => {
        enemy.classList.remove('attacking');
        player.classList.remove('hit');
      }, 500);
    }
    
    // Remove popup after animation
    setTimeout(() => {
      popup.remove();
    }, 1300);
    
    // Remove shake after animation
    setTimeout(() => {
      arena.classList.remove('shake');
    }, 400);
  }

  /* Setup hint button */
  function setupHintButton() {
    const hintBtn = document.getElementById('fightHint');
    if (hintBtn) {
      hintBtn.onclick = () => {
        // Use hint - cost 5 HP
        if (S.session.playerHP > 5) {
          S.session.playerHP -= 5;
          S.session.hintsUsed++;
          updateFightUI();
          
          // Show hint
          const feedback = document.getElementById('fightFeedback');
          if (feedback) {
            feedback.textContent = 'Hint used! -5 HP';
            feedback.className = 'fight-feedback hint';
          }
        }
      };
    }
  }

  /* Setup skip button */
  function setupSkipButton() {
    const skipBtn = document.getElementById('fightSkip');
    if (skipBtn) {
      skipBtn.onclick = () => {
        // Skip question - cost 10 HP
        if (S.session.playerHP > 10) {
          S.session.playerHP -= 10;
          S.session.questionsRemaining--;
          S.session.combo = 0;
          updateFightUI();
          
          // Show next question
          currentQuestionIndex++;
          if (currentQuestionIndex < currentQuestions.length) {
            showQuestion(currentQuestions[currentQuestionIndex]);
          } else {
            // Out of questions
            endFight(false);
          }
          
          // Show feedback
          const feedback = document.getElementById('fightFeedback');
          if (feedback) {
            feedback.textContent = 'Skipped! -10 HP';
            feedback.className = 'fight-feedback info';
          }
        }
      };
    }
  }

  /* Setup exit button */
  function setupExitButton() {
    const exitBtn = document.getElementById('fightExit');
    if (exitBtn) {
      exitBtn.onclick = () => {
        // Confirm exit
        if (confirm('Are you sure you want to exit the fight?')) {
          stopTimer();
          CF.UI.Navigation.showMap();
        }
      };
    }
  }

  /* Initialize fight UI */
  function init() {
    setupHintButton();
    setupSkipButton();
    setupExitButton();
  }

  /* Public API */
  return {
    init,
    startFight,
    startBlitz,
    showQuestion,
    handleAnswer,
    endFight,
    updateFightUI,
    updateBossBanner,
    playAttackAnimation
  };
})();
