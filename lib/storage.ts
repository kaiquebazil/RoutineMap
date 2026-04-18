// =============================================================================
// Storage local (localStorage) — substitui o backend PostgreSQL + Prisma
// =============================================================================
// Todos os dados são persistidos apenas no navegador do usuário. Não há sync
// entre dispositivos e não há login. Simplifica drasticamente o deploy.
// =============================================================================

export type Priority = 'high' | 'medium' | 'low' | string;

export interface TaskCompletion {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
}

export interface Task {
  id: string;
  routineId: string;
  title: string;
  description?: string;
  timeOfDay?: string;
  daysOfWeek: string[];
  priority: Priority;
  sortOrder: number;
  completions: TaskCompletion[];
}

export interface Routine {
  id: string;
  title: string;
  description?: string;
  color: string;
  icon: string;
  energyLevel: 'high' | 'medium' | 'low' | string;
  sortOrder: number;
  isActive: boolean;
  tasks: Task[];
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon?: string;
  sortOrder: number;
  entries: HabitEntry[];
}

export interface DailyNote {
  date: string; // YYYY-MM-DD
  intention: string;
  todos: string;
  notes: string;
}

export interface WeeklyReflection {
  weekStart: string; // YYYY-MM-DD (Monday)
  threeWords: string;
  proudMoments: string;
  struggles: string;
  learned: string;
}

export interface Reference {
  id: string;
  title: string;
  url?: string | null;
  description?: string | null;
  category: string;
  createdAt: string;
}

// =============================================================================
// Keys
// =============================================================================
const K = {
  routines: 'rm:routines',
  habits: 'rm:habits',
  dailyNotes: 'rm:dailyNotes',
  weeklyReflections: 'rm:weeklyReflections',
  references: 'rm:references',
  initialized: 'rm:initialized:v1',
};

// =============================================================================
// Helpers
// =============================================================================
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('storage write failed', err);
  }
}

// =============================================================================
// Inicialização com dados default (equivalente ao antigo seed)
// =============================================================================
export function ensureInitialized(): void {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem(K.initialized)) return;

  write<Routine[]>(K.routines, DEFAULT_ROUTINES);
  write<Habit[]>(K.habits, DEFAULT_HABITS);
  write<Reference[]>(K.references, DEFAULT_REFERENCES);
  write<DailyNote[]>(K.dailyNotes, []);
  write<WeeklyReflection[]>(K.weeklyReflections, []);
  window.localStorage.setItem(K.initialized, '1');
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(K).forEach((key) => window.localStorage.removeItem(key));
  ensureInitialized();
}

// =============================================================================
// Routines
// =============================================================================
export function getRoutines(): Routine[] {
  ensureInitialized();
  const list = read<Routine[]>(K.routines, []);
  return list.slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function createRoutine(data: Partial<Routine>): Routine {
  const list = getRoutines();
  const routine: Routine = {
    id: uid(),
    title: data.title || 'Nova rotina',
    description: data.description || '',
    color: data.color || '#7C3AED',
    icon: data.icon || 'map',
    energyLevel: data.energyLevel || 'medium',
    sortOrder: data.sortOrder ?? list.length,
    isActive: data.isActive ?? true,
    tasks: [],
  };
  list.push(routine);
  write(K.routines, list);
  return routine;
}

export function updateRoutine(id: string, data: Partial<Routine>): Routine | null {
  const list = getRoutines();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data, id };
  write(K.routines, list);
  return list[idx];
}

export function deleteRoutine(id: string): void {
  const list = getRoutines().filter((r) => r.id !== id);
  write(K.routines, list);
}

// =============================================================================
// Tasks
// =============================================================================
export function createTask(routineId: string, data: Partial<Task>): Task | null {
  const list = getRoutines();
  const routine = list.find((r) => r.id === routineId);
  if (!routine) return null;
  const task: Task = {
    id: uid(),
    routineId,
    title: data.title || 'Nova tarefa',
    description: data.description || '',
    timeOfDay: data.timeOfDay || '',
    daysOfWeek: data.daysOfWeek || [],
    priority: data.priority || 'medium',
    sortOrder: data.sortOrder ?? routine.tasks.length,
    completions: [],
  };
  routine.tasks.push(task);
  write(K.routines, list);
  return task;
}

export function updateTask(id: string, data: Partial<Task>): Task | null {
  const list = getRoutines();
  for (const r of list) {
    const idx = r.tasks.findIndex((t) => t.id === id);
    if (idx >= 0) {
      r.tasks[idx] = { ...r.tasks[idx], ...data, id };
      write(K.routines, list);
      return r.tasks[idx];
    }
  }
  return null;
}

