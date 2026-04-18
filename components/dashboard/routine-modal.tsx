'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Zap, Flame, Snowflake, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const COLORS = [
  '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EF4444', '#06B6D4', '#F97316', '#14B8A6',
];

const ICONS = [
  { id: 'calendar', icon: Calendar, label: 'Calendário' },
  { id: 'clock', icon: Clock, label: 'Relógio' },
  { id: 'zap', icon: Zap, label: 'Energia' },
  { id: 'flame', icon: Flame, label: 'Fogo' },
  { id: 'snowflake', icon: Snowflake, label: 'Gelo' },
  { id: 'sun', icon: Sun, label: 'Sol' },
];

const ENERGY_LEVELS = [
  { id: 'high', label: 'Alta Energia', desc: 'Tarefas que exigem foco intenso' },
  { id: 'medium', label: 'Média Energia', desc: 'Tarefas moderadas do dia a dia' },
  { id: 'low', label: 'Baixa Energia', desc: 'Tarefas simples e relaxantes' },
];

interface Props {
  routine?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function RoutineModal({ routine, onClose, onSave }: Props) {
  const [title, setTitle] = useState(routine?.title ?? '');
  const [description, setDescription] = useState(routine?.description ?? '');
  const [color, setColor] = useState(routine?.color ?? '#7C3AED');
  const [icon, setIcon] = useState(routine?.icon ?? 'calendar');
  const [energyLevel, setEnergyLevel] = useState(routine?.energyLevel ?? 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!title?.trim?.()) return;
    onSave?.({ title, description, color, icon, energyLevel });
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
            {routine ? 'Editar Rotina' : 'Nova Rotina'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              placeholder="Ex: Rotina Matinal"
              value={title}
              onChange={(e: any) => setTitle(e?.target?.value ?? '')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição (opcional)</Label>
            <Input
              placeholder="Descreva sua rotina"
              value={description}
              onChange={(e: any) => setDescription(e?.target?.value ?? '')}
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="flex gap-2 flex-wrap">
              {ICONS?.map?.((ic: any) => (
                <button
                  key={ic?.id}
                  type="button"
                  onClick={() => setIcon(ic?.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    icon === ic?.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                  }`}
                >
                  <ic.icon className="w-5 h-5" />
                </button>
              )) ?? []}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS?.map?.((c: string) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              )) ?? []}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nível de Energia</Label>
            <div className="grid gap-2">
              {ENERGY_LEVELS?.map?.((el: any) => (
                <button
                  key={el?.id}
                  type="button"
                  onClick={() => setEnergyLevel(el?.id)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    energyLevel === el?.id
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-sm">{el?.label}</p>
                  <p className="text-xs text-muted-foreground">{el?.desc}</p>
                </button>
              )) ?? []}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {routine ? 'Salvar' : 'Criar Rotina'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
