'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Sparkles, ListTodo, StickyNote, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as storage from '@/lib/storage';

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
  const [saved, setSaved] = useState(false);
  const [activeModal, setActiveModal] = useState<'intention' | 'todos' | 'notes' | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    storage.ensureInitialized();
    setCurrentDate(new Date());
  }, []);

  const loadNote = useCallback((date: string) => {
    const data = storage.getDailyNote(date);
    setIntention(data.intention || '');
    setTodos(data.todos || '');
    setNotes(data.notes || '');
  }, []);

  useEffect(() => {
    if (currentDate) {
      loadNote(formatDate(currentDate));
    }
  }, [currentDate, loadNote]);

  const autoSave = useCallback((field: 'intention' | 'todos' | 'notes', value: string) => {
    if (!currentDate) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const payload = {
        date: formatDate(currentDate),
        intention,
        todos,
        notes,
        [field]: value,
      };
      storage.saveDailyNote(payload as storage.DailyNote);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 500);
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
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => setActiveModal('intention')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold">Hoje eu vou...</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="min-h-[100px] text-sm text-muted-foreground whitespace-pre-wrap">
            {intention || 'Clique para definir sua intenção principal...'}
          </div>
        </motion.div>

        {/* To-dos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => setActiveModal('todos')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Afazeres</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="min-h-[100px] text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {todos || 'Clique para listar seus afazeres...'}
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border/50 shadow-sm p-5 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => setActiveModal('notes')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Notas</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="min-h-[100px] text-sm text-muted-foreground whitespace-pre-wrap">
            {notes || 'Clique para adicionar notas...'}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-border overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-display font-bold text-xl flex items-center gap-2">
                  {activeModal === 'intention' && <><Sparkles className="w-5 h-5 text-yellow-500" /> Intenção</>}
                  {activeModal === 'todos' && <><ListTodo className="w-5 h-5 text-blue-500" /> Afazeres</>}
                  {activeModal === 'notes' && <><StickyNote className="w-5 h-5 text-green-500" /> Notas</>}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}>
                  <Plus className="w-5 h-5 rotate-45" />
                </Button>
              </div>
              <div className="p-6">
                <textarea
                  autoFocus
                  value={activeModal === 'intention' ? intention : activeModal === 'todos' ? todos : notes}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (activeModal === 'intention') { setIntention(val); autoSave('intention', val); }
                    else if (activeModal === 'todos') { setTodos(val); autoSave('todos', val); }
                    else if (activeModal === 'notes') { setNotes(val); autoSave('notes', val); }
                  }}
                  placeholder={
                    activeModal === 'intention' ? "Hoje eu vou focar em..." :
                    activeModal === 'todos' ? "- Comprar mantimentos\n- Enviar relatório" :
                    "Notas e observações..."
                  }
                  className="w-full min-h-[300px] bg-muted/30 rounded-xl p-4 text-base resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                />
              </div>
              <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
                <Button onClick={() => setActiveModal(null)}>Concluído</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
