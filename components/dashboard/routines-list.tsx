'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Zap, ZapOff, Battery, BatteryMedium, BatteryFull,
  Edit, Trash2, Plus, CheckCircle2, Circle, ChevronDown, ChevronUp,
  MoreVertical, Flame, Snowflake, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const ICON_MAP: Record<string, any> = {
  calendar: Calendar,
  clock: Clock,
  zap: Zap,
  flame: Flame,
  snowflake: Snowflake,
  sun: Sun,
};

const ENERGY_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  high: { label: 'Alta', color: 'hsl(var(--energy-high))', icon: BatteryFull },
  medium: { label: 'Média', color: 'hsl(var(--energy-medium))', icon: BatteryMedium },
  low: { label: 'Baixa', color: 'hsl(var(--energy-low))', icon: Battery },
};

const PRIORITY_CONFIG: Record<string, { label: string; variant: any }> = {
  high: { label: 'Alta', variant: 'destructive' },
  medium: { label: 'Média', variant: 'default' },
  low: { label: 'Baixa', variant: 'secondary' },
};

const DAYS_MAP: Record<string, string> = {
  mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom',
};

interface Props {
  routines: any[];
  loading: boolean;
  onEditRoutine: (r: any) => void;
  onDeleteRoutine: (id: string) => void;
  onAddTask: (routineId: string) => void;
  onEditTask: (t: any) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

export function RoutinesList({
  routines,
  loading,
  onEditRoutine,
  onDeleteRoutine,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
}: Props) {
  const [expandedRoutines, setExpandedRoutines] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRoutines((prev: any) => ({ ...(prev ?? {}), [id]: !(prev?.[id]) }));
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3]?.map?.((i: number) => (
          <div key={i} className="bg-card rounded-xl p-6 animate-pulse" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="h-6 bg-muted rounded w-1/3 mb-3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        )) ?? []}
      </div>
    );
  }

  if ((routines?.length ?? 0) === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">Nenhuma rotina ainda</h3>
        <p className="text-muted-foreground text-sm mb-6">Crie sua primeira rotina para começar a organizar seu dia</p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4">
      {routines?.map?.((routine: any, idx: number) => {
        const IconComp = ICON_MAP[routine?.icon ?? 'calendar'] ?? Calendar;
        const energy = ENERGY_CONFIG[routine?.energyLevel ?? 'medium'] ?? ENERGY_CONFIG.medium;
        const EnergyIcon = energy?.icon ?? BatteryMedium;
        const tasks = routine?.tasks ?? [];
        const completedCount = tasks?.filter?.((t: any) => (t?.completions?.length ?? 0) > 0)?.length ?? 0;
        const totalCount = tasks?.length ?? 0;
        const isExpanded = expandedRoutines?.[routine?.id] ?? false;

        return (
          <motion.div
            key={routine?.id ?? idx}
            className="bg-card rounded-xl overflow-hidden transition-all"
            style={{ boxShadow: 'var(--shadow-md)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            {/* Routine header */}
            <div
              className="p-5 cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => toggleExpand(routine?.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${routine?.color ?? '#7C3AED'}20` }}
                  >
                    <IconComp className="w-5 h-5" style={{ color: routine?.color ?? '#7C3AED' }} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg">{routine?.title ?? 'Sem título'}</h3>
                    {routine?.description && (
                      <p className="text-muted-foreground text-sm mt-0.5">{routine.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-xs">
                        <EnergyIcon className="w-3.5 h-3.5" style={{ color: energy?.color }} />
                        <span className="text-muted-foreground">Energia {energy?.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {completedCount}/{totalCount} hoje
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: any) => { e?.stopPropagation?.(); onEditRoutine?.(routine); }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: any) => {
                      e?.stopPropagation?.();
                      if (confirmDelete === routine?.id) {
                        onDeleteRoutine?.(routine?.id);
                        setConfirmDelete(null);
                      } else {
                        setConfirmDelete(routine?.id);
                        setTimeout(() => setConfirmDelete(null), 3000);
                      }
                    }}
                    className={confirmDelete === routine?.id ? 'text-destructive' : ''}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
              {/* Progress bar */}
              {totalCount > 0 && (
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: routine?.color ?? '#7C3AED' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>

            {/* Tasks list */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-border/50">
                    <div className="pt-4 space-y-2">
                      {tasks?.map?.((task: any, tIdx: number) => {
                        const isCompleted = (task?.completions?.length ?? 0) > 0;
                        const priority = PRIORITY_CONFIG[task?.priority ?? 'medium'] ?? PRIORITY_CONFIG.medium;
                        return (
                          <motion.div
                            key={task?.id ?? tIdx}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              isCompleted ? 'bg-accent/30' : 'bg-muted/30 hover:bg-muted/50'
                            }`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: tIdx * 0.05 }}
                          >
                            <button
                              onClick={() => onToggleTask?.(task?.id)}
                              className="flex-shrink-0 transition-transform hover:scale-110"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                {task?.title ?? ''}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {task?.timeOfDay && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {task.timeOfDay}
                                  </span>
                                )}
                                {(task?.daysOfWeek?.length ?? 0) > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    {task.daysOfWeek?.map?.((d: string) => DAYS_MAP[d] ?? d)?.join?.(', ') ?? ''}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge variant={priority?.variant ?? 'default'} className="text-xs">
                              {priority?.label}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => onEditTask?.(task)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onDeleteTask?.(task?.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </motion.div>
                        );
                      }) ?? []}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => onAddTask?.(routine?.id)}
                    >
                      <Plus className="w-4 h-4 mr-1.5" /> Adicionar tarefa
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      }) ?? []}
    </div>
  );
}
