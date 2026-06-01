// ==================== DATA STORES ====================
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// Pre-saved habits for language learning (DEFINIR ANTES DE USAR!)
const defaultHabits = [
  { name: "🎤 Speaking diário", history: Array(7).fill(false), streak: 0 },
  { name: "👂 Listening", history: Array(7).fill(false), streak: 0 },
  { name: "🎭 Roleplay", history: Array(7).fill(false), streak: 0 },
  { name: "🔄 Repetição", history: Array(7).fill(false), streak: 0 },
  { name: "🌊 Imersão", history: Array(7).fill(false), streak: 0 },
  { name: "📅 Exposição diária", history: Array(7).fill(false), streak: 0 },
  { name: "✍️ Escrever em inglês", history: Array(7).fill(false), streak: 0 },
  { name: "📱 Usar celular em inglês", history: Array(7).fill(false), streak: 0 },
  { name: "🎮 Jogar totalmente em inglês", history: Array(7).fill(false), streak: 0 },
  { name: "🌎 Conversar com estrangeiro", history: Array(7).fill(false), streak: 0 },
  { name: "📖 Aprender 5 frases reais", history: Array(7).fill(false), streak: 0 },
  { name: "📹 Gravar vídeo em inglês", history: Array(7).fill(false), streak: 0 },
  { name: "🧠 Pensar em inglês durante o dia", history: Array(7).fill(false), streak: 0 },
  { name: "🪞 Fazer shadowing", history: Array(7).fill(false), streak: 0 }
];

let habits = JSON.parse(localStorage.getItem('habits') || '[]');
// If no habits exist, initialize with default habits
if (habits.length === 0) {
  habits = defaultHabits;
  localStorage.setItem('habits', JSON.stringify(habits));
}
let goals = JSON.parse(localStorage.getItem('goals') || '[]');
// Pre-saved goals for language learning
const defaultGoals = [
  { name: "🎯 Completar 100 frases em inglês", deadline: getFutureDate(30), target: 100, progress: 0 },
  { name: "📚 Assistir 50 vídeos do checklist", deadline: getFutureDate(60), target: 50, progress: 0 },
  { name: "🎤 Fazer 30 sessões de speaking", deadline: getFutureDate(45), target: 30, progress: 0 },
  { name: "📖 Aprender 200 novas palavras", deadline: getFutureDate(90), target: 200, progress: 0 },
  { name: "🎭 Completar 10 roleplays diferentes", deadline: getFutureDate(60), target: 10, progress: 0 },
  { name: "🌎 Conversar com 20 estrangeiros", deadline: getFutureDate(90), target: 20, progress: 0 },
  { name: "📹 Gravar 15 vídeos em inglês", deadline: getFutureDate(60), target: 15, progress: 0 },
  { name: "🎧 Escutar 100 horas de inglês", deadline: getFutureDate(120), target: 100, progress: 0 },
  { name: "✍️ Escrever 30 textos em inglês", deadline: getFutureDate(60), target: 30, progress: 0 },
  { name: "🏆 Manter streak por 30 dias", deadline: getFutureDate(30), target: 30, progress: 0 }
];



function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Inicializar metas com dados padrão se estiver vazio
if (goals.length === 0) {
  goals = defaultGoals;
  localStorage.setItem('goals', JSON.stringify(goals));
}
let focusData = JSON.parse(localStorage.getItem('focusData') || '{"today":0,"sessions":0,"total":0}');
let checklistItems = JSON.parse(localStorage.getItem('checklistItems') || '[]');
let checklistTotal = parseInt(localStorage.getItem('checklistTotal') || '250');
let checklistNotes = localStorage.getItem('checklistNotes') || '';
let phrases = JSON.parse(localStorage.getItem('phrases') || '[]');
let roleplays = JSON.parse(localStorage.getItem('roleplays') || JSON.stringify({living:[], want:[], will:[]}));
let words = JSON.parse(localStorage.getItem('words') || '[]');
let dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
let dailyNotes = localStorage.getItem('dailyNotes') || '';
let speakingSessions = JSON.parse(localStorage.getItem('speakingSessions') || '[]');
let streak = parseInt(localStorage.getItem('streak') || '0');
let lastDate = localStorage.getItem('lastDate') || '';

// Referências
let references = JSON.parse(localStorage.getItem('references') || JSON.stringify({
  youtube: [{name:"MemeSack", link:"#"},{name:"IShowSpeed", link:"#"},{name:"Kai Cenat", link:"#"}],
  sites: [{name:"Educaplay", link:"https://www.educaplay.com/"},{name:"Babadum", link:"https://babadum.com/"},{name:"TED Talks", link:"https://www.ted.com/"},{name:"Language Guide", link:"https://www.languageguide.org/"},{name:"TV Garden", link:"https://tv.garden/"}],
  music: [{name:"4vd - Feel It"},{name:"PARTYOF2 - poser"},{name:"Khantrast - Landed In Brooklyn"},{name:"Baby Keem, Kendrick Lamar"},{name:"NF - When I Grow Up"},{name:"Jace June - Come Home"},{name:"NEMZZZ - NEMZZZ Type Beat"},{name:"Lil Tecca - Love Me"}],
  movie: [{name:"Anne with E"},{name:"Steve Universe"},{name:"Todos os filmes do Spider-Man"}],
  book: [{name:"all about love - bell hooks"}]
}));

// Energy Tracker
let energyData = JSON.parse(localStorage.getItem('energyData') || JSON.stringify({
  high: ["Ver vídeos no YouTube com legenda em inglês, traduzir e anotar palavras","Estudar meus vídeos salvos","Fazer vídeos em inglês","Roleplay sobre conversas comuns, emprego e rotina","Assistir TV Garden"],
  medium: ["Ouvir áudios, vídeos ou Radio Garden","Escutar vídeos em segundo plano","Jogar em inglês","Assistir filmes e séries (Anne with E, Steve Universe, Spider-Man)"],
  low: ["Ler no Quora em inglês","Escutar Radio Garden","Ouvir músicas (4vd, PARTYOF2, NF, Lil Tecca, NEMZZZ)"]
}));

let showOnlyChecked = false;
let timerInterval = null;
let timerSeconds = 25 * 60;
let timerActive = false;
let timerMode = 'focus';
let currentRefType = '';

function showToast(msg) { const t = document.getElementById('toast'); if(t){ t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500); } }
function saveAll() { 
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('speakingSessions', JSON.stringify(speakingSessions));
  localStorage.setItem('goals', JSON.stringify(goals));
  localStorage.setItem('focusData', JSON.stringify(focusData));
  localStorage.setItem('phrases', JSON.stringify(phrases));
  localStorage.setItem('roleplays', JSON.stringify(roleplays));
  localStorage.setItem('words', JSON.stringify(words));
  localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
  localStorage.setItem('dailyNotes', dailyNotes);
  localStorage.setItem('references', JSON.stringify(references));
  localStorage.setItem('energyData', JSON.stringify(energyData));
  updateDashboard();
}
function closeModal(id) { const el = document.getElementById(id); if(el) el.classList.remove('open'); }

// ==================== DASHBOARD ====================
function updateDashboard() {
  let tasksDone = tasks.filter(t => t.completed).length;
  const tasksDoneEl = document.getElementById('tasksDone');
  const tasksTotalEl = document.getElementById('tasksTotal');
  if(tasksDoneEl) tasksDoneEl.textContent = tasksDone;
  if(tasksTotalEl) tasksTotalEl.textContent = tasks.length;
  let pct = tasks.length ? Math.round((tasksDone/tasks.length)*100) : 0;
  const dayPctEl = document.getElementById('dayPct');
  const dayBarEl = document.getElementById('dayBar');
  if(dayPctEl) dayPctEl.textContent = pct + '%';
  if(dayBarEl) dayBarEl.style.width = pct + '%';
  const focusTodayEl = document.getElementById('focusToday');
  const focusTodayBigEl = document.getElementById('focusTodayBig');
  if(focusTodayEl) focusTodayEl.textContent = focusData.today + 'min';
  if(focusTodayBigEl) focusTodayBigEl.textContent = focusData.today + 'min';
  const focusSessionsEl = document.getElementById('focusSessions');
  if(focusSessionsEl) focusSessionsEl.textContent = focusData.sessions;
  let habitsToday = habits.filter(h => h.history && h.history[new Date().getDay()]).length;
  const habitsDoneEl = document.getElementById('habitsDone');
  const habitsTotalEl = document.getElementById('habitsTotal');
  if(habitsDoneEl) habitsDoneEl.textContent = habitsToday;
  if(habitsTotalEl) habitsTotalEl.textContent = habits.length;
  // XP agora é gerenciado pelo sistema de XP centralizado
  if (typeof updateXpDisplay === 'function') {
    updateXpDisplay();
  }
  const globalStreakEl = document.getElementById('globalStreak');
  const streakDaysEl = document.getElementById('streakDays');
  if(globalStreakEl) globalStreakEl.textContent = streak;
  if(streakDaysEl) streakDaysEl.textContent = streak;
}

function renderTasks() {
  const container = document.getElementById('taskList');
  if(!container) return;
  container.innerHTML = tasks.map((t, i) => `<li><input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${i})"><span class="task-text ${t.completed ? 'completed' : ''}">${escapeHtml(t.text)}</span><button class="delete-item" onclick="deleteTask(${i})">🗑</button></li>`).join('');
  updateDashboard();
}
function toggleTask(i) { 
  tasks[i].completed = !tasks[i].completed; 
  if (tasks[i].completed) {
    addXp(XP_RULES.TASK_COMPLETE, 'task_complete', true);
  }
  saveAll(); 
  renderTasks(); 
}
function deleteTask(i) { tasks.splice(i,1); saveAll(); renderTasks(); }
const taskForm = document.getElementById('taskForm');
if(taskForm) taskForm.addEventListener('submit', (e) => { e.preventDefault(); const input = document.getElementById('taskInput'); if(input && input.value.trim()){ tasks.push({text:input.value.trim(), completed:false}); saveAll(); renderTasks(); input.value=''; } });

// ==================== HÁBITOS ====================
function renderHabits() {
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
  const todayIdx = new Date().getDay();
  const container = document.getElementById('habitsGrid');
  if(!container) return;
  container.innerHTML = habits.map((h, i) => `<div class="habit-card"><div class="habit-header"><span class="habit-name">${escapeHtml(h.name)}</span><span class="habit-streak">🔥 ${h.streak||0}</span><button class="btn-small btn-danger" onclick="deleteHabit(${i})">Excluir</button></div><div class="habit-week">${days.map((d,idx)=>`<div class="habit-day ${h.history && h.history[idx] ? 'completed' : ''} ${idx===todayIdx ? 'today' : ''}" onclick="toggleHabitDay(${i},${idx})">${d.substring(0,1)}</div>`).join('')}</div></div>`).join('');
  updateDashboard();
}
function toggleHabitDay(habitIdx, dayIdx) { 
  if(!habits[habitIdx].history) habits[habitIdx].history = Array(7).fill(false); 
  const wasCompleted = habits[habitIdx].history[dayIdx];
  habits[habitIdx].history[dayIdx] = !habits[habitIdx].history[dayIdx]; 
  habits[habitIdx].streak = habits[habitIdx].history.filter(Boolean).length; 
  
  if (!wasCompleted && habits[habitIdx].history[dayIdx]) {
    addXp(XP_RULES.HABIT_DAY_COMPLETE, 'habit_day', true);
  }
  
  saveAll(); 
  renderHabits(); 
}
function deleteHabit(i) { habits.splice(i,1); saveAll(); renderHabits(); }
const habitForm = document.getElementById('habitForm');
if(habitForm) habitForm.addEventListener('submit', (e) => { e.preventDefault(); const input = document.getElementById('habitName'); if(input && input.value.trim()){ habits.push({name:input.value.trim(), history:Array(7).fill(false), streak:0}); saveAll(); renderHabits(); input.value=''; } });

