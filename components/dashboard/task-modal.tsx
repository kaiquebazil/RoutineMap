'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DAYS = [
  { id: 'mon', label: 'Seg' },
  { id: 'tue', label: 'Ter' },
  { id: 'wed', label: 'Qua' },
  { id: 'thu', label: 'Qui' },
  { id: 'fri', label: 'Sex' },
  { id: 'sat', label: 'Sáb' },
  { id: 'sun', label: 'Dom' },
];

const PRIORITIES = [
  { id: 'high', label: 'Alta', color: 'bg-red-500' },
  { id: 'medium', label: 'Média', color: 'bg-yellow-500' },
  { id: 'low', label: 'Baixa', color: 'bg-blue-500' },
];

interface Props {
  task?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function TaskModal({ task, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [timeOfDay, setTimeOfDay] = useState(task?.timeOfDay ?? '');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(task?.daysOfWeek ?? []);
  const [priority, setPriority] = useState(task?.priority ?? 'medium');

  const toggleDay = (day: string) => {
    setDaysOfWeek((prev: string[]) =>
      prev?.includes?.(day)
        ? prev?.filter?.((d: string) => d !== day) ?? []
        : [...(prev ?? []), day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!title?.trim?.()) return;
    onSave?.({ title, description, timeOfDay, daysOfWeek, priority });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              placeholder="Ex: Meditar 10 minutos"
              value={title}
              onChange={(e: any) => setTitle(e?.target?.value ?? '')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição (opcional)</Label>
            <Input
              placeholder="Detalhes da tarefa"
              value={description}
              onChange={(e: any) => setDescription(e?.target?.value ?? '')}
            />
          </div>

          <div className="space-y-2">
            <Label>Horário (opcional)</Label>
            <Input
              type="time"
              value={timeOfDay}
              onChange={(e: any) => setTimeOfDay(e?.target?.value ?? '')}
            />
          </div>

          <div className="space-y-2">
            <Label>Dias da Semana</Label>
            <div className="flex gap-2 flex-wrap">
              {DAYS?.map?.((day: any) => (
                <button
                  key={day?.id}
                  type="button"
                  onClick={() => toggleDay(day?.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    daysOfWeek?.includes?.(day?.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-accent text-muted-foreground'
                  }`}
                >
                  {day?.label}
                </button>
              )) ?? []}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prioridade</Label>
            <div className="flex gap-2">
              {PRIORITIES?.map?.((p: any) => (
                <button
                  key={p?.id}
                  type="button"
                  onClick={() => setPriority(p?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    priority === p?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-accent text-muted-foreground'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${p?.color}`} />
                  {p?.label}
                </button>
              )) ?? []}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {task ? 'Salvar' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
