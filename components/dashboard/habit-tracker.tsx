'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Target, Check, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Habit {
  id: string;
  name: string;
  color: string;
  entries: { id: string; date: string; completed: boolean }[];
}

function getWeekDates(): { label: string; short: string; date: string; isToday: boolean }[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({
      label: days[i],
      short: days[i],
      date: dateStr,
      isToday: dateStr === today.toISOString().split('T')[0],
    });
  }
  return result;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabitName, setNewHabitName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [weekDates, setWeekDates] = useState<ReturnType<typeof getWeekDates>>([]);

  useEffect(() => {
    setWeekDates(getWeekDates());
  }, []);

  const fetchHabits = useCallback(async () => {
    try {
      const res = await fetch('/api/habits');
      if (res.ok) {
        const data = await res.json();
        setHabits(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newHabitName.trim() }),
      });
      if (res.ok) {
        toast.success('Hábito adicionado!');
        setNewHabitName('');
        setShowAdd(false);
        fetchHabits();
      }
    } catch (err) {
      toast.error('Erro ao adicionar hábito');
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      const res = await fetch(`/api/habits/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Hábito removido!');
        fetchHabits();
      }
    } catch (err) {
      toast.error('Erro ao remover hábito');
    }
  };

  const handleToggle = async (habitId: string, date: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      if (res.ok) {
        fetchHabits();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isCompleted = (habit: Habit, date: string) => {
    return habit.entries?.some((e) => e.date === date);
  };

  const getWeekProgress = (habit: Habit) => {
    if (weekDates.length === 0) return 0;
    const completed = weekDates.filter((d) => isCompleted(habit, d.date)).length;
    return Math.round((completed / 7) * 100);
  };

  if (weekDates.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">✅</span> Rastreador de Hábitos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Acompanhe as 4 competências: Listening, Speaking, Reading e Writing</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Novo Hábito
        </Button>
      </div>

      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 flex gap-2"
        >
          <Input
            placeholder="Nome do hábito (ex: Leitura, Exercício...)"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
            className="flex-1"
          />
          <Button onClick={handleAddHabit} size="sm">Adicionar</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Carregando...</div>
      ) : habits.length === 0 ? (
        <div className="text-center py-16">
          <Target className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum hábito cadastrado ainda.</p>
          <p className="text-muted-foreground text-sm">Clique em "Novo Hábito" para começar!</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_repeat(7,48px)_60px] md:grid-cols-[1fr_repeat(7,64px)_80px] gap-0 bg-muted/50 border-b border-border/50">
            <div className="px-4 py-3 text-sm font-semibold text-muted-foreground">Competência / Hábito</div>
            {weekDates.map((d) => (
              <div
                key={d.date}
                className={`flex flex-col items-center justify-center py-3 text-xs font-medium ${
                  d.isToday ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}
              >
                <span>{d.short}</span>
                <span className={`text-[10px] mt-0.5 ${d.isToday ? 'bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center' : ''}`}>
                  {new Date(d.date + 'T12:00:00').getDate()}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-center py-3 text-xs font-medium text-muted-foreground">%</div>
          </div>

          {/* Rows */}
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-[1fr_repeat(7,48px)_60px] md:grid-cols-[1fr_repeat(7,64px)_80px] gap-0 border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors group"
            >
              <div className="px-4 py-3 flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium truncate">{habit.name}</span>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {weekDates.map((d) => {
                const done = isCompleted(habit, d.date);
                return (
                  <button
                    key={d.date}
                    onClick={() => handleToggle(habit.id, d.date)}
                    className="flex items-center justify-center py-3 transition-all"
                  >
                    <div
                      className={`w-6 h-6 md:w-7 md:h-7 rounded-md border-2 flex items-center justify-center transition-all ${
                        done
                          ? 'bg-primary border-primary text-primary-foreground scale-105'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {done && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
              <div className="flex items-center justify-center py-3">
                <span className={`text-xs font-mono font-bold ${
                  getWeekProgress(habit) >= 80 ? 'text-green-500' :
                  getWeekProgress(habit) >= 50 ? 'text-yellow-500' : 'text-muted-foreground'
                }`}>
                  {getWeekProgress(habit)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
