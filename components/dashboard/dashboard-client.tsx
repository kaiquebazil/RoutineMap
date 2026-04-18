'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, LayoutDashboard, Calendar, CalendarDays,
  BarChart3, Menu, X, RotateCcw,
  Target, ClipboardList, MessageSquareText, BookOpen, Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { RoutinesList } from '@/components/dashboard/routines-list';
import { RoutineModal } from '@/components/dashboard/routine-modal';
import { TaskModal } from '@/components/dashboard/task-modal';
import { StatsPanel } from '@/components/dashboard/stats-panel';
import { DailyView } from '@/components/dashboard/daily-view';
import { HabitTracker } from '@/components/dashboard/habit-tracker';
import { DailyPlanner } from '@/components/dashboard/daily-planner';
import { WeeklyReflection } from '@/components/dashboard/weekly-reflection';
import { ReferencesPanel } from '@/components/dashboard/references-panel';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { toast } from 'sonner';
import * as storage from '@/lib/storage';

type ViewType = 'routines' | 'daily' | 'stats' | 'habits' | 'planner' | 'reflection' | 'references' | 'calendar';

export function DashboardClient() {
  const [routines, setRoutines] = useState<storage.Routine[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof storage.getStats> | null>(null);
  const [view, setView] = useState<ViewType>('routines');
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<storage.Routine | null>(null);
  const [editingTask, setEditingTask] = useState<storage.Task | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const refresh = useCallback(() => {
    setRoutines(storage.getRoutines());
    setStats(storage.getStats());
    setLoading(false);
  }, []);

  useEffect(() => {
    storage.ensureInitialized();
    refresh();
  }, [refresh]);

  const handleCreateRoutine = (data: any) => {
    storage.createRoutine(data);
    toast.success('Rotina criada com sucesso!');
    refresh();
    setShowRoutineModal(false);
  };

  const handleUpdateRoutine = (id: string, data: any) => {
    storage.updateRoutine(id, data);
    toast.success('Rotina atualizada!');
    refresh();
    setShowRoutineModal(false);
    setEditingRoutine(null);
  };

  const handleDeleteRoutine = (id: string) => {
    storage.deleteRoutine(id);
    toast.success('Rotina excluída!');
    refresh();
  };

  const handleCreateTask = (data: any) => {
    if (!selectedRoutineId) return;
    storage.createTask(selectedRoutineId, data);
    toast.success('Tarefa criada!');
    refresh();
    setShowTaskModal(false);
  };

  const handleUpdateTask = (id: string, data: any) => {
    storage.updateTask(id, data);
    toast.success('Tarefa atualizada!');
    refresh();
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    storage.deleteTask(id);
    toast.success('Tarefa excluída!');
    refresh();
  };

  const handleToggleTask = (taskId: string) => {
    storage.toggleTaskCompletion(taskId);
    refresh();
  };

  const handleResetAll = () => {
    storage.resetAllData();
    toast.success('Dados restaurados ao padrão!');
    refresh();
    setShowResetConfirm(false);
  };

  const navItems = [
    { id: 'routines' as ViewType, label: 'Rotinas', icon: LayoutDashboard },
    { id: 'daily' as ViewType, label: 'Hoje', icon: Calendar },
    { id: 'planner' as ViewType, label: 'Planner', icon: ClipboardList },
    { id: 'habits' as ViewType, label: 'Hábitos', icon: Target },
    { id: 'calendar' as ViewType, label: 'Calendário', icon: CalendarDays },
    { id: 'reflection' as ViewType, label: 'Reflexão', icon: MessageSquareText },
    { id: 'references' as ViewType, label: 'Referências', icon: BookOpen },
    { id: 'stats' as ViewType, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Languages className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block">Routine Map</span>
          </div>

          <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto max-w-[600px] lg:max-w-none">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={view === item.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView(item.id)}
                className={`text-xs px-2.5 whitespace-nowrap ${view === item.id ? 'bg-accent text-accent-foreground' : ''}`}
              >
                <item.icon className="w-3.5 h-3.5 mr-1" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              title="Restaurar dados padrão"
              onClick={() => setShowResetConfirm(true)}
              className="hidden sm:inline-flex"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              className="md:hidden border-t border-border bg-background px-4 py-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={view === item.id ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => { setView(item.id); setMobileMenu(false); }}
                    className="justify-start"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setShowResetConfirm(true); setMobileMenu(false); }}
                  className="justify-start text-destructive"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restaurar dados padrão
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'routines' && (
            <motion.div
              key="routines"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Mapa de Rotinas</h1>
                  <p className="text-muted-foreground text-sm mt-1">Organize seus estudos de idiomas por nível de energia</p>
                </div>
                <Button onClick={() => { setEditingRoutine(null); setShowRoutineModal(true); }}>
                  <Plus className="w-4 h-4 mr-1.5" /> Nova Rotina
                </Button>
              </div>
              <RoutinesList
                routines={routines}
                loading={loading}
                onEditRoutine={(r: any) => { setEditingRoutine(r); setShowRoutineModal(true); }}
                onDeleteRoutine={handleDeleteRoutine}
                onAddTask={(routineId: string) => { setSelectedRoutineId(routineId); setEditingTask(null); setShowTaskModal(true); }}
                onEditTask={(t: any) => { setEditingTask(t); setShowTaskModal(true); }}
                onDeleteTask={handleDeleteTask}
                onToggleTask={handleToggleTask}
              />
            </motion.div>
          )}

          {view === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DailyView
                routines={routines}
                onToggleTask={handleToggleTask}
              />
            </motion.div>
          )}

          {view === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StatsPanel stats={stats} routines={routines} />
            </motion.div>
          )}

          {view === 'habits' && (
            <motion.div
              key="habits"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HabitTracker />
            </motion.div>
          )}

          {view === 'planner' && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DailyPlanner />
            </motion.div>
          )}

          {view === 'reflection' && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <WeeklyReflection />
            </motion.div>
          )}

          {view === 'references' && (
            <motion.div
              key="references"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReferencesPanel />
            </motion.div>
          )}

          {view === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CalendarView routines={routines} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      {showRoutineModal && (
        <RoutineModal
          routine={editingRoutine}
          onClose={() => { setShowRoutineModal(false); setEditingRoutine(null); }}
          onSave={(data: any) => {
            if (editingRoutine?.id) {
              handleUpdateRoutine(editingRoutine.id, data);
            } else {
              handleCreateRoutine(data);
            }
          }}
        />
      )}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
          onSave={(data: any) => {
            if (editingTask?.id) {
              handleUpdateTask(editingTask.id, data);
            } else {
              handleCreateTask(data);
            }
          }}
        />
      )}

      {showResetConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="bg-card border border-border rounded-xl shadow-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold mb-2">Restaurar dados padrão?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Todos os seus dados atuais (rotinas, hábitos, notas, referências) serão apagados e substituídos pelos dados iniciais do template. Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleResetAll}>Restaurar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
