'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, MessageSquareText, Trophy, AlertTriangle, Lightbulb, Check, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - ((day + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const s = weekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  const e = end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${s} - ${e}`;
}

export function WeeklyReflection() {
  const [weekStart, setWeekStart] = useState<Date | null>(null);
  const [threeWords, setThreeWords] = useState('');
  const [proudMoments, setProudMoments] = useState('');
  const [struggles, setStruggles] = useState('');
  const [learned, setLearned] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setWeekStart(getWeekStart(new Date()));
  }, []);

  const fetchReflection = useCallback(async (ws: string) => {
    try {
      const res = await fetch(`/api/weekly-reflections?weekStart=${ws}`);
      if (res.ok) {
        const data = await res.json();
        setThreeWords(data.threeWords || '');
        setProudMoments(data.proudMoments || '');
        setStruggles(data.struggles || '');
        setLearned(data.learned || '');
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (weekStart) {
      fetchReflection(weekStart.toISOString().split('T')[0]);
    }
  }, [weekStart, fetchReflection]);

  const autoSave = useCallback(async (field: string, value: string) => {
    if (!weekStart) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      try {
        const ws = weekStart.toISOString().split('T')[0];
        const payload: any = { weekStart: ws, threeWords, proudMoments, struggles, learned };
        payload[field] = value;
        await fetch('/api/weekly-reflections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }, 800);
  }, [weekStart, threeWords, proudMoments, struggles, learned]);

  const changeWeek = (offset: number) => {
    if (!weekStart) return;
    const next = new Date(weekStart);
    next.setDate(next.getDate() + (offset * 7));
    setWeekStart(next);
  };

  if (!weekStart) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">💬</span> Reflexão Semanal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Reflita sobre sua semana e registre seus aprendizados</p>
        </div>
        <div className="flex items-center gap-2">
          {saving && <span className="text-xs text-muted-foreground animate-pulse">Salvando...</span>}
          {saved && <span className="text-xs text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Salvo</span>}
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => changeWeek(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <div className="font-display font-bold text-lg">Semana</div>
          <div className="text-sm text-muted-foreground">{formatWeekRange(weekStart)}</div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => changeWeek(1)}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquareText className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Descreva essa semana em 3 palavras</h3>
          </div>
          <textarea
            value={threeWords}
            onChange={(e) => { setThreeWords(e.target.value); autoSave('threeWords', e.target.value); }}
            placeholder="Ex: Produtiva, desafiadora, gratificante"
            className="w-full min-h-[80px] bg-muted/30 rounded-lg p-3 text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold">Momentos bons / de orgulho</h3>
          </div>
          <textarea
            value={proudMoments}
            onChange={(e) => { setProudMoments(e.target.value); autoSave('proudMoments', e.target.value); }}
            placeholder="Os momentos que te deixaram orgulhoso(a) ou feliz..."
            className="w-full min-h-[80px] bg-muted/30 rounded-lg p-3 text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Frustrações / desafios</h3>
          </div>
          <textarea
            value={struggles}
            onChange={(e) => { setStruggles(e.target.value); autoSave('struggles', e.target.value); }}
            placeholder="As dificuldades e frustrações da semana..."
            className="w-full min-h-[80px] bg-muted/30 rounded-lg p-3 text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">O que eu aprendi</h3>
          </div>
          <textarea
            value={learned}
            onChange={(e) => { setLearned(e.target.value); autoSave('learned', e.target.value); }}
            placeholder="O que você aprendeu essa semana..."
            className="w-full min-h-[80px] bg-muted/30 rounded-lg p-3 text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </motion.div>
      </div>
    </div>
  );
}
