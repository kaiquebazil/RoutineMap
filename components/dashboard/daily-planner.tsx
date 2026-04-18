'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Sparkles, ListTodo, StickyNote, Save, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DAY_NAMES = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatDisplay(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function DailyPlanner() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [intention, setIntention] = useState('');
  const [todos, setTodos] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const fetchNote = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/daily-notes?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setIntention(data.intention || '');
        setTodos(data.todos || '');
        setNotes(data.notes || '');
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (currentDate) {
      fetchNote(formatDate(currentDate));
    }
  }, [currentDate, fetchNote]);

  const autoSave = useCallback(async (field: string, value: string) => {
    if (!currentDate) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      try {
        const payload: any = { date: formatDate(currentDate), intention, todos, notes };
        payload[field] = value;
        await fetch('/api/daily-notes', {
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
  }, [currentDate, intention, todos, notes]);

  const changeDay = (offset: number) => {
    if (!currentDate) return;
    const next = new Date(currentDate);
    next.setDate(next.getDate() + offset);
    setCurrentDate(next);
  };

  if (!currentDate) return null;

  const isToday = formatDate(currentDate) === formatDate(new Date());

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">📅</span> Planejador Diário
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Organize seu dia com intenções, tarefas e notas</p>
        </div>
        <div className="flex items-center gap-2">
          {saving && <span className="text-xs text-muted-foreground animate-pulse">Salvando...</span>}
          {saved && <span className="text-xs text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Salvo</span>}
        </div>
      </div>

      {/* Date navigation */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => changeDay(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <div className="font-display font-bold text-lg">{DAY_NAMES[currentDate.getDay()]}</div>
          <div className="text-sm text-muted-foreground">{formatDisplay(currentDate)}</div>
          {isToday && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Hoje</span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={() => changeDay(1)}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Intention */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold">Hoje eu vou...</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Defina sua intenção principal para o dia</p>
          <textarea
            value={intention}
            onChange={(e) => { setIntention(e.target.value); autoSave('intention', e.target.value); }}
            placeholder="Hoje eu vou focar em..."
            className="w-full min-h-[120px] bg-muted/30 rounded-lg p-3 text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </motion.div>

        {/* To-dos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Afazeres</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Tarefas e afazeres do dia (uma por linha)</p>
          <textarea
            value={todos}
            onChange={(e) => { setTodos(e.target.value); autoSave('todos', e.target.value); }}
            placeholder={"- Comprar mantimentos\n- Enviar relatório\n- Estudar 1 hora"}
            className="w-full min-h-[120px] bg-muted/30 rounded-lg p-3 text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 font-mono"
          />
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Notas</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Anotações, ideias e observações do dia</p>
          <textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); autoSave('notes', e.target.value); }}
            placeholder="Notas e observações..."
            className="w-full min-h-[120px] bg-muted/30 rounded-lg p-3 text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </motion.div>
      </div>
    </div>
  );
}