export function deleteTask(id: string): void {
  const list = getRoutines();
  for (const r of list) {
    r.tasks = r.tasks.filter((t) => t.id !== id);
  }
  write(K.routines, list);
}

export function toggleTaskCompletion(id: string, date?: string): void {
  const d = date || todayISO();
  const list = getRoutines();
  for (const r of list) {
    const task = r.tasks.find((t) => t.id === id);
    if (task) {
      const existing = task.completions.find((c) => c.date === d);
      if (existing) {
        task.completions = task.completions.filter((c) => c.id !== existing.id);
      } else {
        task.completions.push({ id: uid(), taskId: id, date: d });
      }
      write(K.routines, list);
      return;
    }
  }
}

// =============================================================================
// Habits
// =============================================================================
export function getHabits(): Habit[] {
  ensureInitialized();
  const list = read<Habit[]>(K.habits, []);
  return list.slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function createHabit(data: Partial<Habit>): Habit {
  const list = getHabits();
  const habit: Habit = {
    id: uid(),
    name: data.name || 'Novo hábito',
    color: data.color || '#7C3AED',
    icon: data.icon || 'target',
    sortOrder: data.sortOrder ?? list.length,
    entries: [],
  };
  list.push(habit);
  write(K.habits, list);
  return habit;
}

export function updateHabit(id: string, data: Partial<Habit>): Habit | null {
  const list = getHabits();
  const idx = list.findIndex((h) => h.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data, id };
  write(K.habits, list);
  return list[idx];
}

export function deleteHabit(id: string): void {
  const list = getHabits().filter((h) => h.id !== id);
  write(K.habits, list);
}

export function toggleHabitEntry(id: string, date: string): void {
  const list = getHabits();
  const habit = list.find((h) => h.id === id);
  if (!habit) return;
  const existing = habit.entries.find((e) => e.date === date);
  if (existing) {
    habit.entries = habit.entries.filter((e) => e.id !== existing.id);
  } else {
    habit.entries.push({ id: uid(), habitId: id, date, completed: true });
  }
  write(K.habits, list);
}

// =============================================================================
// Daily Notes
// =============================================================================
export function getDailyNote(date: string): DailyNote {
  ensureInitialized();
  const list = read<DailyNote[]>(K.dailyNotes, []);
  return list.find((n) => n.date === date) || { date, intention: '', todos: '', notes: '' };
}

export function saveDailyNote(note: DailyNote): void {
  const list = read<DailyNote[]>(K.dailyNotes, []);
  const idx = list.findIndex((n) => n.date === note.date);
  if (idx >= 0) list[idx] = note;
  else list.push(note);
  write(K.dailyNotes, list);
}

// =============================================================================
// Weekly Reflections
// =============================================================================
export function getWeeklyReflection(weekStart: string): WeeklyReflection {
  ensureInitialized();
  const list = read<WeeklyReflection[]>(K.weeklyReflections, []);
  return (
    list.find((r) => r.weekStart === weekStart) || {
      weekStart,
      threeWords: '',
      proudMoments: '',
      struggles: '',
      learned: '',
    }
  );
}

export function saveWeeklyReflection(r: WeeklyReflection): void {
  const list = read<WeeklyReflection[]>(K.weeklyReflections, []);
  const idx = list.findIndex((w) => w.weekStart === r.weekStart);
  if (idx >= 0) list[idx] = r;
  else list.push(r);
  write(K.weeklyReflections, list);
}

// =============================================================================
// References
// =============================================================================
export function getReferences(): Reference[] {
  ensureInitialized();
  const list = read<Reference[]>(K.references, []);
  return list.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createReference(data: Partial<Reference>): Reference {
  const list = getReferences();
  const ref: Reference = {
    id: uid(),
    title: data.title || 'Nova referência',
    url: data.url || null,
    description: data.description || null,
    category: data.category || 'other',
    createdAt: new Date().toISOString(),
  };
  list.unshift(ref);
  write(K.references, list);
  return ref;
}

export function updateReference(id: string, data: Partial<Reference>): Reference | null {
  const list = getReferences();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data, id };
  write(K.references, list);
  return list[idx];
}

export function deleteReference(id: string): void {
  const list = getReferences().filter((r) => r.id !== id);
  write(K.references, list);
}

// =============================================================================
// Stats
// =============================================================================
export function getStats(): {
  routines: number;
  tasks: number;
  completedToday: number;
  dailyCompletions: { date: string; count: number }[];
} {
  const routines = getRoutines();
  const today = todayISO();
  let totalTasks = 0;
  let completedToday = 0;
  for (const r of routines) {
    totalTasks += r.tasks.length;
    for (const t of r.tasks) {
      if (t.completions.some((c) => c.date === today)) completedToday++;
    }
  }

  // Last 7 days
  const dailyCompletions: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    let count = 0;
    for (const r of routines) {
      for (const t of r.tasks) {
        if (t.completions.some((c) => c.date === iso)) count++;
      }
    }
    dailyCompletions.push({ date: iso, count });
  }

  return {
    routines: routines.length,
    tasks: totalTasks,
    completedToday,
    dailyCompletions,
  };
}

