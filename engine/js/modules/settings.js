/**
 * Settings Module
 * Settings management
 */

window.CF = window.CF || {};

CF.Settings = (() => {
  const S = CF.State;

  /* Get setting value */
  function getSetting(key) {
    return S.profile.settings[key];
  }

  /* Set setting value */
  function setSetting(key, value) {
    S.profile.settings[key] = value;
    S.save();
  }

  /* Reset settings to defaults */
  function resetSettings() {
    S.profile.settings = {
      musicVolume: 0.4,
      sfxVolume: 0.7
    };
    S.save();
  }

  /* Get all settings */
  function getAllSettings() {
    return { ...S.profile.settings };
  }

  /* Public API */
  return {
    getSetting,
    setSetting,
    resetSettings,
    getAllSettings
  };
})();