// ==================== METAS ====================
function renderGoals() {
  const container = document.getElementById('goalsList');
  if(!container) return;
  container.innerHTML = goals.map((g, i) => `<div class="goal-item"><div class="goal-header"><span class="goal-name">${escapeHtml(g.name)}</span><span class="goal-deadline">📅 ${g.deadline}</span><button class="btn-small btn-danger" onclick="deleteGoal(${i})">Excluir</button></div><div class="goal-progress"><span>Progresso: ${g.progress || 0}/${g.target}</span><div class="course-progress-bar" style="margin-top:6px"><div class="course-progress-fill" style="width:${((g.progress||0)/g.target)*100}%"></div></div><button class="btn-small" onclick="incrementGoal(${i})">+1</button></div></div>`).join('');
}
function incrementGoal(i) { 
  goals[i].progress = (goals[i].progress || 0) + 1; 
  if(goals[i].progress > goals[i].target) goals[i].progress = goals[i].target; 
  
  // Adicionar XP
  if (goals[i].progress === goals[i].target) {
    addXp(XP_RULES.GOAL_COMPLETE, 'goal_complete', true);
  } else {
    addXp(XP_RULES.GOAL_INCREMENT, 'goal_increment', true);
  }
  
  saveAll(); 
  renderGoals(); 
}
function deleteGoal(i) { goals.splice(i,1); saveAll(); renderGoals(); }
const goalForm = document.getElementById('goalForm');
if(goalForm) goalForm.addEventListener('submit', (e) => { e.preventDefault(); const name = document.getElementById('goalName'); const deadline = document.getElementById('goalDeadline'); const target = document.getElementById('goalTarget'); if(name && deadline && target && name.value.trim() && deadline.value && target.value){ goals.push({name:name.value.trim(), deadline:deadline.value, target:parseInt(target.value), progress:0}); saveAll(); renderGoals(); name.value = ''; deadline.value = ''; target.value = ''; } });


// ==================== ROLEPLAYS COMPLETO ====================
// Estrutura completa de Roleplays com diálogos, perguntas, respostas e frases úteis

// Carregar roleplays do localStorage (estrutura completa)
let fullRoleplays = JSON.parse(localStorage.getItem('fullRoleplays') || JSON.stringify({
  living: [],
  want: [],
  will: []
}));

// Roleplays padrão para demonstração
const DEFAULT_ROLEPLAYS = {
  living: [
    {
      id: "living_1",
      title: "No Supermercado",
      description: "Comprando alimentos e interagindo com atendentes",
      emoji: "🛒",
      dialogues: [
        { en: "Excuse me, where can I find the milk?", pt: "Com licença, onde posso encontrar o leite?" },
        { en: "It's on aisle 3, next to the eggs.", pt: "Está no corredor 3, ao lado dos ovos." },
        { en: "Thank you so much!", pt: "Muito obrigado!" },
        { en: "Do you have this in a different size?", pt: "Você tem isso em um tamanho diferente?" }
      ],
      questions: [
        { en: "How much is this?", pt: "Quanto custa isto?" },
        { en: "Do you accept credit card?", pt: "Aceita cartão de crédito?" },
        { en: "Where is the nearest restroom?", pt: "Onde fica o banheiro mais próximo?" }
      ],
      answers: [
        { en: "It's ten dollars.", pt: "São dez dólares." },
        { en: "Yes, we do.", pt: "Sim, aceitamos." },
        { en: "It's at the back of the store.", pt: "Fica no fundo da loja." }
      ],
      useful: [
        { en: "I'm just looking, thanks.", pt: "Só estou olhando, obrigado." },
        { en: "Can I get a discount?", pt: "Posso ter um desconto?" },
        { en: "I'll take it.", pt: "Vou levar." }
      ]
    },
    {
      id: "living_2",
      title: "No Restaurante",
      description: "Pedindo comida em um restaurante",
      emoji: "🍽️",
      dialogues: [
        { en: "I'd like a table for two, please.", pt: "Gostaria de uma mesa para dois, por favor." },
        { en: "Right this way, sir.", pt: "Por aqui, senhor." },
        { en: "What's the special today?", pt: "Qual é o prato especial de hoje?" },
        { en: "I'll have the grilled chicken.", pt: "Vou querer o frango grelhado." }
      ],
      questions: [
        { en: "Is the water free?", pt: "A água é grátis?" },
        { en: "Do you have vegetarian options?", pt: "Vocês têm opções vegetarianas?" },
        { en: "Can I see the dessert menu?", pt: "Posso ver o cardápio de sobremesas?" }
      ],
      answers: [
        { en: "Yes, tap water is free.", pt: "Sim, água da torneira é grátis." },
        { en: "Yes, we have a vegetarian menu.", pt: "Sim, temos um menu vegetariano." },
        { en: "Here you go.", pt: "Aqui está." }
      ],
      useful: [
        { en: "I'm allergic to nuts.", pt: "Tenho alergia a castanhas." },
        { en: "Can I have the bill, please?", pt: "Posso ter a conta, por favor?" },
        { en: "The food was delicious!", pt: "A comida estava deliciosa!" }
      ]
    }
  ],
  want: [
    {
      id: "want_1",
      title: "Viajando para o Exterior",
      description: "Situações em uma viagem internacional",
      emoji: "✈️",
      dialogues: [
        { en: "I'd like to check in for my flight.", pt: "Gostaria de fazer check-in para meu voo." },
        { en: "Can I see your passport, please?", pt: "Posso ver seu passaporte, por favor?" },
        { en: "Here you go.", pt: "Aqui está." },
        { en: "Do you have any luggage to check?", pt: "Tem alguma bagagem para despachar?" }
      ],
      questions: [
        { en: "Where is the baggage claim?", pt: "Onde fica a retirada de bagagem?" },
        { en: "How do I get to the city center?", pt: "Como faço para chegar ao centro da cidade?" },
        { en: "What time does my flight board?", pt: "Que horas meu voo embarca?" }
      ],
      answers: [
        { en: "Follow the signs to baggage claim.", pt: "Siga as placas para retirada de bagagem." },
        { en: "You can take the subway or a taxi.", pt: "Você pode pegar o metrô ou um táxi." },
        { en: "Your flight boards at gate 12.", pt: "Seu voo embarca no portão 12." }
      ],
      useful: [
        { en: "Is there free Wi-Fi here?", pt: "Tem Wi-Fi grátis aqui?" },
        { en: "Where is the duty-free shop?", pt: "Onde fica a loja duty-free?" },
        { en: "I need help with my bags.", pt: "Preciso de ajuda com minhas malas." }
      ]
    },
    {
      id: "want_2",
      title: "Fazendo Amigos Novos",
      description: "Conhecendo pessoas em eventos ou lugares novos",
      emoji: "🤝",
      dialogues: [
        { en: "Hi, I'm Kaiky. Nice to meet you!", pt: "Oi, sou Kaiky. Prazer em conhecer você!" },
        { en: "I'm Sarah. Are you here alone?", pt: "Sou Sarah. Você veio sozinho?" },
        { en: "Yeah, I'm new in town. What do you recommend?", pt: "Sim, sou novo na cidade. O que você recomenda?" }
      ],
      questions: [
        { en: "Where are you from?", pt: "De onde você é?" },
        { en: "What do you do for fun around here?", pt: "O que você faz por diversão por aqui?" },
        { en: "Do you come here often?", pt: "Você vem aqui com frequência?" }
      ],
      answers: [
        { en: "I'm from Brazil.", pt: "Sou do Brasil." },
        { en: "There's a great park nearby.", pt: "Tem um parque ótimo perto." },
        { en: "This is my first time here.", pt: "É minha primeira vez aqui." }
      ],
      useful: [
        { en: "Let's exchange numbers!", pt: "Vamos trocar números!" },
        { en: "Do you have Instagram?", pt: "Você tem Instagram?" },
        { en: "It was great talking to you!", pt: "Foi ótimo conversar com você!" }
      ]
    }
  ],
  will: [
    {
      id: "will_1",
      title: "Entrevista de Emprego",
      description: "Conseguindo o emprego dos sonhos em tecnologia",
      emoji: "💼",
      dialogues: [
        { en: "Tell me about yourself.", pt: "Fale sobre você." },
        { en: "I'm a software engineering student passionate about coding.", pt: "Sou estudante de engenharia de software apaixonado por programação." },
        { en: "Why do you want to work here?", pt: "Por que você quer trabalhar aqui?" },
        { en: "I admire your company's mission and culture.", pt: "Admiro a missão e a cultura da sua empresa." }
      ],
      questions: [
        { en: "What are the benefits?", pt: "Quais são os benefícios?" },
        { en: "When would I start?", pt: "Quando eu começaria?" },
        { en: "Is there room for growth?", pt: "Há espaço para crescimento?" }
      ],
      answers: [
        { en: "We offer health insurance and vacation days.", pt: "Oferecemos plano de saúde e dias de férias." },
        { en: "You can start next Monday.", pt: "Você pode começar na próxima segunda." },
        { en: "Yes, we promote internally.", pt: "Sim, promovemos internamente." }
      ],
      useful: [
        { en: "Thank you for this opportunity.", pt: "Obrigado por esta oportunidade." },
        { en: "When can I expect to hear back?", pt: "Quando posso esperar uma resposta?" },
        { en: "I'm very excited about this role.", pt: "Estou muito animado com esta vaga." }
      ]
    },
    {
      id: "will_2",
      title: "Apresentando um Projeto",
      description: "Apresentando seu projeto para colegas ou chefes",
      emoji: "📊",
      dialogues: [
        { en: "Good morning everyone, thank you for coming.", pt: "Bom dia a todos, obrigado por virem." },
        { en: "Today I'll present my latest project.", pt: "Hoje vou apresentar meu projeto mais recente." },
        { en: "Let me walk you through the main features.", pt: "Deixe-me explicar as principais funcionalidades." }
      ],
      questions: [
        { en: "How long did it take to build?", pt: "Quanto tempo levou para construir?" },
        { en: "What technologies did you use?", pt: "Quais tecnologias você usou?" },
        { en: "Can you show us a demo?", pt: "Pode nos mostrar uma demonstração?" }
      ],
      answers: [
        { en: "It took about three months.", pt: "Levou cerca de três meses." },
        { en: "I used React and Node.js.", pt: "Usei React e Node.js." },
        { en: "Yes, absolutely. Let me show you.", pt: "Sim, com certeza. Deixe-me mostrar." }
      ],
      useful: [
        { en: "Does anyone have any questions?", pt: "Alguém tem alguma pergunta?" },
        { en: "I appreciate your feedback.", pt: "Agradeço seu feedback." },
        { en: "I'll work on those improvements.", pt: "Vou trabalhar nessas melhorias." }
      ]
    }
  ]
};

// Inicializar roleplays com dados padrão se estiver vazio
function initFullRoleplays() {
  const stored = localStorage.getItem('fullRoleplays');
  if (!stored || JSON.parse(stored).living.length === 0) {
    fullRoleplays = JSON.parse(JSON.stringify(DEFAULT_ROLEPLAYS));
    localStorage.setItem('fullRoleplays', JSON.stringify(fullRoleplays));
  } else {
    fullRoleplays = JSON.parse(stored);
  }
}

function saveFullRoleplays() {
  localStorage.setItem('fullRoleplays', JSON.stringify(fullRoleplays));
}

let currentViewRoleplay = null;
let currentEditRoleplay = null;
let currentEditArea = null;

// Variáveis para edição dinâmica
let editDialogues = [];
let editQuestions = [];
let editAnswers = [];
let editUseful = [];

// Renderizar roleplays na interface
function renderFullRoleplays() {
  renderRoleplayArea('living');
  renderRoleplayArea('want');
  renderRoleplayArea('will');
}

function renderRoleplayArea(area) {
  const container = document.getElementById(`rp-${area}`);
  if (!container) return;
  
  const items = fullRoleplays[area] || [];
  
  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted)">✨ Nenhum roleplay ainda.<br><button class="btn-small" onclick="openCreateRoleplayModal('${area}')" style="margin-top:12px">➕ Criar primeiro roleplay</button></div>`;
    return;
  }
  
  container.innerHTML = items.map(rp => `
    <div class="roleplay-card" onclick="openViewRoleplayModal('${area}', '${rp.id}')">
      <div class="roleplay-title">
        <span>${rp.emoji || '🎭'}</span>
      </div>
      <div style="font-weight:600; margin-bottom:6px;">${escapeHtml(rp.title)}</div>
      <div class="roleplay-desc">${escapeHtml(rp.description.substring(0, 60))}${rp.description.length > 60 ? '...' : ''}</div>
      <div style="display:flex; gap:12px; margin-top:8px; font-size:0.7rem; color:var(--text-muted)">
        <span>💬 ${rp.dialogues?.length || 0}</span>
        <span>❓ ${rp.questions?.length || 0}</span>
        <span>💡 ${rp.answers?.length || 0}</span>
        <span>🔧 ${rp.useful?.length || 0}</span>
      </div>
      <button class="btn-small btn-danger" onclick="event.stopPropagation(); deleteRoleplayItem('${area}', '${rp.id}')" style="margin-top:8px">🗑 Excluir</button>
    </div>
  `).join('');
}

