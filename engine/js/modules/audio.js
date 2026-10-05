/**
 * Audio Module
 * Sound effects and music management
 */

window.CF = window.CF || {};

CF.Audio = (() => {
  const S = CF.State;
  
  // Audio context
  let audioContext = null;
  let musicNode = null;
  let musicPlaying = false;

  /* Initialize audio */
  function init() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Audio not supported:', e);
    }
  }

  /* Play sound effect */
  function playSFX(name) {
    if (!audioContext) init();
    if (!audioContext) return;
    
    const volume = S.profile.settings.sfxVolume || 0.7;
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequency based on sound name
    switch (name) {
      case 'correct':
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.1);
        break;
      case 'wrong':
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.2);
        break;
      case 'damage':
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.1);
        break;
      case 'victory':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        break;
      case 'defeat':
        oscillator.frequency.setValueAtTime(196, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(131, audioContext.currentTime + 0.2);
        break;
      default:
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    }
    
    // Set volume
    gainNode.gain.setValueAtTime(volume * 0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
    
    // Start and stop
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  /* Play music */
  function playMusic() {
    if (!audioContext) init();
    if (!audioContext) return;
    if (musicPlaying) return;
    
    const volume = S.profile.settings.musicVolume || 0.4;
    
    // Create oscillator for simple music
    musicNode = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    musicNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set up a simple melody pattern
    const notes = [261.63, 329.63, 392.00, 440.00]; // C, E, G, A
    let noteIndex = 0;
    
    musicNode.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
    
    // Schedule note changes
    const scheduleNoteChange = (time) => {
      noteIndex = (noteIndex + 1) % notes.length;
      musicNode.frequency.setValueAtTime(notes[noteIndex], time);
      
      // Schedule next change
      const nextTime = time + 0.5;
      if (musicPlaying) {
        setTimeout(() => scheduleNoteChange(nextTime), 500);
      }
    };
    
    setTimeout(() => scheduleNoteChange(audioContext.currentTime + 0.5), 500);
    
    musicNode.start(audioContext.currentTime);
    musicPlaying = true;
  }

  /* Stop music */
  function stopMusic() {
    if (!musicNode) return;
    
    musicNode.stop(audioContext.currentTime);
    musicNode = null;
    musicPlaying = false;
  }

  /* Toggle music */
  function toggleMusic() {
    if (musicPlaying) {
      stopMusic();
    } else {
      playMusic();
    }
  }

  /* Set music volume */
  function setMusicVolume(volume) {
    S.profile.settings.musicVolume = volume;
    S.save();
    
    if (musicNode) {
      // Would need to update gain node, but for simplicity we'll restart
      stopMusic();
      if (volume > 0) playMusic();
    }
  }

  /* Set SFX volume */
  function setSFXVolume(volume) {
    S.profile.settings.sfxVolume = volume;
    S.save();
  }

  /* Public API */
  return {
    init,
    playSFX,
    playMusic,
    stopMusic,
    toggleMusic,
    setMusicVolume,
    setSFXVolume
  };
})();
