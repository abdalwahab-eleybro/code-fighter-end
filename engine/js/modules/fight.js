/**
 * Fight Module
 * Combat logic and damage calculation
 */

window.CF = window.CF || {};

CF.Fight = (() => {
  const S = CF.State;
  const C = CF.Campaign;
  const Q = CF.Questions;

  /* Damage calculation */
  function calculateDamage(question, tier, combo) {
    const typeMeta = Q.getTypeMeta(question.type);
    let damage = typeMeta.baseDamage;
    
    // Tier multiplier
    const tierMultipliers = { perfect: 1.5, great: 1.2, good: 1.0, slow: 0.8 };
    damage = Math.round(damage * (tierMultipliers[tier] || 1.0));
    
    // Combo multiplier
    if (combo > 1) {
      damage = Math.round(damage * (1 + (combo * 0.1)));
    }
    
    return damage;
  }

  /* Enemy attack damage */
  function calculateEnemyDamage(archetype) {
    const baseDamage = 10;
    const archetypeMultipliers = { bot: 1.0, ghost: 1.2, boss: 1.5 };
    return Math.round(baseDamage * (archetypeMultipliers[archetype] || 1.0));
  }

  /* Determine tier based on response time */
  function determineTier(elapsedMs) {
    if (elapsedMs <= 3000) return 'perfect';
    if (elapsedMs <= 6000) return 'great';
    if (elapsedMs <= 9000) return 'good';
    return 'slow';
  }

  /* Check if answer is perfect */
  function isPerfectAnswer(elapsedMs, tier) {
    return tier === 'perfect';
  }

  /* Public API */
  return {
    calculateDamage,
    calculateEnemyDamage,
    determineTier,
    isPerfectAnswer
  };
})();
