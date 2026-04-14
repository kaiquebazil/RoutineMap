'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Plus, LogOut, LayoutDashboard, Zap, Calendar, CalendarDays,
  CheckCircle2, BarChart3, Settings, Menu, X, ChevronRight,
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

type ViewType = 'routines' | 'daily' | 'stats' | 'habits' | 'planner' | 'reflection' | 'references' | 'calendar';

export function DashboardClient() {
  const { data: session } = useSession() || {};
  const [routines, setRoutines] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [view, setView] = useState<ViewType>('routines');
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  const fetchRoutines = useCallback(async () => {
    try {
      const res = await fetch('/api/routines');
      if (res?.ok) {
        const data = await res?.json?.();
        setRoutines(data ?? []);
      }
    } catch (err: any) {
      console.error('Fetch routines error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res?.ok) {
        const data = await res?.json?.();
        setStats(data);
      }
    } catch (err: any) {
      console.error('Fetch stats error:', err);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
    fetchStats();
  }, [fetchRoutines, fetchStats]);

  const handleCreateRoutine = async (data: any) => {
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res?.ok) {
        toast.success('Rotina criada com sucesso!');
        fetchRoutines();
        fetchStats();
        setShowRoutineModal(false);
      } else {
        const err = await res?.json?.();
        toast.error(err?.error ?? 'Erro ao criar rotina');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao criar rotina');
    }
  };

  const handleUpdateRoutine = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/routines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res?.ok) {
        toast.success('Rotina atualizada!');
        fetchRoutines();
        setShowRoutineModal(false);
        setEditingRoutine(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao atualizar rotina');
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' });
      if (res?.ok) {
        toast.success('Rotina excluída!');
        fetchRoutines();
        fetchStats();
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao excluir rotina');
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, routineId: selectedRoutineId }),
      });
      if (res?.ok) {
        toast.success('Tarefa criada!');
        fetchRoutines();
        fetchStats();
        setShowTaskModal(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao criar tarefa');
    }
  };

  const handleUpdateTask = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res?.ok) {
        toast.success('Tarefa atualizada!');
        fetchRoutines();
        setShowTaskModal(false);
        setEditingTask(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res?.ok) {
        toast.success('Tarefa excluída!');
        fetchRoutines();
        fetchStats();
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao excluir tarefa');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/toggle`, { method: 'POST' });
      if (res?.ok) {
        fetchRoutines();
        fetchStats();
      }
    } catch (err: any) {
      console.error(err);
    }
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
            {navItems?.map?.((item: any) => (
              <Button
                key={item?.id}
                variant={view === item?.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView(item?.id)}
                className={`text-xs px-2.5 whitespace-nowrap ${view === item?.id ? 'bg-accent text-accent-foreground' : ''}`}
              >
                <item.icon className="w-3.5 h-3.5 mr-1" />
                {item?.label}
              </Button>
            )) ?? []}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session?.user?.name ?? session?.user?.email ?? ''}
            </span>
            <Button variant="ghost" size="sm" onClick={() => signOut?.({ callbackUrl: '/' })}>
              <LogOut className="w-4 h-4" />
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
                {navItems?.map?.((item: any) => (
                  <Button
                    key={item?.id}
                    variant={view === item?.id ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => { setView(item?.id); setMobileMenu(false); }}
                    className="justify-start"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item?.label}
                  </Button>
                )) ?? []}
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
    </div>
  );
}