// =============================================================================
// Utilities
// =============================================================================
function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// =============================================================================
// Default data (equivalente ao seed)
// =============================================================================
const ALL_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

function mkTasks(routineId: string, arr: Omit<Task, 'id' | 'routineId' | 'completions'>[]): Task[] {
  return arr.map((t) => ({ ...t, id: uid(), routineId, completions: [] }));
}

const R1 = uid(), R2 = uid(), R3 = uid(), R4 = uid(), R5 = uid();

const DEFAULT_ROUTINES: Routine[] = [
  {
    id: R1,
    title: 'High Energy / Energia Alta ⚡',
    description: 'Atividades que exigem foco total e alta energia. Faça quando estiver no pico de disposição!',
    color: '#10B981',
    icon: 'zap',
    energyLevel: 'high',
    sortOrder: 0,
    isActive: true,
    tasks: mkTasks(R1, [
      { title: 'Ver vídeos no YouTube com legenda no idioma e traduzir e anotar palavras importantes', timeOfDay: '05:00', daysOfWeek: WEEKDAYS, priority: 'high', sortOrder: 0, description: '' },
      { title: 'Estudar meus vídeos', timeOfDay: '06:00', daysOfWeek: WEEKDAYS, priority: 'high', sortOrder: 1, description: '' },
      { title: 'Fazer vídeos', timeOfDay: '07:00', daysOfWeek: ['monday', 'wednesday', 'friday'], priority: 'high', sortOrder: 2, description: '' },
      { title: 'Roleplay | conversas comuns, emprego e rotina', timeOfDay: '08:00', daysOfWeek: WEEKDAYS, priority: 'high', sortOrder: 3, description: '' },
      { title: 'Assistir TV Garden', timeOfDay: '09:00', daysOfWeek: WEEKDAYS, priority: 'medium', sortOrder: 4, description: '' },
    ]),
  },
  {
    id: R2,
    title: 'Medium Energy / Energia Média 🟡',
    description: 'Atividades de imersão passiva. Boas para momentos de energia moderada.',
    color: '#F59E0B',
    icon: 'headphones',
    energyLevel: 'medium',
    sortOrder: 1,
    isActive: true,
    tasks: mkTasks(R2, [
      { title: 'Ouvir áudios, vídeos ou Radio Garden', timeOfDay: '', daysOfWeek: ALL_DAYS, priority: 'medium', sortOrder: 0, description: '' },
      { title: 'Escutar vídeos', timeOfDay: '', daysOfWeek: ALL_DAYS, priority: 'medium', sortOrder: 1, description: '' },
      { title: 'Jogar em inglês', timeOfDay: '', daysOfWeek: ALL_DAYS, priority: 'low', sortOrder: 2, description: '' },
      { title: 'Assistir filmes e séries', timeOfDay: '', daysOfWeek: ALL_DAYS, priority: 'medium', sortOrder: 3, description: '' },
    ]),
  },
  {
    id: R3,
    title: 'Low Energy / Energia Baixa 🔵',
    description: 'Atividades leves para quando estiver cansado. Mantenha o contato com o idioma mesmo nos dias difíceis.',
    color: '#3B82F6',
    icon: 'coffee',
    energyLevel: 'low',
    sortOrder: 2,
    isActive: true,
    tasks: mkTasks(R3, [
      { title: 'Ler no Quora', timeOfDay: '', daysOfWeek: ALL_DAYS, priority: 'low', sortOrder: 0, description: '' },
      { title: 'Escutar Radio Garden', timeOfDay: '', daysOfWeek: ALL_DAYS, priority: 'low', sortOrder: 1, description: '' },
      { title: 'Escutar áudios', timeOfDay: '', daysOfWeek: ALL_DAYS, priority: 'low', sortOrder: 2, description: '' },
    ]),
  },
  {
    id: R4,
    title: 'Tarefas Diárias 📝',
    description: 'Tarefas fixas do planejador diário para manter a consistência nos estudos.',
    color: '#7C3AED',
    icon: 'calendar',
    energyLevel: 'high',
    sortOrder: 3,
    isActive: true,
    tasks: mkTasks(R4, [
      { title: 'Assistir 30 min de vídeos em inglês | 5am antes do trabalho', timeOfDay: '05:00', daysOfWeek: [...WEEKDAYS, 'saturday'], priority: 'high', sortOrder: 0, description: '' },
      { title: 'Estudar meus vídeos', timeOfDay: '06:00', daysOfWeek: WEEKDAYS, priority: 'high', sortOrder: 1, description: '' },
      { title: 'Escutar vídeos ou Radio Garden indo para o trabalho', timeOfDay: '07:30', daysOfWeek: WEEKDAYS, priority: 'medium', sortOrder: 2, description: '' },
      { title: 'Fazer arte da conversação antes do trabalho', timeOfDay: '07:00', daysOfWeek: ['tuesday', 'thursday'], priority: 'high', sortOrder: 3, description: '' },
      { title: 'Roleplay sobre atendimento no trabalho', timeOfDay: '08:00', daysOfWeek: WEEKDAYS, priority: 'high', sortOrder: 4, description: '' },
    ]),
  },
  {
    id: R5,
    title: 'Role Play 🎭',
    description: 'Prática de situações reais no idioma. Simule conversas do dia a dia!',
    color: '#EC4899',
    icon: 'users',
    energyLevel: 'high',
    sortOrder: 4,
    isActive: true,
    tasks: mkTasks(R5, [
      { title: 'Roleplay - Situações no trabalho', timeOfDay: '', daysOfWeek: ['monday', 'wednesday', 'friday'], priority: 'high', sortOrder: 0, description: '' },
      { title: 'Roleplay - Situações na universidade', timeOfDay: '', daysOfWeek: ['tuesday', 'thursday'], priority: 'high', sortOrder: 1, description: '' },
      { title: 'Roleplay - Conversas do cotidiano', timeOfDay: '', daysOfWeek: WEEKDAYS, priority: 'medium', sortOrder: 2, description: '' },
    ]),
  },
];

