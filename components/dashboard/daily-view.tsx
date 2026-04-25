'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, Clock, Zap, Sun, Sunrise, Moon } from 'lucide-react';

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function getTimeIcon(time: string | null | undefined) {
  if (!time) return Sun;
  const hour = parseInt(time?.split?.(':')?.[0] ?? '12', 10);
  if (hour < 12) return Sunrise;
  if (hour < 18) return Sun;
  return Moon;
}

interface Props {
  routines: any[];
  onToggleTask: (id: string) => void;
}

export function DailyView({ routines, onToggleTask }: Props) {
  const [dayIndex, setDayIndex] = useState(0);

  useEffect(() => {
    setDayIndex(new Date().getDay());
  }, []);

  const todayKey = DAY_KEYS[dayIndex] ?? 'mon';

  const todayTasks: any[] = [];
  (routines ?? [])?.forEach?.((routine: any) => {
    (routine?.tasks ?? [])?.forEach?.((task: any) => {
      const days = task?.daysOfWeek ?? [];
      if (days?.length === 0 || days?.includes?.(todayKey)) {
        todayTasks.push({ ...task, routineTitle: routine?.title, routineColor: routine?.color });
      }
    });
  });

  const sortedTasks = [...(todayTasks ?? [])].sort((a: any, b: any) => {
    const timeA = a?.timeOfDay ?? '99:99';
    const timeB = b?.timeOfDay ?? '99:99';
    return timeA < timeB ? -1 : timeA > timeB ? 1 : 0;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const completedCount = sortedTasks?.filter?.((t: any) => t?.completions?.some((c: any) => c.date === todayStr))?.length ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="w-7 h-7 text-primary" />
          Tarefas de Hoje
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {DAY_NAMES[dayIndex] ?? ''} &middot; {completedCount} de {sortedTasks?.length ?? 0} concluídas
        </p>
      </div>

      {(sortedTasks?.length ?? 0) > 0 && (
        <div className="mb-6 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(sortedTasks?.length ?? 0) > 0 ? (completedCount / (sortedTasks?.length ?? 1)) * 100 : 0}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      )}

      {(sortedTasks?.length ?? 0) === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Dia livre!</h3>
          <p className="text-muted-foreground text-sm">Nenhuma tarefa programada para hoje</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {sortedTasks?.map?.((task: any, idx: number) => {
            const isCompleted = task?.completions?.some((c: any) => c.date === todayStr);
            const TimeIcon = getTimeIcon(task?.timeOfDay);
            return (
              <motion.div
                key={task?.id ?? idx}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                  isCompleted ? 'bg-accent/30' : 'bg-card hover:bg-accent/20'
                }`}
                style={{ boxShadow: 'var(--shadow-sm)' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onToggleTask?.(task?.id)}
              >
                <button className="flex-shrink-0 transition-transform hover:scale-110">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {task?.title ?? ''}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${task?.routineColor ?? '#7C3AED'}20`, color: task?.routineColor ?? '#7C3AED' }}
                    >
                      {task?.routineTitle ?? ''}
                    </span>
                    {task?.timeOfDay && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <TimeIcon className="w-3 h-3" />
                        {task.timeOfDay}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          }) ?? []}
        </div>
      )}
    </div>
  );
}
