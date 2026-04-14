'use client';

import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Map, CheckCircle2, Zap, Calendar, ArrowRight, Target, ClipboardList,
  MessageSquareText, BookOpen, CalendarDays, BarChart3, Sparkles, Shield,
  Users, Clock, TrendingUp, ChevronRight, Star, Flame, Brain, Heart,
  Lightbulb, Trophy, Eye, Repeat, LayoutDashboard, Check,
  Headphones, Globe, Languages, Mic, BookOpenCheck, Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LandingContent() {
  const router = useRouter();

  const mainFeatures = [
    {
      icon: Zap,
      title: 'Energy Tracker',
      desc: 'Organize seus estudos por n\u00edvel de energia: alta, m\u00e9dia e baixa. Sempre h\u00e1 algo para fazer pelo idioma.',
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-500',
    },
    {
      icon: Calendar,
      title: 'Planejador Di\u00e1rio',
      desc: 'Defina sua inten\u00e7\u00e3o do dia, liste tarefas de estudo e anote palavras novas. Com auto-save.',
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
    },
    {
      icon: Target,
      title: 'Habit Tracker',
      desc: 'Acompanhe as 4 compet\u00eancias: Listening, Speaking, Reading e Writing toda semana.',
      color: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-500',
    },
    {
      icon: Users,
      title: 'Role Play',
      desc: 'Simule situa\u00e7\u00f5es reais: trabalho, universidade, restaurante. Pratique conversa\u00e7\u00e3o de verdade.',
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Refer\u00eancias',
      desc: 'Salve canais do YouTube, m\u00fasicas, filmes, sites e tudo que te ajuda a aprender.',
      color: 'from-teal-500/20 to-cyan-500/20',
      iconColor: 'text-teal-500',
    },
    {
      icon: MessageSquareText,
      title: 'Reflex\u00e3o Semanal',
      desc: 'Reflita sobre a semana: o que aprendeu, desafios, momentos de orgulho no idioma.',
      color: 'from-indigo-500/20 to-blue-500/20',
      iconColor: 'text-indigo-500',
    },
    {
      icon: CalendarDays,
      title: 'Calend\u00e1rio',
      desc: 'Vis\u00e3o mensal do seu progresso. Veja quais dias voc\u00ea estudou e quais faltou.',
      color: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-500',
    },
    {
      icon: BarChart3,
      title: 'Estat\u00edsticas',
      desc: 'Gr\u00e1ficos de desempenho, taxa de conclus\u00e3o e consist\u00eancia nos estudos.',
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-600',
    },
  ];

  const energyLevels = [
    {
      level: 'Alta Energia \u26a1',
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      tasks: [
        'Ver v\u00eddeos com legenda e anotar palavras',
        'Fazer v\u00eddeos em ingl\u00eas',
        'Roleplay sobre situa\u00e7\u00f5es reais',
        'Assistir TV Garden ao vivo',
      ],
    },
    {
      level: 'M\u00e9dia Energia \ud83d\udfe1',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      tasks: [
        'Ouvir \u00e1udios e Radio Garden',
        'Jogar em ingl\u00eas',
        'Assistir filmes e s\u00e9ries',
        'Escutar v\u00eddeos de fundo',
      ],
    },
    {
      level: 'Baixa Energia \ud83d\udd35',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      tasks: [
        'Ler no Quora',
        'Escutar Radio Garden',
        'Escutar \u00e1udios relaxando',
      ],
    },
  ];

  const howItWorks = [
    { step: '01', title: 'Crie sua conta', desc: 'Cadastre-se gr\u00e1tis e escolha o idioma que quer aprender.' },
    { step: '02', title: 'Monte suas rotinas', desc: 'Use as rotinas pr\u00e9-prontas ou crie as suas por n\u00edvel de energia.' },
    { step: '03', title: 'Estude todo dia', desc: 'Marque tarefas, acompanhe h\u00e1bitos e registre novas palavras.' },
    { step: '04', title: 'Reflita e evolua', desc: 'Use reflex\u00f5es semanais e estat\u00edsticas para medir seu progresso.' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Languages className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Routine Map</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => router?.push?.('/login')}>Entrar</Button>
            <Button size="sm" onClick={() => router?.push?.('/signup')}>
              Criar conta <ArrowRight className="w-3.5 h-3.5 ml-1 hidden sm:block" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* === HERO === */}
        <section className="relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-violet-400/8 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-[1200px] mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 relative">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Languages className="w-4 h-4" />
                Seu mapa para aprender idiomas
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                Aprenda idiomas com{' '}
                <span className="bg-gradient-to-r from-primary via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  rotina e consist\u00eancia
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Organize seus estudos por n\u00edvel de energia, acompanhe h\u00e1bitos de Listening, Speaking, Reading e Writing, e evolua com reflex\u00f5es semanais.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => router?.push?.('/signup')}
                  className="text-base px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                >
                  Come\u00e7ar gr\u00e1tis <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router?.push?.('/login')}
                  className="text-base px-8 h-12"
                >
                  J\u00e1 tenho conta
                </Button>
              </div>
            </motion.div>

            {/* Mini dashboard preview - language focused */}
            <motion.div
              className="mt-16 md:mt-20 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-card rounded-2xl border border-border/60 shadow-2xl shadow-black/5 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border/40">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="text-xs text-muted-foreground bg-muted/60 px-4 py-1 rounded-md">routinemap.app/dashboard</div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Rotinas', value: '5', color: 'text-violet-500' },
                      { label: 'Tarefas Hoje', value: '10', color: 'text-blue-500' },
                      { label: 'Compet\u00eancias', value: '4', color: 'text-orange-500' },
                      { label: 'Refer\u00eancias', value: '25', color: 'text-teal-500' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-muted/30 rounded-xl p-4 text-center">
                        <div className={`text-2xl md:text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      { title: 'Alta Energia \u26a1', tasks: 5, done: 3, color: '#10b981' },
                      { title: 'M\u00e9dia Energia \ud83d\udfe1', tasks: 4, done: 2, color: '#f59e0b' },
                      { title: 'Baixa Energia \ud83d\udd35', tasks: 3, done: 1, color: '#3b82f6' },
                    ].map((r) => (
                      <div key={r.title} className="bg-muted/20 rounded-xl p-4 border border-border/30">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                          <span className="text-sm font-semibold">{r.title}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(r.done / r.tasks) * 100}%`, backgroundColor: r.color }} />
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1.5">{r.done}/{r.tasks} tarefas</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* === ENERGY TRACKER SHOWCASE === */}
        <section className="bg-muted/30 py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-4">
            <AnimatedSection className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Estude de acordo com sua{' '}
                <span className="text-primary">energia do dia</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Nem todo dia \u00e9 um dia de alta energia. O Routine Map organiza atividades por n\u00edvel para que voc\u00ea nunca pule um dia de estudo.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {energyLevels.map((e, i) => (
                <AnimatedSection key={e.level} delay={i * 0.1}>
                  <div className="h-full p-6 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-lg transition-all">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${e.bgColor} ${e.textColor} text-sm font-semibold mb-4`}>
                      {e.level}
                    </div>
                    <ul className="space-y-2.5">
                      {e.tasks.map((task) => (
                        <li key={task} className="flex items-start gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${e.color} mt-1.5 flex-shrink-0`} />
                          <span className="text-sm">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* === ALL FEATURES === */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-4">
            <AnimatedSection className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Tudo que voc\u00ea precisa para{' '}
                <span className="text-primary">dominar um idioma</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                8 ferramentas integradas para organizar, praticar e acompanhar sua evolu\u00e7\u00e3o.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {mainFeatures.map((f, i) => (
                <AnimatedSection key={f.title} delay={i * 0.06}>
                  <div className="h-full p-6 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                    </div>
                    <h3 className="font-display font-semibold text-base mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* === HABIT TRACKER + COMPETENCIES === */}
        <section className="bg-muted/30 py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <AnimatedSection>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Acompanhe as 4{' '}
                  <span className="text-primary">compet\u00eancias</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  O Habit Tracker foi desenhado para as compet\u00eancias essenciais de qualquer idioma. Marque diariamente o que voc\u00ea praticou.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Headphones, name: 'Listening', desc: 'V\u00eddeos, m\u00fasicas, podcasts' },
                    { icon: Mic, name: 'Speaking', desc: 'Roleplay, conversas, v\u00eddeos' },
                    { icon: BookOpenCheck, name: 'Reading', desc: 'Livros, artigos, Quora' },
                    { icon: ClipboardList, name: 'Writing', desc: 'Notas, di\u00e1rio, mensagens' },
                  ].map((c) => (
                    <div key={c.name} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/40">
                      <c.icon className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="bg-card rounded-2xl border border-border/50 shadow-xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-display font-semibold">Habit Tracker</span>
                    <span className="text-xs text-muted-foreground ml-auto">Esta semana</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Listening', days: [true, true, true, true, false, false, false] },
                      { name: 'Speaking', days: [true, true, true, false, false, false, false] },
                      { name: 'Reading', days: [false, false, false, false, false, false, false] },
                      { name: 'Writing', days: [false, false, false, false, false, false, false] },
                    ].map((habit) => (
                      <div key={habit.name} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-20 truncate">{habit.name}</span>
                        <div className="flex gap-1.5 flex-1">
                          {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                            <div
                              key={i}
                              className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium border-2 transition-all ${
                                habit.days[i]
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : 'border-border/60 text-muted-foreground'
                              }`}
                            >
                              {habit.days[i] ? <Check className="w-3.5 h-3.5" /> : d}
                            </div>
                          ))}
                        </div>
                        <span className={`text-xs font-mono font-bold w-10 text-right ${
                          habit.days.filter(Boolean).length >= 4 ? 'text-green-500' :
                          habit.days.filter(Boolean).length >= 2 ? 'text-yellow-500' : 'text-muted-foreground'
                        }`}>
                          {Math.round((habit.days.filter(Boolean).length / 7) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* === HOW IT WORKS === */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-4">
            <AnimatedSection className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Como <span className="text-primary">funciona</span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, i) => (
                <AnimatedSection key={item.step} delay={i * 0.1}>
                  <div className="relative p-6 rounded-2xl bg-card border border-border/40 text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl font-display font-black text-primary/15 mb-3">{item.step}</div>
                    <h3 className="font-display font-semibold text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    {i < 3 && (
                      <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/30" />
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* === REFERENCES PREVIEW === */}
        <section className="bg-muted/30 py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <AnimatedSection delay={0.1}>
                <div className="grid gap-4">
                  <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-sm">Refer\u00eancias Salvas</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { icon: '\ud83c\udfa5', name: 'MemeSack, IShowSpeed, Kai Cenat', type: 'YouTube' },
                        { icon: '\ud83c\udfb5', name: 'd4vd, NF, Khantrast, Lil Tecca', type: 'M\u00fasicas' },
                        { icon: '\ud83c\udf10', name: 'TV Garden, TED, Babadum', type: 'Websites' },
                        { icon: '\ud83c\udfac', name: 'Anne with E, Steve Universe', type: 'S\u00e9ries' },
                        { icon: '\ud83d\udcda', name: 'All About Love', type: 'Livro' },
                      ].map((ref) => (
                        <div key={ref.name} className="flex items-center gap-3 bg-muted/30 rounded-lg p-2.5">
                          <span className="text-lg">{ref.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{ref.name}</div>
                            <div className="text-[11px] text-muted-foreground">{ref.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Suas <span className="text-primary">inspira\u00e7\u00f5es</span> em um lugar s\u00f3
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Salve canais, m\u00fasicas, filmes, sites e tudo que te motiva a estudar. O Routine Map j\u00e1 vem com refer\u00eancias pr\u00e9-carregadas do template original.
                </p>
                <ul className="space-y-3">
                  {[
                    'Canais do YouTube para imers\u00e3o (MemeSack, IShowSpeed, Kai Cenat)',
                    'M\u00fasicas com letras para treinar listening',
                    'Sites interativos (Babadum, Educaplay, Language Guide)',
                    'Filmes e s\u00e9ries para pr\u00e1tica natural',
                    'Notas pessoais: erros, palavras dif\u00edceis, ideias',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* === FEATURES STRIP === */}
        <section className="bg-primary/5 py-12">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Shield, label: 'Seus dados seguros' },
                { icon: Users, label: 'Multi-usu\u00e1rio' },
                { icon: Clock, label: 'Auto-save em tempo real' },
                { icon: Eye, label: 'Tema claro e escuro' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <item.icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === CTA === */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-4">
            <AnimatedSection>
              <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-violet-500/5 to-purple-500/10 border border-primary/20 p-10 md:p-16 text-center overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
                </div>
                <div className="relative">
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
                    Pronto para dominar um novo idioma?
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                    Crie sua conta gratuita e comece com rotinas pr\u00e9-configuradas, refer\u00eancias e h\u00e1bitos j\u00e1 prontos para usar.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => router?.push?.('/signup')}
                    className="text-base px-10 h-13 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                  >
                    Come\u00e7ar agora \u2014 \u00e9 gr\u00e1tis <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="border-t border-border/50 py-8">
          <div className="max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <Languages className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-sm">Routine Map</span>
            </div>
            <p className="text-xs text-muted-foreground">\u00a9 2026 Routine Map. Seu mapa para aprender idiomas com consist\u00eancia.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