const DEFAULT_HABITS: Habit[] = [
  { id: uid(), name: 'Listening 🎧', color: '#8B5CF6', icon: 'headphones', sortOrder: 0, entries: [] },
  { id: uid(), name: 'Speaking 🗣️', color: '#EC4899', icon: 'mic', sortOrder: 1, entries: [] },
  { id: uid(), name: 'Reading 📖', color: '#10B981', icon: 'book', sortOrder: 2, entries: [] },
  { id: uid(), name: 'Writing ✍️', color: '#F59E0B', icon: 'pen', sortOrder: 3, entries: [] },
];

const DEFAULT_REFERENCES: Reference[] = [
  { id: uid(), title: 'Easy English', url: 'https://www.youtube.com/@EasyEnglishVideos', description: 'Canal no YouTube com entrevistas na rua em inglês simples', category: 'youtube', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Rachel\'s English', url: 'https://www.youtube.com/@rachelsenglish', description: 'Pronúncia americana detalhada', category: 'youtube', createdAt: new Date().toISOString() },
  { id: uid(), title: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish', description: 'Gramática, vocabulário e notícias', category: 'website', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Radio Garden', url: 'https://radio.garden', description: 'Rádios do mundo todo ao vivo para imersão', category: 'radio', createdAt: new Date().toISOString() },
  { id: uid(), title: 'TV Garden', url: 'https://tv.garden', description: 'TVs ao vivo do mundo todo', category: 'website', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Quora', url: 'https://www.quora.com', description: 'Leitura de perguntas e respostas em inglês', category: 'website', createdAt: new Date().toISOString() },
  { id: uid(), title: 'The Ellen Show', url: 'https://www.youtube.com/@theellenshow', description: 'Entrevistas em inglês informal', category: 'youtube', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Peppa Pig (English)', url: 'https://www.youtube.com/@PeppaPigOfficial', description: 'Ótimo para iniciantes — inglês simples e falado devagar', category: 'youtube', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Taylor Swift', description: 'Letras claras — boa para ouvir e cantar', category: 'music', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Ed Sheeran', description: 'Letras melancólicas com pronúncia britânica', category: 'music', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Friends (série)', description: 'Clássico para aprender inglês conversacional', category: 'film', createdAt: new Date().toISOString() },
  { id: uid(), title: 'The Office (US)', description: 'Inglês de escritório e humor seco', category: 'film', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Harry Potter (livros)', description: 'Comece pelo 1º volume — vocabulário rico e história envolvente', category: 'book', createdAt: new Date().toISOString() },
];
