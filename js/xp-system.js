// ==================== SISTEMA DE XP CENTRAL ====================
// Este módulo gerencia toda a lógica de XP, níveis e pontuação

// Estrutura de dados do usuário
let userStats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
  xp: 0,
  level: 1,
  totalXp: 0,
  lastLevelUp: 0,
  xpHistory: [] // Array de {action, xp, timestamp}
}));

// ==================== CONSTANTES DE PONTUAÇÃO ====================
const XP_RULES = {
  // Tarefas
  TASK_COMPLETE: 10,
  
  // Hábitos
  HABIT_DAY_COMPLETE: 15,
  
  // Foco (Pomodoro)
  FOCUS_SESSION: 25,
  
  // Metas
  GOAL_INCREMENT: 5,
  GOAL_COMPLETE: 100,
  
  // English Library
  ENGLISH_PHRASE_ADD: 5,
  ENGLISH_PHRASE_FAVORITE: 2,
  
  // Speaking
  SPEAKING_SESSION_ADD: 20,
  
  // Roleplays
  ROLEPLAY_CREATE: 30,
  ROLEPLAY_PRACTICE: 10,
  
  // Palavras
  WORD_ADD: 3,
  
  // Checklist de Vídeos
  CHECKLIST_VIDEO_MARK: 10,
  

  
  // Bônus
  STREAK_BONUS: 50 // A cada 7 dias de streak
};

// ==================== FÓRMULA DE NÍVEL ====================
/**
 * Calcula o XP necessário para atingir um nível específico
 * Fórmula: XP_necessário = nível * 100 * 1.2
 */
function getXpForLevel(level) {
  return Math.floor(level * 100 * 1.2);
}

/**
 * Calcula o nível baseado no XP total
 */
function calculateLevel(totalXp) {
  let level = 1;
  let xpAccumulated = 0;
  
  while (xpAccumulated + getXpForLevel(level) <= totalXp) {
    xpAccumulated += getXpForLevel(level);
    level++;
  }
  
  return level;
}

/**
 * Calcula o XP necessário para o próximo nível
 */
function getXpToNextLevel(totalXp) {
  const currentLevel = calculateLevel(totalXp);
  const xpForCurrentLevel = getXpForLevel(currentLevel);
  
  let xpAccumulated = 0;
  for (let i = 1; i < currentLevel; i++) {
    xpAccumulated += getXpForLevel(i);
  }
  
  const xpInCurrentLevel = totalXp - xpAccumulated;
  return xpForCurrentLevel - xpInCurrentLevel;
}

/**
 * Calcula o XP atual dentro do nível (para barra de progresso)
 */
function getXpInCurrentLevel(totalXp) {
  const currentLevel = calculateLevel(totalXp);
  
  let xpAccumulated = 0;
  for (let i = 1; i < currentLevel; i++) {
    xpAccumulated += getXpForLevel(i);
  }
  
  return totalXp - xpAccumulated;
}

/**
 * Calcula o XP total necessário para o nível atual
 */
function getXpForCurrentLevel(totalXp) {
  const currentLevel = calculateLevel(totalXp);
  return getXpForLevel(currentLevel);
}

// ==================== FUNÇÕES DE GANHO DE XP ====================
/**
 * Adiciona XP ao usuário com validação de level up
 * @param {number} amount - Quantidade de XP a adicionar
 * @param {string} action - Ação que gerou o XP (para histórico)
 * @param {boolean} showNotification - Se deve mostrar notificação
 * @returns {object} { xpGained, leveledUp, newLevel }
 */
function addXp(amount, action = 'unknown', showNotification = true) {
  if (amount <= 0) return { xpGained: 0, leveledUp: false, newLevel: userStats.level };
  
  const previousLevel = userStats.level;
  const previousTotalXp = userStats.totalXp;
  
  // Adicionar XP
  userStats.xp += amount;
  userStats.totalXp += amount;
  
  // Registrar no histórico
  userStats.xpHistory.push({
    action: action,
    xp: amount,
    timestamp: new Date().toISOString()
  });
  
  // Limitar histórico a últimos 100 eventos
  if (userStats.xpHistory.length > 100) {
    userStats.xpHistory = userStats.xpHistory.slice(-100);
  }
  
  // Recalcular nível
  userStats.level = calculateLevel(userStats.totalXp);
  
  // Verificar level up
  const leveledUp = userStats.level > previousLevel;
  if (leveledUp) {
    userStats.lastLevelUp = new Date().toISOString();
    if (showNotification) {
      showLevelUpNotification(userStats.level);
    }
  }
  
  // Salvar dados
  saveUserStats();
  
  // Atualizar UI
  updateXpDisplay();
  
  // Notificação de XP ganho
  if (showNotification && amount > 0) {
    showXpNotification(amount, action);
  }
  
  return {
    xpGained: amount,
    leveledUp: leveledUp,
    newLevel: userStats.level,
    previousLevel: previousLevel
  };
}

/**
 * Remove XP (para ajustes ou penalidades)
 */