// Abrir modal de visualização
function openViewRoleplayModal(area, id) {
  const rp = fullRoleplays[area].find(r => r.id === id);
  if (!rp) return;
  
  currentViewRoleplay = { area, id, data: rp };
  
  let html = `<p style="margin-bottom:20px; color:var(--text-muted);">📌 ${escapeHtml(rp.description)}</p>`;
  
  // Diálogos
  if (rp.dialogues && rp.dialogues.length > 0) {
    html += `<div style="font-weight:700; margin:16px 0 8px; color:var(--primary);">💬 DIÁLOGOS</div>`;
    rp.dialogues.forEach((d, idx) => {
      html += `
        <div style="background:var(--surface-secondary); border-radius:12px; padding:12px; margin-bottom:10px;">
          <div style="font-weight:600;">🔊 ${escapeHtml(d.en)}</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">🇧🇷 ${escapeHtml(d.pt)}</div>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="btn-small" onclick="speakRoleplayText('${escapeHtml(d.en).replace(/'/g, "\\'")}')">🔊 Ouvir</button>
          </div>
        </div>`;
    });
  }
  
  // Perguntas
  if (rp.questions && rp.questions.length > 0) {
    html += `<div style="font-weight:700; margin:16px 0 8px; color:var(--orange);">❓ PERGUNTAS POSSÍVEIS</div>`;
    rp.questions.forEach((q, idx) => {
      html += `
        <div style="background:var(--orange-soft); border-radius:12px; padding:12px; margin-bottom:8px;">
          <div>🔊 ${escapeHtml(q.en)}</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">🇧🇷 ${escapeHtml(q.pt)}</div>
        </div>`;
    });
  }
  
  // Respostas
  if (rp.answers && rp.answers.length > 0) {
    html += `<div style="font-weight:700; margin:16px 0 8px; color:var(--green);">💡 RESPOSTAS POSSÍVEIS</div>`;
    rp.answers.forEach((a, idx) => {
      html += `
        <div style="background:var(--green-soft); border-radius:12px; padding:12px; margin-bottom:8px;">
          <div>🔊 ${escapeHtml(a.en)}</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">🇧🇷 ${escapeHtml(a.pt)}</div>
        </div>`;
    });
  }
  
  // Frases Úteis
  if (rp.useful && rp.useful.length > 0) {
    html += `<div style="font-weight:700; margin:16px 0 8px; color:var(--purple);">🔧 FRASES ÚTEIS</div>
    <div style="display:flex; flex-wrap:wrap; gap:8px;">`;
    rp.useful.forEach((u, idx) => {
      html += `<button class="btn-small" style="background:var(--purple-soft); color:var(--purple);" onclick="speakRoleplayText('${escapeHtml(u.en).replace(/'/g, "\\'")}')">${escapeHtml(u.en)}</button>`;
    });
    html += `</div>`;
  }
  
  // Modal de visualização (criar se não existir)
  let viewModal = document.getElementById('viewRoleplayModal');
  if (!viewModal) {
    viewModal = document.createElement('div');
    viewModal.id = 'viewRoleplayModal';
    viewModal.className = 'modal-overlay';
    viewModal.innerHTML = `
      <div class="modal" style="max-width:700px">
        <div class="modal-header">
          <h3><span id="viewRoleplayEmoji">🎭</span> <span id="viewRoleplayTitle"></span></h3>
          <button class="icon-btn" onclick="closeViewRoleplayModal()">✕</button>
        </div>
        <div class="modal-body" id="viewRoleplayBody" style="max-height:60vh; overflow-y:auto;"></div>
        <div class="modal-footer">
          <button class="btn" onclick="closeViewRoleplayModal()">Fechar</button>
          <button class="btn btn-primary" onclick="editFromViewRoleplay()">✏️ Editar</button>
          <button class="btn btn-danger" onclick="deleteFromViewRoleplay()">🗑 Excluir</button>
        </div>
      </div>
    `;
    document.body.appendChild(viewModal);
  }
  
  document.getElementById('viewRoleplayTitle').innerHTML = `${rp.emoji || '🎭'} ${escapeHtml(rp.title)}`;
  document.getElementById('viewRoleplayBody').innerHTML = html;
  viewModal.classList.add('open');
}

function closeViewRoleplayModal() {
  const modal = document.getElementById('viewRoleplayModal');
  if (modal) modal.classList.remove('open');
  currentViewRoleplay = null;
}

function editFromViewRoleplay() {
  if (currentViewRoleplay) {
    const { area, id } = currentViewRoleplay;
    closeViewRoleplayModal();
    openEditRoleplayModal(area, id);
  }
}

function deleteFromViewRoleplay() {
  if (currentViewRoleplay) {
    const { area, id } = currentViewRoleplay;
    deleteRoleplayItem(area, id);
    closeViewRoleplayModal();
  }
}

function deleteRoleplayItem(area, id) {
  if (confirm('Tem certeza que deseja excluir este roleplay?')) {
    fullRoleplays[area] = fullRoleplays[area].filter(r => r.id !== id);
    saveFullRoleplays();
    renderFullRoleplays();
    showToast('🗑️ Roleplay excluído!');
  }
}

function speakRoleplayText(text) {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    showToast(`🔊 Speaking: ${text.substring(0, 40)}...`);
  }
}

// Abrir modal de criação/edição
function openCreateRoleplayModal(area) {
  currentEditArea = area;
  currentEditRoleplay = null;
  editDialogues = [{ en: '', pt: '' }];
  editQuestions = [];
  editAnswers = [];
  editUseful = [];
  
  showRoleplayEditModal('Criar Roleplay', area);
}

function openEditRoleplayModal(area, id) {
  const rp = fullRoleplays[area].find(r => r.id === id);
  if (!rp) return;
  
  currentEditArea = area;
  currentEditRoleplay = id;
  editDialogues = rp.dialogues || [{ en: '', pt: '' }];
  editQuestions = rp.questions || [];
  editAnswers = rp.answers || [];
  editUseful = rp.useful || [];
  
  showRoleplayEditModal('Editar Roleplay', area, rp);
}

function showRoleplayEditModal(title, area, existingData = null) {
  let editModal = document.getElementById('editRoleplayModal');
  
  if (!editModal) {
    editModal = document.createElement('div');
    editModal.id = 'editRoleplayModal';
    editModal.className = 'modal-overlay';
    editModal.innerHTML = `
      <div class="modal" style="max-width:750px; max-height:85vh; display:flex; flex-direction:column;">
        <div class="modal-header">
          <h3 id="editRoleplayModalTitle">📝 Criar Roleplay</h3>
          <button class="icon-btn" onclick="closeEditRoleplayModal()">✕</button>
        </div>
        <div class="modal-body" style="flex:1; overflow-y:auto;">
          <div class="form-group">
            <label>📌 Título</label>
            <input type="text" id="rpTitle" placeholder="Ex: No Aeroporto">
          </div>
          <div class="form-group">
            <label>📝 Descrição</label>
            <textarea id="rpDescription" rows="2" placeholder="Descreva a situação..."></textarea>
          </div>
          <div class="form-group">
            <label>🎭 Emoji</label>
            <input type="text" id="rpEmoji" placeholder="🎭" maxlength="2" value="🎭">
          </div>
          
          <div style="font-weight:700; margin:16px 0 8px; color:var(--primary);">💬 DIÁLOGOS</div>
          <div id="editDialoguesList"></div>
          <button class="btn-small" onclick="addEditDialogue()" style="margin-bottom:16px;">➕ Adicionar diálogo</button>
          
          <div style="font-weight:700; margin:16px 0 8px; color:var(--orange);">❓ PERGUNTAS POSSÍVEIS</div>
          <div id="editQuestionsList"></div>
          <button class="btn-small" onclick="addEditQuestion()" style="margin-bottom:16px;">➕ Adicionar pergunta</button>
          
          <div style="font-weight:700; margin:16px 0 8px; color:var(--green);">💡 RESPOSTAS POSSÍVEIS</div>
          <div id="editAnswersList"></div>
          <button class="btn-small" onclick="addEditAnswer()" style="margin-bottom:16px;">➕ Adicionar resposta</button>
          
          <div style="font-weight:700; margin:16px 0 8px; color:var(--purple);">🔧 FRASES ÚTEIS</div>
          <div id="editUsefulList"></div>
          <button class="btn-small" onclick="addEditUseful()" style="margin-bottom:16px;">➕ Adicionar frase útil</button>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="closeEditRoleplayModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveRoleplayItem()">💾 Salvar</button>
        </div>
      </div>
    `;
    document.body.appendChild(editModal);
  }
  
  document.getElementById('editRoleplayModalTitle').innerHTML = title === 'Criar Roleplay' ? '📝 Criar Roleplay' : '✏️ Editar Roleplay';
  document.getElementById('rpTitle').value = existingData?.title || '';
  document.getElementById('rpDescription').value = existingData?.description || '';
  document.getElementById('rpEmoji').value = existingData?.emoji || '🎭';
  
  renderEditDynamicFields();
  editModal.classList.add('open');
}

function renderEditDynamicFields() {
  // Diálogos
  const dialoguesContainer = document.getElementById('editDialoguesList');
  if (dialoguesContainer) {
    dialoguesContainer.innerHTML = editDialogues.map((d, idx) => `
      <div class="dynamic-item" style="display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
        <input type="text" placeholder="🇺🇸 Inglês" value="${escapeHtml(d.en)}" style="flex:2;" onchange="updateEditDialogue(${idx}, 'en', this.value)">
        <input type="text" placeholder="🇧🇷 Português" value="${escapeHtml(d.pt)}" style="flex:2;" onchange="updateEditDialogue(${idx}, 'pt', this.value)">
        <button class="remove-item" onclick="removeEditDialogue(${idx})" style="width:36px;">✕</button>
      </div>
    `).join('');
  }
  
  // Perguntas
  const questionsContainer = document.getElementById('editQuestionsList');
  if (questionsContainer) {
    questionsContainer.innerHTML = editQuestions.map((q, idx) => `
      <div class="dynamic-item" style="display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
        <input type="text" placeholder="🇺🇸 Pergunta em Inglês" value="${escapeHtml(q.en)}" style="flex:2;" onchange="updateEditQuestion(${idx}, 'en', this.value)">
        <input type="text" placeholder="🇧🇷 Pergunta em Português" value="${escapeHtml(q.pt)}" style="flex:2;" onchange="updateEditQuestion(${idx}, 'pt', this.value)">
        <button class="remove-item" onclick="removeEditQuestion(${idx})" style="width:36px;">✕</button>
      </div>
    `).join('');
  }
  
  // Respostas
  const answersContainer = document.getElementById('editAnswersList');
  if (answersContainer) {
    answersContainer.innerHTML = editAnswers.map((a, idx) => `
      <div class="dynamic-item" style="display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
        <input type="text" placeholder="🇺🇸 Resposta em Inglês" value="${escapeHtml(a.en)}" style="flex:2;" onchange="updateEditAnswer(${idx}, 'en', this.value)">
        <input type="text" placeholder="🇧🇷 Resposta em Português" value="${escapeHtml(a.pt)}" style="flex:2;" onchange="updateEditAnswer(${idx}, 'pt', this.value)">
        <button class="remove-item" onclick="removeEditAnswer(${idx})" style="width:36px;">✕</button>
      </div>
    `).join('');
  }
  
  // Frases Úteis
  const usefulContainer = document.getElementById('editUsefulList');
  if (usefulContainer) {
    usefulContainer.innerHTML = editUseful.map((u, idx) => `
      <div class="dynamic-item" style="display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
        <input type="text" placeholder="🇺🇸 Frase em Inglês" value="${escapeHtml(u.en)}" style="flex:2;" onchange="updateEditUseful(${idx}, 'en', this.value)">
        <input type="text" placeholder="🇧🇷 Tradução" value="${escapeHtml(u.pt)}" style="flex:2;" onchange="updateEditUseful(${idx}, 'pt', this.value)">
        <button class="remove-item" onclick="removeEditUseful(${idx})" style="width:36px;">✕</button>
      </div>
    `).join('');
  }
}

// Funções de atualização
function updateEditDialogue(idx, field, value) {
  if (editDialogues[idx]) editDialogues[idx][field] = value;
}
function addEditDialogue() { editDialogues.push({ en: '', pt: '' }); renderEditDynamicFields(); }
function removeEditDialogue(idx) { editDialogues.splice(idx, 1); renderEditDynamicFields(); }

function updateEditQuestion(idx, field, value) {
  if (editQuestions[idx]) editQuestions[idx][field] = value;
}
function addEditQuestion() { editQuestions.push({ en: '', pt: '' }); renderEditDynamicFields(); }
function removeEditQuestion(idx) { editQuestions.splice(idx, 1); renderEditDynamicFields(); }

function updateEditAnswer(idx, field, value) {
  if (editAnswers[idx]) editAnswers[idx][field] = value;
}
function addEditAnswer() { editAnswers.push({ en: '', pt: '' }); renderEditDynamicFields(); }
function removeEditAnswer(idx) { editAnswers.splice(idx, 1); renderEditDynamicFields(); }

function updateEditUseful(idx, field, value) {
  if (editUseful[idx]) editUseful[idx][field] = value;
}
function addEditUseful() { editUseful.push({ en: '', pt: '' }); renderEditDynamicFields(); }
function removeEditUseful(idx) { editUseful.splice(idx, 1); renderEditDynamicFields(); }

