'use client';

import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Calendar, Zap, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / (duration / 16)));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [value, duration]);
  return <span className="font-mono">{display}</span>;
}

interface Props {
  stats: any;
  routines: any[];
}

export function StatsPanel({ stats, routines }: Props) {
  const last7 = stats?.last7days ?? [];
  const maxCount = Math.max(1, ...last7?.map?.((d: any) => d?.count ?? 0) ?? [1]);

  const totalTasks = routines?.reduce?.(
    (sum: number, r: any) => sum + (r?.tasks?.length ?? 0),
    0
  ) ?? 0;

  const totalCompletedToday = routines?.reduce?.(
    (sum: number, r: any) =>
      sum + ((r?.tasks ?? [])?.filter?.((t: any) => (t?.completions?.length ?? 0) > 0)?.length ?? 0),
    0
  ) ?? 0;

  const completionRate = totalTasks > 0 ? Math.round((totalCompletedToday / totalTasks) * 100) : 0;

  const energyCounts: Record<string, number> = { high: 0, medium: 0, low: 0 };
  (routines ?? [])?.forEach?.((r: any) => {
    const key = r?.energyLevel ?? 'medium';
    if (key === 'high' || key === 'medium' || key === 'low') {
      energyCounts[key] = (energyCounts[key] ?? 0) + (r?.tasks?.length ?? 0);
    }
  });

  const statCards = [
    { label: 'Rotinas', value: stats?.routines ?? 0, icon: Calendar, color: 'text-primary' },
    { label: 'Tarefas', value: stats?.tasks ?? 0, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Hoje', value: stats?.todayCompletions ?? 0, icon: TrendingUp, color: 'text-amber-500' },
    { label: 'Taxa Hoje', value: completionRate, icon: BarChart3, color: 'text-blue-500', suffix: '%' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary" />
          Estatísticas
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe seu progresso e consistência</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards?.map?.((card: any, i: number) => (
          <motion.div
            key={card?.label ?? i}
            className="bg-card rounded-xl p-5"
            style={{ boxShadow: 'var(--shadow-md)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-5 h-5 ${card?.color ?? ''}`} />
              <span className="text-sm text-muted-foreground">{card?.label}</span>
            </div>
            <p className="text-3xl font-bold">
              <AnimatedNumber value={card?.value ?? 0} />
              {card?.suffix ?? ''}
            </p>
          </motion.div>
        )) ?? []}
      </div>

      {/* Weekly chart */}
      <motion.div
        className="bg-card rounded-xl p-6 mb-8"
        style={{ boxShadow: 'var(--shadow-md)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-display font-semibold text-lg mb-4">Concluísões - Últimos 7 dias</h3>
        <div className="flex items-end gap-2 h-40">
          {last7?.map?.((day: any, i: number) => {
            const height = maxCount > 0 ? ((day?.count ?? 0) / maxCount) * 100 : 0;
            const dateStr = day?.date ?? '';
            const label = dateStr ? new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }) : '';
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-mono text-muted-foreground">{day?.count ?? 0}</span>
                <motion.div
                  className="w-full bg-primary/80 rounded-t-md min-h-[4px]"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 3)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            );
          }) ?? []}
        </div>
      </motion.div>

      {/* Energy distribution */}
      <motion.div
        className="bg-card rounded-xl p-6"
        style={{ boxShadow: 'var(--shadow-md)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Distribuição por Energia
        </h3>
        <div className="space-y-3">
          {[
            { key: 'high', label: 'Alta Energia', color: 'hsl(var(--energy-high))' },
            { key: 'medium', label: 'Média Energia', color: 'hsl(var(--energy-medium))' },
            { key: 'low', label: 'Baixa Energia', color: 'hsl(var(--energy-low))' },
          ]?.map?.((item: any) => {
            const count = energyCounts?.[item?.key as keyof typeof energyCounts] ?? 0;
            const total = totalTasks || 1;
            return (
              <div key={item?.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item?.label}</span>
                  <span className="font-mono text-muted-foreground">{count} tarefas</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item?.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / total) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            );
          }) ?? []}
        </div>
      </motion.div>
    </div>
  );
}