function removeXp(amount, action = 'penalty') {
  if (amount <= 0) return;
  
  const previousLevel = userStats.level;
  
  userStats.totalXp = Math.max(0, userStats.totalXp - amount);
  userStats.xp = Math.max(0, userStats.xp - amount);
  
  userStats.xpHistory.push({
    action: action,
    xp: -amount,
    timestamp: new Date().toISOString()
  });
  
  userStats.level = calculateLevel(userStats.totalXp);
  
  saveUserStats();
  updateXpDisplay();
  
  if (userStats.level < previousLevel) {
    showToast(`⬇️ Você caiu para o nível ${userStats.level}`);
  }
}

// ==================== PERSISTÊNCIA ====================
function saveUserStats() {
  localStorage.setItem('userStats', JSON.stringify(userStats));
}

function loadUserStats() {
  userStats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
    xp: 0,
    level: 1,
    totalXp: 0,
    lastLevelUp: 0,
    xpHistory: []
  }));
  
  // Recalcular nível em caso de inconsistência
  userStats.level = calculateLevel(userStats.totalXp);
  saveUserStats();
}

// ==================== ATUALIZAÇÃO DE UI ====================
function updateXpDisplay() {
  const totalXpEl = document.getElementById('totalXp');
  const xpDisplayEl = document.getElementById('xpDisplay');
  const levelEl = document.getElementById('levelDisplay');
  const levelBadgeEl = document.getElementById('levelBadge');
  const xpBarEl = document.getElementById('xpProgressBar');
  const xpTextEl = document.getElementById('xpProgressText');
  
  if (totalXpEl) totalXpEl.textContent = userStats.totalXp;
  if (xpDisplayEl) xpDisplayEl.textContent = userStats.totalXp;
  if (levelEl) levelEl.textContent = userStats.level;
  if (levelBadgeEl) levelBadgeEl.textContent = userStats.level;
  
  // Atualizar barra de progresso
  const xpInLevel = getXpInCurrentLevel(userStats.totalXp);
  const xpForLevel = getXpForCurrentLevel(userStats.totalXp);
  const progress = (xpInLevel / xpForLevel) * 100;
  
  if (xpBarEl) xpBarEl.style.width = progress + '%';
  if (xpTextEl) xpTextEl.textContent = `${xpInLevel} / ${xpForLevel} XP`;
}

// ==================== NOTIFICAÇÕES ====================
function showXpNotification(amount, action) {
  const actionNames = {
    'task_complete': '✅ Tarefa completa',
    'habit_day': '🔥 Hábito marcado',
    'focus_session': '⏱️ Sessão de foco',
    'goal_increment': '🎯 Meta progrediu',
    'goal_complete': '🏆 Meta completa',
    'english_phrase': '📚 Frase adicionada',
    'speaking_session': '🎤 Sessão de speaking',
    'roleplay_create': '🎭 Roleplay criado',
    'word_add': '📖 Palavra adicionada',
    'checklist_video': '📹 Vídeo marcado',

    'streak_bonus': '🔥 Bônus de streak'
  };
  
  const actionName = actionNames[action] || action;
  showToast(`✨ +${amount} XP - ${actionName}`);
}

function showLevelUpNotification(newLevel) {
  // Criar modal de level up
  const modal = document.createElement('div');
  modal.className = 'level-up-modal';
  modal.innerHTML = `
    <div class="level-up-content">
      <div class="level-up-icon">🎉</div>
      <h2>LEVEL UP!</h2>
      <p class="level-up-number">Nível ${newLevel}</p>
      <p class="level-up-message">Parabéns! Você subiu de nível!</p>
      <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Continuar</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Auto-remover após 5 segundos
  setTimeout(() => {
    if (modal.parentElement) modal.remove();
  }, 5000);
}

// ==================== FUNÇÕES AUXILIARES ====================
/**
 * Retorna as estatísticas do usuário
 */
function getUserStats() {
  return {
    ...userStats,
    xpToNextLevel: getXpToNextLevel(userStats.totalXp),
    xpInLevel: getXpInCurrentLevel(userStats.totalXp),
    xpForLevel: getXpForCurrentLevel(userStats.totalXp),
    levelProgress: (getXpInCurrentLevel(userStats.totalXp) / getXpForCurrentLevel(userStats.totalXp)) * 100
  };
}

/**
 * Reseta o sistema de XP (para testes)
 */
function resetXpSystem() {
  if (confirm('⚠️ Isso vai resetar TODO o seu XP e níveis. Tem certeza?')) {
    userStats = {
      xp: 0,
      level: 1,
      totalXp: 0,
      lastLevelUp: 0,
      xpHistory: []
    };
    saveUserStats();
    updateXpDisplay();
    showToast('🔄 Sistema de XP resetado');
  }
}

/**
 * Exporta o histórico de XP
 */
function exportXpHistory() {
  const history = userStats.xpHistory;
  const csv = 'Data,Ação,XP\n' + history.map(h => 
    `${new Date(h.timestamp).toLocaleString('pt-BR')},${h.action},${h.xp}`
  ).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `xp_history_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Tornar funções globais
window.addXp = addXp;
window.removeXp = removeXp;
window.getUserStats = getUserStats;
window.resetXpSystem = resetXpSystem;
window.exportXpHistory = exportXpHistory;
window.updateXpDisplay = updateXpDisplay;