function closeEditRoleplayModal() {
  const modal = document.getElementById('editRoleplayModal');
  if (modal) modal.classList.remove('open');
  currentEditRoleplay = null;
  currentEditArea = null;
}

function saveRoleplayItem() {
  const title = document.getElementById('rpTitle').value.trim();
  const description = document.getElementById('rpDescription').value.trim();
  const emoji = document.getElementById('rpEmoji').value.trim() || '🎭';
  
  if (!title) {
    showToast('⚠️ Título obrigatório');
    return;
  }
  
  const dialogues = editDialogues.filter(d => d.en.trim() && d.pt.trim());
  if (dialogues.length === 0) {
    showToast('⚠️ Adicione pelo menos um diálogo');
    return;
  }
  
  const questions = editQuestions.filter(q => q.en.trim() && q.pt.trim());
  const answers = editAnswers.filter(a => a.en.trim() && a.pt.trim());
  const useful = editUseful.filter(u => u.en.trim() && u.pt.trim());
  
  const roleplayData = {
    id: currentEditRoleplay || `${currentEditArea}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title,
    description: description || 'Sem descrição',
    emoji,
    dialogues,
    questions,
    answers,
    useful
  };
  
  if (currentEditRoleplay) {
    const index = fullRoleplays[currentEditArea].findIndex(r => r.id === currentEditRoleplay);
    if (index !== -1) {
      fullRoleplays[currentEditArea][index] = roleplayData;
    }
  } else {
    fullRoleplays[currentEditArea].push(roleplayData);
    addXp(XP_RULES.ROLEPLAY_CREATE, 'roleplay_create', true);
  }
  
  saveFullRoleplays();
  renderFullRoleplays();
  closeEditRoleplayModal();
  showToast(currentEditRoleplay ? '✅ Roleplay atualizado!' : '✅ Roleplay criado!');
}

// Exportar/Importar roleplays
function exportFullRoleplays() {
  const data = JSON.stringify(fullRoleplays, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'roleplays_complete.json';
  a.click();
  showToast('📦 Roleplays exportados!');
}

function importFullRoleplays(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const json = JSON.parse(ev.target.result);
      if (json.living || json.want || json.will) {
        fullRoleplays = json;
        saveFullRoleplays();
        renderFullRoleplays();
        showToast('✅ Roleplays importados!');
      } else {
        showToast('Arquivo inválido');
      }
    } catch(e) {
      showToast('Erro ao importar');
    }
  };
  reader.readAsText(file);
}

function resetFullRoleplays() {
  if (confirm('⚠️ Isso vai apagar TODOS os seus roleplays e restaurar os exemplos. Continuar?')) {
    fullRoleplays = JSON.parse(JSON.stringify(DEFAULT_ROLEPLAYS));
    saveFullRoleplays();
    renderFullRoleplays();
    showToast('🔄 Roleplays resetados para os exemplos!');
  }
}

// Tornar funções globais
window.renderFullRoleplays = renderFullRoleplays;
window.openViewRoleplayModal = openViewRoleplayModal;
window.closeViewRoleplayModal = closeViewRoleplayModal;
window.editFromViewRoleplay = editFromViewRoleplay;
window.deleteFromViewRoleplay = deleteFromViewRoleplay;
window.deleteRoleplayItem = deleteRoleplayItem;
window.speakRoleplayText = speakRoleplayText;
window.openCreateRoleplayModal = openCreateRoleplayModal;
window.openEditRoleplayModal = openEditRoleplayModal;
window.closeEditRoleplayModal = closeEditRoleplayModal;
window.saveRoleplayItem = saveRoleplayItem;
window.updateEditDialogue = updateEditDialogue;
window.addEditDialogue = addEditDialogue;
window.removeEditDialogue = removeEditDialogue;
window.updateEditQuestion = updateEditQuestion;
window.addEditQuestion = addEditQuestion;
window.removeEditQuestion = removeEditQuestion;
window.updateEditAnswer = updateEditAnswer;
window.addEditAnswer = addEditAnswer;
window.removeEditAnswer = removeEditAnswer;
window.updateEditUseful = updateEditUseful;
window.addEditUseful = addEditUseful;
window.removeEditUseful = removeEditUseful;
window.exportFullRoleplays = exportFullRoleplays;
window.importFullRoleplays = importFullRoleplays;
window.resetFullRoleplays = resetFullRoleplays;

// Inicializar roleplays
initFullRoleplays();


// ==================== FOCO ====================
function updateTimerDisplay() { let mins = Math.floor(timerSeconds/60); let secs = timerSeconds%60; const timerDisplay = document.getElementById('timerDisplay'); if(timerDisplay) timerDisplay.textContent = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`; let circumference = 565.48; let offset = circumference - (timerSeconds/(timerMode==='focus'?1500:300))*circumference; const ringFg = document.getElementById('ringFg'); if(ringFg) ringFg.style.strokeDashoffset = offset; }
function startTimer() { if(timerInterval) clearInterval(timerInterval); timerActive=true; timerInterval = setInterval(()=>{ if(timerSeconds<=0){ clearInterval(timerInterval); timerActive=false; showToast('⏰ Tempo finalizado!'); focusData.sessions++; focusData.today += timerMode==='focus'?25:5; if(timerMode==='focus') { addXp(XP_RULES.FOCUS_SESSION, 'focus_session', true); } saveAll(); updateDashboard(); } else { timerSeconds--; updateTimerDisplay(); } },1000); }
function pauseTimer() { if(timerInterval){ clearInterval(timerInterval); timerInterval=null; timerActive=false; } }
function resetTimer() { pauseTimer(); timerSeconds = timerMode==='focus'?25*60:5*60; updateTimerDisplay(); }
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');
if(startTimerBtn) startTimerBtn.addEventListener('click', startTimer);
if(pauseTimerBtn) pauseTimerBtn.addEventListener('click', pauseTimer);
if(resetTimerBtn) resetTimerBtn.addEventListener('click', resetTimer);

// ==================== CHECKLIST ====================
function renderChecklist() {
  const search = document.getElementById('checklistSearch')?.value.toLowerCase() || '';
  const container = document.getElementById('checklistGrid');
  if(!container) return;
  let html = '';
  for(let i=1; i<=checklistTotal; i++) {
    let isChecked = checklistItems.includes(i);
    if(showOnlyChecked && !isChecked) continue;
    if(search && !i.toString().includes(search)) continue;
    html += `<div class="check-item ${isChecked ? 'checked' : ''}"><input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleChecklistItem(${i})"><label>${i}</label></div>`;
  }
  container.innerHTML = html;
  let checked = checklistItems.length;
  const checklistChecked = document.getElementById('checklistChecked');
  const checklistRemaining = document.getElementById('checklistRemaining');
  const checklistPercent = document.getElementById('checklistPercent');
  const checklistProgress = document.getElementById('checklistProgress');
  if(checklistChecked) checklistChecked.textContent = checked;
  if(checklistRemaining) checklistRemaining.textContent = checklistTotal - checked;
  let pct = Math.round((checked/checklistTotal)*100);
  if(checklistPercent) checklistPercent.textContent = pct+'%';
  if(checklistProgress) checklistProgress.style.width = pct+'%';
}
function toggleChecklistItem(num) { 
  if(checklistItems.includes(num)) {
    checklistItems = checklistItems.filter(n=>n!==num);
  } else {
    checklistItems.push(num);
    addXp(XP_RULES.CHECKLIST_VIDEO_MARK, 'checklist_video', true);
  }
  localStorage.setItem('checklistItems', JSON.stringify(checklistItems)); 
  renderChecklist(); 
}
const checkAllBtn = document.getElementById('checkAllBtn');
const uncheckAllBtn = document.getElementById('uncheckAllBtn');
const showCheckedBtn = document.getElementById('showCheckedBtn');
const checklistSearch = document.getElementById('checklistSearch');
if(checkAllBtn) checkAllBtn.addEventListener('click', () => { checklistItems = Array.from({length:checklistTotal},(_,i)=>i+1); localStorage.setItem('checklistItems', JSON.stringify(checklistItems)); renderChecklist(); });
if(uncheckAllBtn) uncheckAllBtn.addEventListener('click', () => { checklistItems = []; localStorage.setItem('checklistItems', JSON.stringify(checklistItems)); renderChecklist(); });
if(showCheckedBtn) showCheckedBtn.addEventListener('click', () => { showOnlyChecked = !showOnlyChecked; if(showCheckedBtn) showCheckedBtn.textContent = showOnlyChecked ? 'Mostrar Todos' : 'Marcados'; renderChecklist(); });
if(checklistSearch) checklistSearch.addEventListener('input', renderChecklist);
const checklistNotesEl = document.getElementById('checklistNotes');
if(checklistNotesEl) {
  checklistNotesEl.value = checklistNotes;
  checklistNotesEl.addEventListener('input', (e) => { localStorage.setItem('checklistNotes', e.target.value); });
}

// ==================== FRASES (Simples) ====================
function renderPhrases() {
  const container = document.getElementById('phrasesList');
  if(!container) return;
  container.innerHTML = phrases.map((p, i) => `
    <div class="phrase-item">
      <div><strong>🔊 ${escapeHtml(p.en)}</strong></div>
      <div style="color:var(--text-muted);margin-top:4px">🇧🇷 ${escapeHtml(p.pt)}</div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <button class="btn-small" onclick="speakPhrase('${escapeHtml(p.en).replace(/'/g, "\\'")}')">🔊 Ouvir</button>
        <button class="btn-small btn-danger" onclick="deletePhrase(${i})">Excluir</button>
      </div>
    </div>
  `).join('');
}
function speakPhrase(text) { let u = new SpeechSynthesisUtterance(text); u.lang='en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u); }
function deletePhrase(i) { phrases.splice(i,1); saveAll(); renderPhrases(); }
const addPhraseBtn = document.getElementById('addPhraseBtn');
if(addPhraseBtn) addPhraseBtn.addEventListener('click', () => { document.getElementById('phraseModal').classList.add('open'); });
function savePhrase() {
  let en = document.getElementById('newPhraseEn').value.trim();
  let pt = document.getElementById('newPhrasePt').value.trim();
  if(en && pt) { phrases.push({en, pt}); saveAll(); renderPhrases(); closeModal('phraseModal'); document.getElementById('newPhraseEn').value = ''; document.getElementById('newPhrasePt').value = ''; showToast('Frase salva!'); }
}

// ==================== ROLEPLAYS (SUBSTITUIR A FUNÇÃO EXISTENTE) ====================
function renderRoleplays() {
  let areas = {living:'🌱 VIVO', want:'⭐ QUERO', will:'🚀 VOU'};
  let container = document.getElementById('roleplayAreas');
  if(!container) return;
  
  container.innerHTML = Object.keys(areas).map(area => `
    <div class="roleplay-area">
      <div class="area-header ${area}">
        <h3>${areas[area]}</h3>
        <div style="display:flex; gap:8px; margin-top:8px; justify-content:center;">
          <button class="btn-small" onclick="openCreateRoleplayModal('${area}')" style="background:var(--green);">➕ Novo</button>
          <button class="btn-small" onclick="exportFullRoleplays()" style="background:var(--purple);">📤 Exportar</button>
          <button class="btn-small" onclick="document.getElementById('importRoleplayFile').click()" style="background:var(--orange);">📥 Importar</button>
          <input type="file" id="importRoleplayFile" accept=".json" style="display:none" onchange="importFullRoleplays(this.files[0])">
        </div>
      </div>
      <div class="roleplay-list" id="rp-${area}"></div>
    </div>
  `).join('');
  
  renderFullRoleplays();
}
function addRoleplay(area) {
  let title = prompt('Título do roleplay:');
  if(title) {
    let description = prompt('Descrição (opcional):');
    roleplays[area].push({id:Date.now(), title, description: description || '', dialogues:[]});
    saveAll(); renderRoleplays(); showToast('Roleplay adicionado!');
  }
}
function deleteRoleplay(area, idx) { roleplays[area].splice(idx,1); saveAll(); renderRoleplays(); showToast('Roleplay excluído!'); }
function viewRoleplay(area, idx) { let rp = roleplays[area][idx]; alert(`${rp.title}\n\n${rp.description}\n\n(Edição completa em desenvolvimento)`); }

// ==================== PALAVRAS ====================
// ==================== PALAVRAS COM ÁUDIO ====================
function renderWords() {
  const container = document.getElementById('wordsList');
  if(!container) return;
  
  if (words.length === 0) {
    container.innerHTML = `<div class="empty-state" style="text-align:center; padding:40px;">
      <p>✨ Nenhuma palavra adicionada ainda</p>
      <p style="font-size:0.8rem; margin-top:8px;">Adicione palavras abaixo para praticar!</p>
    </div>`;
    return;
  }
  
  container.innerHTML = words.map((w, i) => `
    <div class="word-card">
      <div class="word-en">
        📖 ${escapeHtml(w.en)} → ${escapeHtml(w.pt)}
      </div>
      ${w.example ? `<div class="word-example">📝 "${escapeHtml(w.example)}"</div>` : ''}
      <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
        <button class="btn-small" onclick="speakWord('${escapeHtml(w.en).replace(/'/g, "\\'")}')">🔊 Ouvir palavra</button>
        ${w.example ? `<button class="btn-small" onclick="speakWord('${escapeHtml(w.example).replace(/'/g, "\\'")}')">🔊 Ouvir exemplo</button>` : ''}
        <button class="btn-small btn-danger" onclick="deleteWord(${i})">🗑 Excluir</button>
      </div>
    </div>
  `).join('');
}

function speakWord(text) {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    showToast(`🔊 Speaking: ${text.substring(0, 40)}...`);
  }
}
function deleteWord(i) { words.splice(i,1); saveAll(); renderWords(); }
const wordForm = document.getElementById('wordForm');
if(wordForm) wordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let en = document.getElementById('wordEn').value.trim();
  let pt = document.getElementById('wordPt').value.trim();
  let example = document.getElementById('wordExample').value.trim();
  if(en && pt) { 
    words.push({en, pt, example}); 
    addXp(XP_RULES.WORD_ADD, 'word_add', true);
    saveAll(); 
    renderWords(); 
    document.getElementById('wordEn').value = ''; 
    document.getElementById('wordPt').value = ''; 
    document.getElementById('wordExample').value = ''; 
    showToast('Palavra adicionada!'); 
  }
});

// ==================== REFERÊNCIAS ====================
function renderReferences() {
  const types = ['youtube', 'sites', 'music', 'movie', 'book'];
  types.forEach(type => {
    const container = document.getElementById(`${type}List`);
    if(container) {
      container.innerHTML = references[type].map((item, i) => `
        <div class="reference-item">
          <span>${escapeHtml(item.name)}</span>
          <div style="display:flex;gap:8px">
            ${item.link && item.link !== '#' ? `<a href="${item.link}" target="_blank" class="reference-link">🔗 Acessar</a>` : ''}
            <button class="btn-small btn-danger" onclick="deleteReference('${type}',${i})">Excluir</button>
          </div>
        </div>
      `).join('');
    }
  });
}
function addReference(type) { currentRefType = type; const modalTitle = document.getElementById('refModalTitle'); if(modalTitle) modalTitle.innerHTML = `➕ Adicionar ${type}`; document.getElementById('referenceModal').classList.add('open'); }
function saveReference() {
  let name = document.getElementById('refName').value.trim();
  let link = document.getElementById('refLink').value.trim();
  if(name) { references[currentRefType].push({name, link: link || '#'}); saveAll(); renderReferences(); closeModal('referenceModal'); document.getElementById('refName').value = ''; document.getElementById('refLink').value = ''; showToast('Adicionado!'); }
}
function deleteReference(type, idx) { references[type].splice(idx,1); saveAll(); renderReferences(); showToast('Removido!'); }

// ==================== ENERGY TRACKER ====================
function renderEnergyTracker() {
  const highList = document.getElementById('highEnergyList');
  const mediumList = document.getElementById('mediumEnergyList');
  const lowList = document.getElementById('lowEnergyList');
  if(highList) highList.innerHTML = energyData.high.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  if(mediumList) mediumList.innerHTML = energyData.medium.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  if(lowList) lowList.innerHTML = energyData.low.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}
function editEnergyTracker() {
  document.getElementById('editHighEnergy').value = energyData.high.join('\n');
  document.getElementById('editMediumEnergy').value = energyData.medium.join('\n');
  document.getElementById('editLowEnergy').value = energyData.low.join('\n');
  document.getElementById('energyModal').classList.add('open');
}
function saveEnergyTracker() {
  energyData.high = document.getElementById('editHighEnergy').value.split('\n').filter(l => l.trim());
  energyData.medium = document.getElementById('editMediumEnergy').value.split('\n').filter(l => l.trim());
  energyData.low = document.getElementById('editLowEnergy').value.split('\n').filter(l => l.trim());
  saveAll(); renderEnergyTracker(); closeModal('energyModal'); showToast('Energy Tracker atualizado!');
}

// ==================== SPEAKING TRACKER ====================
function addSpeakingSession(event) {
  if (event) event.preventDefault();
  
  const typeSelect = document.getElementById('speakingType');
  const durationInput = document.getElementById('speakingDuration');
  const levelSelect = document.getElementById('speakingLevel');
  const notesInput = document.getElementById('speakingNotes');
  
  const type = typeSelect?.value;
  const duration = parseInt(durationInput?.value);
  const level = levelSelect?.value;
  const notes = notesInput?.value || '';
  
  if (!type || !duration || !level) {
    showToast('⚠️ Preencha Tipo, Minutos e Dificuldade!');
    return;
  }
  
  if (isNaN(duration) || duration <= 0) {
    showToast('⚠️ Minutos deve ser um número positivo!');
    return;
  }
  
  const newSession = {
    id: Date.now(),
    date: new Date().toISOString(),
    type: type,
    duration: duration,
    level: level,
    notes: notes
  };
  
  speakingSessions.push(newSession);
  addXp(XP_RULES.SPEAKING_SESSION_ADD, 'speaking_session', true);
  saveAll();
  renderSpeaking();
  
  if (typeSelect) typeSelect.value = '';
  if (durationInput) durationInput.value = '';
  if (levelSelect) levelSelect.value = '';
  if (notesInput) notesInput.value = '';
  
  showToast(`✅ Sessão de ${duration}min adicionada!`);
}

function renderSpeaking() {
  const statsContainer = document.getElementById('speakingStats');
  const listContainer = document.getElementById('speakingList');

  if (!statsContainer || !listContainer) return;

  const today = new Date().toDateString();

  const todaySessions = speakingSessions.filter(
    s => new Date(s.date).toDateString() === today
  );

  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const totalMinutes = speakingSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalCalls = speakingSessions.length;

  const streakDays = [...new Set(
    speakingSessions.map(s => new Date(s.date).toDateString())
  )].length;

  statsContainer.innerHTML = `
    <div class="stat-card">
      <p>Speaking Hoje</p>
      <h3>🎤 ${todayMinutes}min</h3>
    </div>
    <div class="stat-card">
      <p>Horas Totais</p>
      <h3>🧠 ${(totalMinutes / 60).toFixed(1)}h</h3>
    </div>
    <div class="stat-card">
      <p>Sessões</p>
      <h3>🌍 ${totalCalls}</h3>
    </div>
    <div class="stat-card">
      <p>Dias Falando</p>
      <h3>🔥 ${streakDays}</h3>
    </div>
  `;

  if (speakingSessions.length === 0) {
    listContainer.innerHTML = `<div class="panel" style="padding:20px;text-align:center">Nenhuma sessão registrada ainda.</div>`;
    return;
  }

  const sortedSessions = [...speakingSessions].reverse();
  
  listContainer.innerHTML = `
    <div class="panel">
      <div class="panel-header"><h3>📋 Histórico de Sessões</h3></div>
      <div style="padding: 16px; max-height: 400px; overflow-y: auto;">
        ${sortedSessions.map((s, i) => `
          <div class="speaking-session-item" style="background: var(--surface-secondary); border-radius: 12px; padding: 12px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
              <strong>🎙️ ${escapeHtml(s.type)}</strong>
              <span style="margin-left: 8px; color: var(--text-muted); font-size: 0.8rem;">📅 ${new Date(s.date).toLocaleDateString('pt-BR')}</span>
              <div style="font-size: 0.8rem; margin-top: 4px;">⏱️ ${s.duration}min • 🎚️ ${s.level}${s.notes ? ` • 📝 ${escapeHtml(s.notes)}` : ''}</div>
            </div>
            <button class="btn-small btn-danger" onclick="deleteSpeakingSession(${speakingSessions.length - 1 - i})">🗑 Excluir</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function deleteSpeakingSession(index) {
  if (confirm('Tem certeza que deseja excluir esta sessão?')) {
    speakingSessions.splice(index, 1);
    saveAll();
    renderSpeaking();
    showToast('Sessão excluída!');
  }
}

// ==================== ATIVIDADES DIÁRIAS ====================
function renderDailyActivities() {
  const container = document.getElementById('dailyActivitiesList');
  if(!container) return;
  const defaultActivities = [
    "📹 Assistir 30 minutos dos vídeos em inglês filtrando e guardando conteúdo (Sam antes do trabalho)",
    "📚 Estudar meus vídeos",
    "💬 Conversar com pessoas em inglês",
    "🎧 Escutar vídeos ou Radio Garden indo para o trabalho e em tempo livre",
    "🎭 Roleplay"
  ];
  if(dailyTasks.length === 0) dailyTasks = defaultActivities.map(() => false);
  if(dailyTasks.length < defaultActivities.length) {
    while(dailyTasks.length < defaultActivities.length) dailyTasks.push(false);
  }
  container.innerHTML = defaultActivities.map((act, i) => `
    <div class="daily-activity">
      <input type="checkbox" id="dailyAct${i}" ${dailyTasks[i] ? 'checked' : ''} onchange="toggleDailyActivity(${i})">
      <label for="dailyAct${i}">${escapeHtml(act)}</label>
    </div>
  `).join('');
  const dailyNotesEl = document.getElementById('dailyNotes');
  if(dailyNotesEl) dailyNotesEl.value = dailyNotes;
}
function toggleDailyActivity(i) { 
  const wasCompleted = dailyTasks[i];
  dailyTasks[i] = !dailyTasks[i]; 
  if (!wasCompleted && dailyTasks[i]) {
    addXp(XP_RULES.DAILY_TASK_COMPLETE, 'daily_task', true);
  }
  saveAll(); 
  updateDashboard(); 
}
const dailyNotesInput = document.getElementById('dailyNotes');
if(dailyNotesInput) dailyNotesInput.addEventListener('input', (e) => { dailyNotes = e.target.value; localStorage.setItem('dailyNotes', dailyNotes); });

// ==================== STREAK ====================
function updateStreak() {
  let today = new Date().toDateString();
  if(lastDate !== today) {
    let yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if(lastDate === yesterday.toDateString()) streak++;
    else if(lastDate !== today) streak = 1;
    lastDate = today;
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastDate', lastDate);
  }
}

// ==================== ENGLISH LIBRARY COMPLETE ====================
let categories = [];
let englishPhrases = [];
let englishNextId = 1000;
let openEnglishSections = new Set();
let openEnglishSubcats = new Set();
let currentEnglishSearch = "";
let currentViewMode = "grid";
let currentFilter = "all";
let favorites = JSON.parse(localStorage.getItem('englishFavorites') || '[]');
let dailyPhraseId = localStorage.getItem('dailyPhraseId') || null;

const DEFAULT_ENGLISH_CATEGORIES = [
  { id: "personal", name: "Personal", emoji: "👤", subcats: [
    { id: "about_me", name: "About Me", emoji: "👤" },
    { id: "about_me_trends", name: "Trends", emoji: "📈" },
    { id: "about_love", name: "About Love", emoji: "💘" },
    { id: "about_family", name: "About Family", emoji: "👨‍👩‍👧" },
    { id: "about_routine", name: "About Routine", emoji: "⏰" },
    { id: "lengths_speaking", name: "Lengths for Speaking", emoji: "🗣️" }
  ] },
  { id: "school", name: "School", emoji: "🎓", subcats: [
    { id: "college_ads", name: "College & Ads", emoji: "🎓" }
  ] },
  { id: "work", name: "Work", emoji: "💼", subcats: [
    { id: "oxygen", name: "Oxygen", emoji: "💊" },
    { id: "voluntary", name: "Voluntary", emoji: "🤝" }
  ] },
  { id: "routine", name: "Rotina", emoji: "⏰", subcats: [
    { id: "morning", name: "Manhã", emoji: "🌅" },
    { id: "afternoon", name: "Tarde", emoji: "☀️" },
    { id: "evening_night", name: "Noite", emoji: "🌙" }
  ] }
];

const DEFAULT_ENGLISH_PHRASES = [
  // PERSONAL - ABOUT ME
  { en: "I study Software Engineering in college.", pt: "Eu estudo engenharia de software na faculdade.", cat: "personal", subcat: "about_me" },
  { en: "Are you naked? For God's sake, I'm already tired of seeing dicks today.", pt: "Você está nu? Pelo amor de Deus, já estou cansado de ver pênis hoje.", cat: "personal", subcat: "lengths_speaking" },
  { en: "Man, why are you naked?", pt: "Por que você está pelado?", cat: "personal", subcat: "lengths_speaking" },
  { en: "In Brazil, my name is Kaiky, but abroad people call me Kaike, Kaique, Kike.", pt: "No Brasil, meu nome é Kaiky, mas fora me chamam de Kaike, Kaique, Kike.", cat: "personal", subcat: "about_me" },
  { en: "If I make mistakes, please correct me.", pt: "Se eu errar me corrija.", cat: "personal", subcat: "about_me" },
  { en: "I am scared.", pt: "Estou com medo.", cat: "personal", subcat: "about_me" },
  { en: "prove it to me", pt: "prove para mim", cat: "personal", subcat: "about_me" },
  { en: "Prove it to me—I'll believe it when I see it.", pt: "Prove para mim — só acredito vendo.", cat: "personal", subcat: "about_me" },
  { en: "I'm in a relationship.", pt: "Estou em um relacionamento.", cat: "personal", subcat: "about_love" },
  { en: "I'm dating a 45-year-old woman.", pt: "Estou namorando uma mulher de 45 anos.", cat: "personal", subcat: "about_love" },
  { en: "She was my teacher back then.", pt: "Ela era minha professora naquela época.", cat: "personal", subcat: "about_love" },
  { en: "We've been together for almost five years.", pt: "Estamos juntos há quase cinco anos.", cat: "personal", subcat: "about_love" },
  { en: "I'm not an atheist, but I don't follow any religion.", pt: "Eu não sou ateu, mas não sigo religião.", cat: "personal", subcat: "about_me" },
  { en: "How did you get there?", pt: "Como você chegou aí?", cat: "personal", subcat: "about_me" },
  { en: "Where were you born?", pt: "Onde você nasceu?", cat: "personal", subcat: "about_me" },
  { en: "What is your country like?", pt: "Como é o seu país?", cat: "personal", subcat: "about_me" },
  { en: "Are you hitting on me? I already have a girlfriend.", pt: "Você está dando em cima de mim? Eu já tenho namorada.", cat: "personal", subcat: "about_love" },
  { en: "What brings you here?", pt: "O que te traz aqui?", cat: "personal", subcat: "about_me" },

  // TRENDS
  { en: "beats me", pt: "sei lá", cat: "personal", subcat: "about_me_trends" },
  { en: "messi is the shit", pt: "messi é o melhor", cat: "personal", subcat: "about_me_trends" },
  { en: "go crazy", pt: "manda ver / fique à vontade", cat: "personal", subcat: "about_me_trends" },
  { en: "believe it or not!", pt: "acredite se quiser!", cat: "personal", subcat: "about_me_trends" },
  { en: "be my guest", pt: "fique à vontade", cat: "personal", subcat: "about_me_trends" },
  { en: "FYI", pt: "para sua informação", cat: "personal", subcat: "about_me_trends" },
  { en: "not too shabby", pt: "nada mal", cat: "personal", subcat: "about_me_trends" },
  { en: "I'm game", pt: "eu topo / eu tô dentro", cat: "personal", subcat: "about_me_trends" },
  { en: "I'm in a hurry", pt: "estou com pressa", cat: "personal", subcat: "about_me_trends" },
  { en: "BRB (be right back)", pt: "já volto", cat: "personal", subcat: "about_me_trends" },
  { en: "pretty please", pt: "porfavorzinho", cat: "personal", subcat: "about_me_trends" },
  { en: "bring it on", pt: "manda ver", cat: "personal", subcat: "about_me_trends" },
  { en: "cut it out", pt: "pare com isso", cat: "personal", subcat: "about_me_trends" },
  { en: "I wouldn't say that", pt: "eu não diria isso", cat: "personal", subcat: "about_me_trends" },
  { en: "for real?", pt: "é sério?", cat: "personal", subcat: "about_me_trends" },
  { en: "it makes no sense!", pt: "isso não faz sentido!", cat: "personal", subcat: "about_me_trends" },
  { en: "I feel you", pt: "eu te entendo", cat: "personal", subcat: "about_me_trends" },
  { en: "I gotcha", pt: "entendi / saquei", cat: "personal", subcat: "about_me_trends" },
  { en: "I don't get it", pt: "não entendi", cat: "personal", subcat: "about_me_trends" },
  { en: "hit me up", pt: "entre em contato", cat: "personal", subcat: "about_me_trends" },
  { en: "I'm screwed up", pt: "cometi um erro / estou enrolado", cat: "personal", subcat: "about_me_trends" },

  // ROUTINE - MORNING
  { en: "I get dressed for the day.", pt: "Me visto para o dia.", cat: "routine", subcat: "morning" },
  { en: "I pack my bag before leaving.", pt: "Arrumo minha mochila antes de sair.", cat: "routine", subcat: "morning" },
  { en: "I leave home at 8 AM.", pt: "Saio de casa às 8 da manhã.", cat: "routine", subcat: "morning" },
  { en: "I like to exercise in the morning.", pt: "Gosto de me exercitar de manhã.", cat: "routine", subcat: "morning" },
  { en: "I check my messages as soon as I wake up.", pt: "Verifico minhas mensagens assim que acordo.", cat: "routine", subcat: "morning" },

  // ROUTINE - EVENING/NIGHT
  { en: "I get home around 7 PM.", pt: "Chego em casa por volta das 19h.", cat: "routine", subcat: "evening_night" },
  { en: "I have dinner at 8 PM.", pt: "Janto às 20h.", cat: "routine", subcat: "evening_night" },
  { en: "I scroll through social media at night.", pt: "Fico nas redes sociais à noite.", cat: "routine", subcat: "evening_night" },
  { en: "I need at least 7 hours of sleep.", pt: "Preciso de pelo menos 7 horas de sono.", cat: "routine", subcat: "evening_night" },
  { en: "I plan my next day before sleeping.", pt: "Planejo meu próximo dia antes de dormir.", cat: "routine", subcat: "evening_night" },
  { en: "I relax and unwind at night.", pt: "Eu relaxo e descontraio à noite.", cat: "routine", subcat: "evening_night" },
  { en: "I turn off my phone an hour before bed.", pt: "Desligo meu celular uma hora antes de dormir.", cat: "routine", subcat: "evening_night" },
  { en: "Good night, sleep well!", pt: "Boa noite, durma bem!", cat: "routine", subcat: "evening_night" },
  { en: "I need to fix my sleep schedule.", pt: "Preciso arrumar meu horário de sono.", cat: "routine", subcat: "evening_night" },

  // WORK - VOLUNTARY
  { en: "Man, I'm freaking out. I know how to speak. I can talk with friends, but here I'm frozen. I just can't open my mouth to talk.", pt: "Cara, estou surtando. Eu sei falar. Consigo conversar com amigos, mas aqui estou congelado. Simplesmente não consigo abrir a boca para falar.", cat: "work", subcat: "voluntary" },
  { en: "Who knows?", pt: "Quem sabe?", cat: "work", subcat: "voluntary" },
  { en: "Bless you", pt: "Saúde", cat: "work", subcat: "voluntary" },
  { en: "I appreciate you", pt: "Agradeço a você / Eu te aprecio", cat: "work", subcat: "voluntary" },
  { en: "I charge", pt: "Eu cobro", cat: "work", subcat: "voluntary" },
  { en: "Bring it in", pt: "Chega mais / Vem cá", cat: "work", subcat: "voluntary" },
  { en: "Holy clap, I've never seen you guys here!", pt: "Caraca, nunca tinha visto vocês por aqui!", cat: "work", subcat: "voluntary" },
  { en: "First time here?", pt: "Primeira vez aqui?", cat: "work", subcat: "voluntary" },
  { en: "Are you liking it?", pt: "Vocês estão gostando?", cat: "work", subcat: "voluntary" },
  { en: "Do you speak a little Portuguese?", pt: "Você fala um pouco de português?", cat: "work", subcat: "voluntary" },
  { en: "How did you learn, man?", pt: "Como você aprendeu, cara?", cat: "work", subcat: "voluntary" },
  { en: "What do you recommend me to do here?", pt: "O que você me recomenda fazer aqui?", cat: "work", subcat: "voluntary" },
  { en: "It depends on what you wanna do!", pt: "Depende do que você quer fazer!", cat: "work", subcat: "voluntary" },
  { en: "What are you looking for?", pt: "O que você está procurando?", cat: "work", subcat: "voluntary" },
  { en: "Try harder", pt: "Tenta mais / Esforce-se mais", cat: "work", subcat: "voluntary" },
  { en: "May the best person win.", pt: "Que vença o melhor.", cat: "work", subcat: "voluntary" },

  // WORK - OXYGEN
  { en: "I deliver medical oxygen to patients at home, using a car or a motorcycle.", pt: "Eu entrego oxigênio medicinal para pacientes em casa, usando carro ou moto.", cat: "work", subcat: "oxygen" },
  { en: "My job helps people breathe better.", pt: "Meu trabalho ajuda as pessoas a respirarem melhor.", cat: "work", subcat: "oxygen" },
  { en: "I help people who need oxygen at home. It's my job, but also my mission.", pt: "Eu ajudo pessoas que precisam de oxigênio em casa. É meu trabalho, mas também minha missão.", cat: "work", subcat: "oxygen" },
  { en: "I deliver medical oxygen to patients at home, by motorcycle or car.", pt: "Eu entrego oxigênio medicinal para pacientes em casa, de moto ou carro.", cat: "work", subcat: "oxygen" },
  { en: "I work in home oxygen supply. I transport and deliver cylinders by bike and car.", pt: "Eu trabalho com fornecimento de oxigênio domiciliar. Transporto e entrego cilindros de bicicleta e carro.", cat: "work", subcat: "oxygen" },
  { en: "I help people who need oxygen at home. I drive a car or a motorcycle to deliver it.", pt: "Eu ajudo pessoas que precisam de oxigênio em casa. Dirijo carro ou moto para entregar.", cat: "work", subcat: "oxygen" },
  { en: "I work delivering medical oxygen and helping customers at a store.", pt: "Eu trabalho entregando oxigênio medicinal e ajudando clientes em uma loja.", cat: "work", subcat: "oxygen" },
  { en: "I usually start at 8 a.m. and go out with my friend Alex to make a few deliveries during the day.", pt: "Eu normalmente começo às 8 da manhã e saio com meu amigo Alex para fazer algumas entregas durante o dia.", cat: "work", subcat: "oxygen" },
  { en: "When I get home, I train calisthenics, take a shower, study English, and go to bed around 10.", pt: "Quando chego em casa, treino calistenia, tomo banho, estudo inglês e vou dormir por volta das 22h.", cat: "work", subcat: "oxygen" },

  // SCHOOL - COLLEGE
  { en: "What do you study?", pt: "O que você estuda?", cat: "school", subcat: "college_ads" },
  { en: "How's college going?", pt: "Como está a faculdade?", cat: "school", subcat: "college_ads" },
  { en: "Tell me about your latest project.", pt: "Me fale sobre seu último projeto.", cat: "school", subcat: "college_ads" },
  { en: "Where do you study?", pt: "Onde você estuda?", cat: "school", subcat: "college_ads" },
  { en: "How long is your course?", pt: "Quanto tempo dura o seu curso?", cat: "school", subcat: "college_ads" },
  { en: "Are you in college or university?", pt: "Você está na faculdade ou universidade?", cat: "school", subcat: "college_ads" },
  { en: "Do you like your major?", pt: "Você gosta do seu curso?", cat: "school", subcat: "college_ads" },
  { en: "When did you start studying there?", pt: "Quando você começou a estudar lá?", cat: "school", subcat: "college_ads" },
  { en: "Why did you choose that major?", pt: "Por que você escolheu esse curso?", cat: "school", subcat: "college_ads" },
  { en: "Was it your first choice or did you change your mind later?", pt: "Foi sua primeira escolha ou você mudou de ideia depois?", cat: "school", subcat: "college_ads" },
  { en: "Did someone inspire you to study that?", pt: "Alguém te inspirou a estudar isso?", cat: "school", subcat: "college_ads" },
  { en: "What subjects are you taking this semester?", pt: "Quais matérias você está fazendo esse semestre?", cat: "school", subcat: "college_ads" },
  { en: "Do you have a lot of assignments?", pt: "Você tem muitos trabalhos?", cat: "school", subcat: "college_ads" },
  { en: "How are your teachers?", pt: "Como são seus professores?", cat: "school", subcat: "college_ads" },
  { en: "Do you study every day or just before exams?", pt: "Você estuda todo dia ou só antes das provas?", cat: "school", subcat: "college_ads" },
  { en: "Do you usually study alone or with friends?", pt: "Você normalmente estuda sozinho ou com amigos?", cat: "school", subcat: "college_ads" },
  { en: "What do you like the most about your course?", pt: "O que você mais gosta no seu curso?", cat: "school", subcat: "college_ads" },
  { en: "What's the hardest part for you?", pt: "Qual é a parte mais difícil pra você?", cat: "school", subcat: "college_ads" },
  { en: "Do you ever feel like giving up?", pt: "Você já sentiu vontade de desistir?", cat: "school", subcat: "college_ads" },
  { en: "What keeps you motivated to study?", pt: "O que te mantém motivado pra estudar?", cat: "school", subcat: "college_ads" },
  { en: "Do you already work in your field?", pt: "Você já trabalha na sua área?", cat: "school", subcat: "college_ads" },
  { en: "Do you plan to work abroad after graduation?", pt: "Você planeja trabalhar no exterior depois de se formar?", cat: "school", subcat: "college_ads" },
  { en: "What kind of job would you like to have after college?", pt: "Que tipo de trabalho você gostaria de ter depois da faculdade?", cat: "school", subcat: "college_ads" },
  { en: "Do you think your degree will help you in real life?", pt: "Você acha que o seu diploma vai te ajudar na vida real?", cat: "school", subcat: "college_ads" },
  { en: "I study Software Engineering.", pt: "Eu estudo Engenharia de Software.", cat: "school", subcat: "college_ads" },
  { en: "I'm in the third semester.", pt: "Estou no terceiro período.", cat: "school", subcat: "college_ads" },
  { en: "It's a four-year program.", pt: "É um curso de quatro anos.", cat: "school", subcat: "college_ads" },
  { en: "I study at USF (University of San Francisco).", pt: "Eu estudo na USF (Universidade de São Francisco).", cat: "school", subcat: "college_ads" },
  { en: "Right now I'm on vacation.", pt: "No momento estou de férias.", cat: "school", subcat: "college_ads" },
  { en: "I've always liked technology and problem-solving.", pt: "Eu sempre gostei de tecnologia e de resolver problemas.", cat: "school", subcat: "college_ads" },
  { en: "I want to build things that make people's lives easier.", pt: "Quero criar coisas que tornem a vida das pessoas mais fácil.", cat: "school", subcat: "college_ads" },
  { en: "Software engineering connects creativity and logic — and I love that.", pt: "Engenharia de software conecta criatividade e lógica — e eu amo isso.", cat: "school", subcat: "college_ads" },
  { en: "Right now we're learning the basics of programming and databases.", pt: "Atualmente estamos aprendendo o básico de programação e bancos de dados.", cat: "school", subcat: "college_ads" },
  { en: "I'm learning how to code in Python and Java.", pt: "Estou aprendendo a programar em Python e Java.", cat: "school", subcat: "college_ads" },
  { en: "We also study algorithms, logic, and system design.", pt: "Também estudamos algoritmos, lógica e design de sistemas.", cat: "school", subcat: "college_ads" },
  { en: "It's challenging, but I really enjoy it.", pt: "É desafiador, mas eu gosto muito.", cat: "school", subcat: "college_ads" },
  { en: "Sometimes it's hard, but I feel I'm growing a lot.", pt: "Às vezes é difícil, mas sinto que estou evoluindo muito.", cat: "school", subcat: "college_ads" },
  { en: "I like when I understand how things work behind the apps we use every day.", pt: "Gosto quando entendo como funcionam as coisas por trás dos apps que usamos todo dia.", cat: "school", subcat: "college_ads" },
  { en: "I usually study early in the morning before work.", pt: "Eu normalmente estudo cedo de manhã antes do trabalho.", cat: "school", subcat: "college_ads" },
  { en: "I like to review what I learned after class.", pt: "Gosto de revisar o que aprendi depois da aula.", cat: "school", subcat: "college_ads" },
  { en: "I also watch videos and do online courses to go deeper.", pt: "Também assisto a vídeos e faço cursos online pra me aprofundar.", cat: "school", subcat: "college_ads" },
  { en: "I want to become a great software engineer and maybe work abroad someday.", pt: "Quero me tornar um ótimo engenheiro de software e talvez trabalhar no exterior algum dia.", cat: "school", subcat: "college_ads" },
  { en: "I'd like to create my own projects or even start a company in the future.", pt: "Gostaria de criar meus próprios projetos ou até abrir uma empresa no futuro.", cat: "school", subcat: "college_ads" },
  { en: "I want to use technology to help people and make a difference.", pt: "Quero usar a tecnologia pra ajudar as pessoas e fazer a diferença.", cat: "school", subcat: "college_ads" }
];

function loadEnglishData() {
  const storedCats = localStorage.getItem('english_categories');
  const storedPhrases = localStorage.getItem('english_phrases');
  const storedFavs = localStorage.getItem('englishFavorites');
  
  if (storedCats) {
    categories = JSON.parse(storedCats);
  } else {
    categories = JSON.parse(JSON.stringify(DEFAULT_ENGLISH_CATEGORIES));
  }
  
  if (storedPhrases) {
    englishPhrases = JSON.parse(storedPhrases);
    englishNextId = Math.max(...englishPhrases.map(p => p.id), 0) + 1;
  } else {
    englishPhrases = [];
    for (const p of DEFAULT_ENGLISH_PHRASES) {
      englishPhrases.push({ id: englishNextId++, ...p });
    }
  }
  
  if (storedFavs) {
    favorites = JSON.parse(storedFavs);
  }
  
  categories.forEach(c => openEnglishSections.add(c.id));
  
  if (!dailyPhraseId && englishPhrases.length > 0) {
    dailyPhraseId = englishPhrases[Math.floor(Math.random() * englishPhrases.length)].id;
    localStorage.setItem('dailyPhraseId', dailyPhraseId);
  }
  
  saveEnglishData();
}

function saveEnglishData() {
  localStorage.setItem('english_categories', JSON.stringify(categories));
  localStorage.setItem('english_phrases', JSON.stringify(englishPhrases));
  localStorage.setItem('englishFavorites', JSON.stringify(favorites));
}

function isFavorited(phraseId) { return favorites.includes(phraseId); }

function toggleFavorite(phraseId) {
  if (favorites.includes(phraseId)) {
    favorites = favorites.filter(id => id !== phraseId);
  } else {
    favorites.push(phraseId);
    addXp(XP_RULES.ENGLISH_PHRASE_FAVORITE, 'english_phrase_favorite', true);
  }
  saveEnglishData();
  renderEnglish();
  updateEnglishStats();
}

function speakEnglishPhrase(text) {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

function speakDailyPhrase() {
  const phrase = englishPhrases.find(p => p.id == dailyPhraseId);
  if (phrase) speakEnglishPhrase(phrase.en);
}

function refreshDailyPhrase() {
  if (englishPhrases.length > 0) {
    const randomPhrase = englishPhrases[Math.floor(Math.random() * englishPhrases.length)];
    dailyPhraseId = randomPhrase.id;
    localStorage.setItem('dailyPhraseId', dailyPhraseId);
    renderEnglish();
    showToast("✨ Nova frase do dia!");
  }
}

function toggleDailyFavorite() {
  if (dailyPhraseId) {
    toggleFavorite(dailyPhraseId);
    renderEnglish();
  }
}

function updateEnglishStats() {
  const totalSpan = document.getElementById('totalPhrasesCount');
  const favSpan = document.getElementById('favoritesCount');
  if (totalSpan) totalSpan.textContent = englishPhrases.length;
  if (favSpan) favSpan.textContent = favorites.length;
}

function renderEnglish() {
  const container = document.getElementById('englishCategoriesContainer');
  if (!container) return;
  
  const search = currentEnglishSearch.toLowerCase();
  let filteredPhrases = [...englishPhrases];
  
  if (currentFilter === 'favorites') {
    filteredPhrases = filteredPhrases.filter(p => favorites.includes(p.id));
  } else if (currentFilter === 'recent') {
    filteredPhrases = [...filteredPhrases].reverse().slice(0, 20);
  }
  
  if (search) {
    filteredPhrases = filteredPhrases.filter(p => 
      p.en.toLowerCase().includes(search) || 
      p.pt.toLowerCase().includes(search)
    );
  }
  
  container.className = `english-categories ${currentViewMode}-view`;
  let html = '';
  
  for (const cat of categories) {
    const catPhrases = filteredPhrases.filter(p => p.cat === cat.id);
    if (catPhrases.length === 0 && search) continue;
    
    const isOpen = openEnglishSections.has(cat.id);
    
    html += `<div class="category-section">
      <div class="category-header" onclick="toggleEnglishSection('${cat.id}')">
        <h3><span class="collapse-icon ${isOpen ? '' : 'collapsed'}">▼</span><span>${cat.emoji || '📁'}</span><span>${escapeHtml(cat.name)}</span><span class="count">${catPhrases.length}</span></h3>
      </div>
      <div class="category-phrases ${isOpen ? '' : 'collapsed'}">`;
    
    if (cat.subcats && cat.subcats.length > 0) {
      for (const subcat of cat.subcats) {
        const subcatPhrases = catPhrases.filter(p => p.subcat === subcat.id);
        if (subcatPhrases.length === 0 && search) continue;
        
        const isSubOpen = openEnglishSubcats.has(subcat.id);
        
        html += `<div class="subcategory-group">
          <div class="subcategory-header" onclick="event.stopPropagation(); toggleEnglishSubcat('${subcat.id}')">
            <div class="subcategory-title"><span class="collapse-icon ${isSubOpen ? '' : 'collapsed'}">▼</span><span>${subcat.emoji || '📂'}</span><span>${escapeHtml(subcat.name)}</span><span class="count">${subcatPhrases.length}</span></div>
          </div>
          <div class="subcategory-phrases" style="display: ${isSubOpen ? 'block' : 'none'}">`;
        
        if (currentViewMode === 'grid') {
          html += '<div class="phrases-grid">';
          for (const p of subcatPhrases) {
            const isFav = isFavorited(p.id);
            html += `<div class="phrase-card ${isFav ? 'favorited' : ''}">
              <button class="fav-star ${isFav ? 'favorited' : ''}" onclick="toggleFavorite(${p.id})">${isFav ? '★' : '☆'}</button>
              <div class="phrase-en-text">${escapeHtml(p.en)}</div>
              <div class="phrase-pt-text">${escapeHtml(p.pt)}</div>
              <div class="phrase-card-actions"><button class="phrase-btn speak" onclick="speakEnglishPhrase('${escapeHtml(p.en).replace(/'/g, "\\'")}')">🔊 Ouvir</button></div>
            </div>`;
          }
          html += '</div>';
        } else {
          html += '<div class="phrases-list">';
          for (const p of subcatPhrases) {
            const isFav = isFavorited(p.id);
            html += `<div class="phrase-list-item">
              <div class="phrase-list-text"><span class="phrase-list-en">${escapeHtml(p.en)}</span><span class="phrase-list-pt">🇧🇷 ${escapeHtml(p.pt)}</span></div>
              <div class="list-actions">
                <button class="phrase-btn speak" onclick="speakEnglishPhrase('${escapeHtml(p.en).replace(/'/g, "\\'")}')">🔊</button>
                <button class="phrase-btn favorite ${isFav ? 'favorited' : ''}" onclick="toggleFavorite(${p.id})">${isFav ? '★' : '☆'}</button>
              </div>
            </div>`;
          }
          html += '</div>';
        }
        html += `</div></div>`;
      }
    }
    
    const uncategorized = catPhrases.filter(p => !p.subcat);
    if (uncategorized.length > 0) {
      html += `<div class="subcategory-group">
        <div class="subcategory-header"><div class="subcategory-title"><span>📄</span><span>Sem subcategoria</span><span class="count">${uncategorized.length}</span></div></div>
        <div class="subcategory-phrases">`;
      
      if (currentViewMode === 'grid') {
        html += '<div class="phrases-grid">';
        for (const p of uncategorized) {
          const isFav = isFavorited(p.id);
          html += `<div class="phrase-card ${isFav ? 'favorited' : ''}">
            <button class="fav-star ${isFav ? 'favorited' : ''}" onclick="toggleFavorite(${p.id})">${isFav ? '★' : '☆'}</button>
            <div class="phrase-en-text">${escapeHtml(p.en)}</div>
            <div class="phrase-pt-text">${escapeHtml(p.pt)}</div>
            <div class="phrase-card-actions"><button class="phrase-btn speak" onclick="speakEnglishPhrase('${escapeHtml(p.en).replace(/'/g, "\\'")}')">🔊 Ouvir</button></div>
          </div>`;
        }
        html += '</div>';
      } else {
        html += '<div class="phrases-list">';
        for (const p of uncategorized) {
          const isFav = isFavorited(p.id);
          html += `<div class="phrase-list-item">
            <div class="phrase-list-text"><span class="phrase-list-en">${escapeHtml(p.en)}</span><span class="phrase-list-pt">🇧🇷 ${escapeHtml(p.pt)}</span></div>
            <div class="list-actions">
              <button class="phrase-btn speak" onclick="speakEnglishPhrase('${escapeHtml(p.en).replace(/'/g, "\\'")}')">🔊</button>
              <button class="phrase-btn favorite ${isFav ? 'favorited' : ''}" onclick="toggleFavorite(${p.id})">${isFav ? '★' : '☆'}</button>
            </div>
          </div>`;
        }
        html += '</div>';
      }
      html += `</div></div>`;
    }
    html += `</div></div>`;
  }
  
  if (filteredPhrases.length === 0) {
    html = `<div class="empty-state"><p>✨ Nenhuma frase encontrada</p><button onclick="openAddEnglishPhrase()" class="btn-small" style="margin-top: 16px;">➕ Adicionar frase</button></div>`;
  }
  
  container.innerHTML = html;
  updateEnglishStats();
  updateDailyPhraseDisplay();
}

function updateDailyPhraseDisplay() {
  const dailyEn = document.getElementById('dailyPhraseEn');
  const dailyPt = document.getElementById('dailyPhrasePt');
  const dailyFavBtn = document.getElementById('dailyFavoriteBtn');
  
  if (dailyEn && dailyPt && dailyPhraseId) {
    const phrase = englishPhrases.find(p => p.id == dailyPhraseId);
    if (phrase) {
      dailyEn.textContent = phrase.en;
      dailyPt.textContent = phrase.pt;
      if (dailyFavBtn) {
        dailyFavBtn.textContent = isFavorited(dailyPhraseId) ? '★ Favoritada' : '☆ Favoritar';
      }
    }
  }
}

function toggleEnglishSection(id) {
  if (openEnglishSections.has(id)) openEnglishSections.delete(id);
  else openEnglishSections.add(id);
  renderEnglish();
}

function toggleEnglishSubcat(id) {
  if (openEnglishSubcats.has(id)) openEnglishSubcats.delete(id);
  else openEnglishSubcats.add(id);
  renderEnglish();
}

function handleEnglishSearch() {
  const input = document.getElementById('englishSearch');
  if (input) {
    currentEnglishSearch = input.value;
    renderEnglish();
  }
}

function setEnglishFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === filter) btn.classList.add('active');
  });
  renderEnglish();
}

function setEnglishView(view) {
  currentViewMode = view;
  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.view === view) btn.classList.add('active');
  });
  renderEnglish();
}

function openAddEnglishPhrase() {
  const catSelect = document.getElementById('newPhraseCat');
  if (catSelect) {
    catSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.emoji} ${escapeHtml(c.name)}</option>`).join('');
  }
  const modal = document.getElementById('newEnglishPhraseModal');
  if(modal) modal.classList.add('open');
}

