'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarViewProps {
  routines: any[];
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function CalendarView({ routines }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now.toISOString().split('T')[0]);
  }, []);

  const days = useMemo(() => {
    if (!currentMonth) return [];
    return getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  }, [currentMonth]);

  const firstDayOfWeek = useMemo(() => {
    if (!currentMonth) return 0;
    return currentMonth.getDay();
  }, [currentMonth]);

  // Build completion map from routines
  const completionMap = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    routines.forEach((r: any) => {
      r.tasks?.forEach((t: any) => {
        t.completions?.forEach((c: any) => {
          if (!map[c.date]) map[c.date] = { total: 0, completed: 0 };
          map[c.date].completed += 1;
        });
      });
    });
    // count total tasks per date
    const allTasks = routines.flatMap((r: any) => r.tasks || []);
    days.forEach((d) => {
      const dateStr = d.toISOString().split('T')[0];
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][d.getDay()];
      const tasksForDay = allTasks.filter((t: any) => 
        t.daysOfWeek?.length === 0 || t.daysOfWeek?.includes(dayName)
      );
      if (!map[dateStr]) map[dateStr] = { total: 0, completed: 0 };
      map[dateStr].total = tasksForDay.length;
    });
    return map;
  }, [routines, days]);

  // Tasks for selected date
  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return [];
    const d = new Date(selectedDate + 'T12:00:00');
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][d.getDay()];
    const tasks: any[] = [];
    routines.forEach((r: any) => {
      (r.tasks || []).forEach((t: any) => {
        if (t.daysOfWeek?.length === 0 || t.daysOfWeek?.includes(dayName)) {
          const isCompleted = t.completions?.some((c: any) => c.date === selectedDate);
          tasks.push({ ...t, routineTitle: r.title, routineColor: r.color, isCompletedOnDate: isCompleted });
        }
      });
    });
    return tasks.sort((a: any, b: any) => (a.timeOfDay || '').localeCompare(b.timeOfDay || ''));
  }, [selectedDate, routines]);

  if (!currentMonth) return null;

  const changeMonth = (offset: number) => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + offset);
    setCurrentMonth(next);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">\ud83d\udcc6</span> Calendário
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Visão mensal das suas tarefas e conclusões</p>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-display font-bold text-xl">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0 bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        {/* Day headers */}
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-muted-foreground bg-muted/40 border-b border-border/30">
            {d}
          </div>
        ))}

        {/* Empty cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[80px] md:min-h-[100px] border-b border-r border-border/20 bg-muted/10" />
        ))}

        {/* Day cells */}
        {days.map((d) => {
          const dateStr = d.toISOString().split('T')[0];
          const info = completionMap[dateStr];
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;
          const completionPct = info && info.total > 0 ? Math.round((info.completed / info.total) * 100) : 0;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`min-h-[80px] md:min-h-[100px] p-2 border-b border-r border-border/20 text-left transition-colors relative ${
                isSelected ? 'bg-primary/5 ring-2 ring-primary/30 ring-inset' : 'hover:bg-muted/30'
              }`}
            >
              <span className={`text-sm font-mono ${
                isToday ? 'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center font-bold' : 'text-foreground'
              }`}>
                {d.getDate()}
              </span>
              {info && info.total > 0 && (
                <div className="mt-1">
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        completionPct >= 80 ? 'bg-green-500' :
                        completionPct >= 50 ? 'bg-yellow-500' :
                        completionPct > 0 ? 'bg-orange-500' : 'bg-muted'
                      }`}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    {info.completed}/{info.total}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date tasks */}
      {selectedDate && (
        <motion.div
          key={selectedDate}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h3 className="font-semibold text-lg mb-4">
            Tarefas de {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          {selectedDayTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma tarefa agendada para este dia.</p>
          ) : (
            <div className="grid gap-2">
              {selectedDayTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-card rounded-lg border border-border/50 p-3"
                >
                  {task.isCompletedOnDate ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className={`text-sm ${task.isCompletedOnDate ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">{task.routineTitle}</span>
                  </div>
                  {task.timeOfDay && (
                    <span className="text-xs text-muted-foreground font-mono">{task.timeOfDay}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
