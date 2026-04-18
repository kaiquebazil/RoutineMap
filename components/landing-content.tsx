'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CheckCircle2, Languages, MessageSquareText, Target, Sparkles, BookOpen, Zap, TrendingUp, ListChecks } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const features = [
  {
    icon: Languages,
    title: 'Rotinas por Idioma',
    description: 'Organize suas rotinas de estudo de idiomas por nível de energia e foco (Listening, Speaking, Reading, Writing).',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Calendar,
    title: 'Planejador Diário',
    description: 'Planeje suas sessões de estudo, tarefas diárias e horários de prática todos os dias.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Target,
    title: 'Hábitos Semanais',
    description: 'Registre e acompanhe seus hábitos linguísticos e veja seu progresso em uma grade visual.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquareText,
    title: 'Reflexão Semanal',
    description: 'Reflita sobre sua semana: o que funcionou, o que melhorar, e defina metas para a próxima.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BookOpen,
    title: 'Referências & Recursos',
    description: 'Centralize links, livros, apps, podcasts e outras referências de estudo em um só lugar.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Estatísticas de Progresso',
    description: 'Visualize gráficos e métricas detalhadas sobre seu desempenho semanal e mensal.',
    color: 'from-fuchsia-500 to-pink-500',
  },
];

const competencias = [
  { label: 'Listening', emoji: '🎧', description: 'Treine sua compreensão auditiva com podcasts, músicas e vídeos.' },
  { label: 'Speaking', emoji: '🗣️', description: 'Pratique conversação, pronúncia e fluência no idioma.' },
  { label: 'Reading', emoji: '📖', description: 'Melhore sua compreensão escrita com textos e livros.' },
  { label: 'Writing', emoji: '✍️', description: 'Desenvolva sua escrita com diários, redações e prática.' },
];

export function LandingContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
              <Languages className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Routine Map</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Seu mapa para dominar idiomas
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            Planeje, pratique e{' '}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              domine idiomas
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground md:text-xl"
          >
            Organize suas rotinas de estudo, acompanhe hábitos linguísticos, reflita sobre seu progresso e centralize todas as suas referências em um único painel inspirado no Notion.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/signup">
              <Button size="lg" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-base shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-purple-700 sm:w-auto">
                Criar minha conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full text-base sm:w-auto">
                Já tenho uma conta
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Competências */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">As 4 competências do aprendizado</h2>
            <p className="mt-3 text-muted-foreground">Cobrimos todos os pilares de um idioma</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {competencias.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:hover:border-violet-700"
              >
                <div className="mb-3 text-4xl">{c.emoji}</div>
                <h3 className="mb-2 text-lg font-semibold">{c.label}</h3>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">Tudo o que você precisa em um só lugar</h2>
            <p className="mt-3 text-muted-foreground">Um dashboard completo, inspirado nas melhores práticas do Notion</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-md`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Níveis de Energia */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50 via-white to-purple-50 p-8 dark:border-violet-900/40 dark:from-violet-950/30 dark:via-background dark:to-purple-950/30 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <Zap className="h-3.5 w-3.5" />
              Nível de energia
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Estude no seu ritmo</h2>
            <p className="mt-3 text-muted-foreground">Organize suas atividades conforme seu nível de energia ao longo do dia</p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Alta Energia', emoji: '⚡', color: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300', desc: 'Tarefas intensas como speaking ativo, redações complexas.' },
              { label: 'Média Energia', emoji: '🟡', color: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300', desc: 'Atividades de leitura moderada, listening com notas.' },
              { label: 'Baixa Energia', emoji: '🔵', color: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300', desc: 'Revisão leve, flashcards, listening passivo.' },
            ].map((n, i) => (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`rounded-2xl border p-5 ${n.color}`}
              >
                <div className="mb-2 text-3xl">{n.emoji}</div>
                <div className="mb-1 font-semibold">{n.label}</div>
                <p className="text-sm opacity-80">{n.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-10 text-center text-white shadow-2xl shadow-violet-500/30 md:p-16"
        >
          <h2 className="font-display text-3xl font-bold md:text-5xl">Comece sua jornada hoje</h2>
          <p className="mt-4 text-lg text-white/90">Crie sua conta e tenha acesso a rotinas, hábitos, planejador diário, reflexão semanal e muito mais — tudo pensado para quem aprende idiomas.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full text-base text-violet-700 shadow-lg hover:bg-white sm:w-auto">
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-purple-600">
                <Languages className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold">Routine Map</span>
            </div>
            <p className="text-xs text-muted-foreground">Feito com 💜 para quem ama aprender idiomas</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