function saveEnglishPhrase() {
  const en = document.getElementById('newEnglishEn').value.trim();
  const pt = document.getElementById('newEnglishPt').value.trim();
  const cat = document.getElementById('newPhraseCat').value;
  const subcat = document.getElementById('newPhraseSubcat').value;
  
  if (!en || !pt) {
    showToast('⚠️ Preencha inglês e português');
    return;
  }
  
  englishPhrases.push({
    id: englishNextId++,
    en: en,
    pt: pt,
    cat: cat,
    subcat: subcat || ''
  });
  
  addXp(XP_RULES.ENGLISH_PHRASE_ADD, 'english_phrase', true);
  
  saveEnglishData();
  renderEnglish();
  closeModal('newEnglishPhraseModal');
  document.getElementById('newEnglishEn').value = '';
  document.getElementById('newEnglishPt').value = '';
  showToast('✅ Frase adicionada!');
}

function initEnglishEventListeners() {
  const searchInput = document.getElementById('englishSearch');
  if (searchInput) searchInput.addEventListener('input', handleEnglishSearch);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setEnglishFilter(btn.dataset.filter));
  });
  
  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => setEnglishView(btn.dataset.view));
  });
  
  const addPhraseTopBtn = document.getElementById('addEnglishPhraseTopBtn');
  if (addPhraseTopBtn) addPhraseTopBtn.addEventListener('click', openAddEnglishPhrase);
  
  const modalSaveBtn = document.getElementById('saveEnglishPhraseBtn');
  if (modalSaveBtn) modalSaveBtn.addEventListener('click', saveEnglishPhrase);
  
  const catSelect = document.getElementById('newPhraseCat');
  if (catSelect) {
    catSelect.addEventListener('change', function() {
      const cat = categories.find(c => c.id === this.value);
      const subcatSelect = document.getElementById('newPhraseSubcat');
      if (subcatSelect && cat && cat.subcats) {
        subcatSelect.innerHTML = '<option value="">-- Sem subcategoria --</option>' + 
          cat.subcats.map(s => `<option value="${s.id}">${s.emoji} ${escapeHtml(s.name)}</option>`).join('');
      }
    });
  }
}

