'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ExternalLink, X, BookOpen, Youtube, Globe, Music, Tv, Newspaper,
  User, Radio, FileText, Edit2, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import * as storage from '@/lib/storage';
import type { Reference } from '@/lib/storage';

const CATEGORIES = [
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { id: 'website', label: 'Website', icon: Globe, color: 'text-blue-500' },
  { id: 'music', label: 'Música', icon: Music, color: 'text-green-500' },
  { id: 'film', label: 'Filmes/Séries', icon: Tv, color: 'text-purple-500' },
  { id: 'book', label: 'Livro', icon: BookOpen, color: 'text-amber-600' },
  { id: 'article', label: 'Artigo', icon: Newspaper, color: 'text-sky-500' },
  { id: 'social', label: 'Rede Social', icon: User, color: 'text-pink-500' },
  { id: 'radio', label: 'Rádio/Podcast', icon: Radio, color: 'text-orange-500' },
  { id: 'other', label: 'Outro', icon: FileText, color: 'text-gray-500' },
];

function getCategoryInfo(cat: string) {
  return CATEGORIES.find((c) => c.id === cat) || CATEGORIES[CATEGORIES.length - 1];
}

export function ReferencesPanel() {
  const [refs, setRefs] = useState<Reference[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingRef, setEditingRef] = useState<Reference | null>(null);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCat, setFormCat] = useState('other');

  const refresh = () => {
    setRefs(storage.getReferences());
  };

  useEffect(() => {
    storage.ensureInitialized();
    refresh();
    setMounted(true);
  }, []);

  const resetForm = () => {
    setFormTitle('');
    setFormUrl('');
    setFormDesc('');
    setFormCat('other');
    setShowAdd(false);
    setEditingRef(null);
  };

  const handleSave = () => {
    if (!formTitle.trim()) { toast.error('Título é obrigatório'); return; }
    const payload = {
      title: formTitle.trim(),
      url: formUrl.trim() || null,
      description: formDesc.trim() || null,
      category: formCat,
    };
    if (editingRef) {
      storage.updateReference(editingRef.id, payload);
      toast.success('Referência atualizada!');
    } else {
      storage.createReference(payload);
      toast.success('Referência adicionada!');
    }
    resetForm();
    refresh();
  };

  const handleDelete = (id: string) => {
    storage.deleteReference(id);
    toast.success('Referência removida!');
    refresh();
  };

  const startEdit = (ref: Reference) => {
    setEditingRef(ref);
    setFormTitle(ref.title);
    setFormUrl(ref.url || '');
    setFormDesc(ref.description || '');
    setFormCat(ref.category);
    setShowAdd(true);
  };

  const filtered = refs.filter((r) => {
    if (filterCat !== 'all' && r.category !== filterCat) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!mounted) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">🎯</span> Referências
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Canais, músicas, filmes, sites e tudo que te ajuda a aprender idiomas</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAdd(true); }} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Nova Referência
        </Button>
      </div>

      {/* Add/Edit form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-card rounded-xl border border-border/50 shadow-sm p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{editingRef ? 'Editar Referência' : 'Nova Referência'}</h3>
              <Button variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs">Título *</Label>
                <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Nome da referência" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">URL / Link</Label>
                <Input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://..." className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Descrição</Label>
                <Input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Breve descrição..." className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Categoria</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFormCat(c.id)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        formCat === c.id
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <c.icon className={`w-3 h-3 ${c.color}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={resetForm}>Cancelar</Button>
              <Button size="sm" onClick={handleSave}>Salvar</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar referências..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterCat('all')}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
              filterCat === 'all' ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border hover:border-primary/30'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                filterCat === c.id ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border hover:border-primary/30'
              }`}
            >
              <c.icon className={`w-3 h-3 ${c.color}`} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma referência encontrada.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ref, i) => {
            const cat = getCategoryInfo(ref.category);
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={ref.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-xl border border-border/50 shadow-sm p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <CatIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cat.color}`} />
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate">{ref.title}</h4>
                      {ref.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ref.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => startEdit(ref)} className="text-muted-foreground hover:text-foreground">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(ref.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline mt-2 truncate">
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{ref.url}</span>
                  </a>
                )}
                <div className="mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full bg-muted/60 ${cat.color}`}>{cat.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