// ==================== NAVEGAÇÃO ====================
function navigateTo(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const targetView = document.getElementById(`view-${view}`);
  if(targetView) targetView.classList.add('active');
  const btn = document.querySelector(`[data-view="${view}"]`);
  if(btn) btn.classList.add('active');
  const titles = {dashboard:'Dashboard', habits:'Hábitos', english:'English', speaking:'Speaking', focus:'Foco', goals:'Metas', checklist:'Checklist Vídeos', roleplay:'Roleplays', words:'Palavras', references:'Referências', daily:'Atividades Diárias'};
  const titleEl = document.getElementById('viewTitle');
  if(titleEl) titleEl.textContent = titles[view] || view;
}
document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => navigateTo(btn.dataset.view)));
const menuBtn = document.getElementById('menuBtn');
if(menuBtn) menuBtn.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
const todayDateEl = document.getElementById('todayDate');
if(todayDateEl) todayDateEl.textContent = new Date().toLocaleDateString('pt-BR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

function escapeHtml(str) { if(!str) return ''; return String(str).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])); }

// Configurar botões de importar/exportar/limpar
function setupDataButtons() {
  const exportBtn = document.getElementById('exportAllDataBtn');
  const importBtn = document.getElementById('importAllDataBtn');
  const clearBtn = document.getElementById('clearAllDataBtn');
  const importFile = document.getElementById('importFileInput');
  
  if (exportBtn) {
    exportBtn.addEventListener('click', exportAllData);
  }
  
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      if (importFile) importFile.click();
    });
  }
  
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importAllData(e.target.files[0]);
        importFile.value = '';
      }
    });
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllData);
  }
  
  console.log('✅ Botões de dados configurados');
}

function init() {
  if(checklistItems.length === 0 && checklistTotal === 250) checklistItems = [];
  
  // Inicializar sistema de XP
  if (typeof loadUserStats === 'function') {
    loadUserStats();
    updateXpDisplay();
  }
  
  updateStreak();
  renderTasks();
  renderSpeaking();
  renderHabits();
  renderGoals();
  renderChecklist();
  renderPhrases();
  renderRoleplays();
  renderWords();
  renderReferences();
  renderEnergyTracker();
  renderDailyActivities();
  updateDashboard();
  resetTimer();
  updateTimerDisplay();
  
  // Inicializar o sistema English
  loadEnglishData();
  renderEnglish();
  initEnglishEventListeners();
  
  // Configurar botões de dados
  setupDataButtons();
  
  console.log('Sistema de XP inicializado com sucesso!');
}

// Iniciar tudo
init();

// ==================== FUNÇÕES DE EXPORTAR/IMPORTAR/LIMPAR DADOS ====================

// Coletar todos os dados do aplicativo
function getAllAppData() {
  return {
    version: "1.0",
    exportDate: new Date().toISOString(),
    tasks: tasks,
    habits: habits,
    goals: goals,
    focusData: focusData,
    checklistItems: checklistItems,
    checklistTotal: checklistTotal,
    checklistNotes: checklistNotes,
    phrases: phrases,
    roleplays: roleplays,
    fullRoleplays: fullRoleplays,
    words: words,
    dailyTasks: dailyTasks,
    dailyNotes: dailyNotes,
    speakingSessions: speakingSessions,
    streak: streak,
    lastDate: lastDate,
    references: references,
    energyData: energyData,
    // Dados do English Library
    categories: categories,
    englishPhrases: englishPhrases,
    favorites: favorites,
    dailyPhraseId: dailyPhraseId,
    // Dados do Sistema de XP
    userStats: userStats
  };
}

// Exportar todos os dados
function exportAllData() {
  const allData = getAllAppData();
  const dataStr = JSON.stringify(allData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `routinemap_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📦 Dados exportados com sucesso!');
}

// Importar dados
function importAllData(file) {
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Validar se é um backup válido
      if (!importedData.tasks && !importedData.habits) {
        showToast('❌ Arquivo inválido ou corrompido');
        return;
      }
      
      // Restaurar dados
      if (importedData.tasks) tasks = importedData.tasks;
      if (importedData.habits) habits = importedData.habits;
      if (importedData.goals) goals = importedData.goals;
      if (importedData.focusData) focusData = importedData.focusData;
      if (importedData.checklistItems) checklistItems = importedData.checklistItems;
      if (importedData.checklistTotal) checklistTotal = importedData.checklistTotal;
      if (importedData.checklistNotes) checklistNotes = importedData.checklistNotes;
      if (importedData.phrases) phrases = importedData.phrases;
      if (importedData.roleplays) roleplays = importedData.roleplays;
      if (importedData.fullRoleplays) {
        fullRoleplays = importedData.fullRoleplays;
        saveFullRoleplays();
      }
      if (importedData.words) words = importedData.words;
      if (importedData.dailyTasks) dailyTasks = importedData.dailyTasks;
      if (importedData.dailyNotes) dailyNotes = importedData.dailyNotes;
      if (importedData.speakingSessions) speakingSessions = importedData.speakingSessions;
      if (importedData.streak) streak = importedData.streak;
      if (importedData.lastDate) lastDate = importedData.lastDate;
      if (importedData.references) references = importedData.references;
      if (importedData.energyData) energyData = importedData.energyData;
      
      // Dados do English Library
      if (importedData.categories) categories = importedData.categories;
      if (importedData.englishPhrases) {
        englishPhrases = importedData.englishPhrases;
        englishNextId = Math.max(...englishPhrases.map(p => p.id), 0) + 1;
      }
      if (importedData.favorites) favorites = importedData.favorites;
      if (importedData.dailyPhraseId) dailyPhraseId = importedData.dailyPhraseId;
      
      // Dados do Sistema de XP
      if (importedData.userStats) {
        userStats = importedData.userStats;
        saveUserStats();
      }
      
      // Salvar tudo no localStorage
      saveAll();
      saveEnglishData();
      saveFullRoleplays();
      
      // Recarregar interfaces
      renderTasks();
      renderHabits();
      renderGoals();
      renderChecklist();
      renderPhrases();
      renderRoleplays();
      renderFullRoleplays();
      renderWords();
      renderSpeaking();
      renderReferences();
      renderEnergyTracker();
      renderDailyActivities();
      renderEnglish();
      updateDashboard();
      updateEnglishStats();
      
      showToast('✅ Dados importados com sucesso!');
      
    } catch (error) {
      console.error('Erro ao importar:', error);
      showToast('❌ Erro ao importar arquivo');
    }
  };
  reader.readAsText(file);
}

// Limpar todos os dados
function clearAllData() {
  if (confirm('⚠️ ATENÇÃO! Isso vai APAGAR TODOS os seus dados:\n\n• Tarefas\n• Hábitos\n• Metas\n• Frases\n• Roleplays\n• Palavras\n• Sessões de speaking\n• Checklists\n• Configurações\n\nEsta ação NÃO pode ser desfeita!\n\nTem certeza que deseja continuar?')) {
    
    if (confirm('🔄 Última confirmação: Digite "CONFIRMAR" no prompt abaixo para prosseguir.')) {
      const confirmation = prompt('Digite CONFIRMAR para limpar todos os dados:');
      if (confirmation === 'CONFIRMAR') {
        
        // Limpar localStorage
        localStorage.clear();
        
        // Recarregar a página para reiniciar tudo
        showToast('🗑️ Todos os dados foram limpos! Recarregando...');
        setTimeout(() => {
          location.reload();
        }, 1500);
        
      } else {
        showToast('❌ Operação cancelada - confirmação incorreta');
      }
    } else {
      showToast('❌ Operação cancelada');
    }
  }
}

// Função para resetar apenas os dados do usuário (manter estrutura)
function resetUserDataOnly() {
  if (confirm('⚠️ Isso vai apagar TODOS os seus dados criados (tarefas, hábitos, frases, etc.) e restaurar os valores padrão.\n\nContinuar?')) {
    
    // Remover chaves específicas do usuário
    const keysToRemove = [
      'tasks', 'habits', 'goals', 'focusData', 'checklistItems', 
      'checklistNotes', 'phrases', 'roleplays', 'fullRoleplays', 
      'words', 'dailyTasks', 'dailyNotes', 'speakingSessions', 
      'streak', 'lastDate', 'references', 'energyData',
      'english_categories', 'english_phrases', 'englishFavorites', 'dailyPhraseId'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    showToast('🔄 Dados resetados! Recarregando...');
    setTimeout(() => location.reload(), 1000);
  }
}