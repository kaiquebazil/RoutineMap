import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // ============================================================
  // ROUTINES - Based on Notion Energy Tracker
  // ============================================================
  const routineData = [
    {
      title: 'High Energy / Energia Alta \u26a1',
      description: 'Atividades que exigem foco total e alta energia. Fa\u00e7a quando estiver no pico de disposi\u00e7\u00e3o!',
      color: '#10B981',
      icon: 'zap',
      energyLevel: 'high',
      sortOrder: 0,
      tasks: [
        { title: 'Ver v\u00eddeos no YouTube com legenda no idioma e traduzir e anotar as palavras importantes', timeOfDay: '05:00', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], priority: 'high', sortOrder: 0 },
        { title: 'Estudar meus v\u00eddeos', timeOfDay: '06:00', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], priority: 'high', sortOrder: 1 },
        { title: 'Fazer v\u00eddeos', timeOfDay: '07:00', daysOfWeek: ['monday', 'wednesday', 'friday'], priority: 'high', sortOrder: 2 },
        { title: 'Roleplay | sobre conversas comuns, emprego e rotina', timeOfDay: '08:00', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], priority: 'high', sortOrder: 3 },
        { title: 'Assistir TV Garden', timeOfDay: '09:00', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], priority: 'medium', sortOrder: 4 },
      ],
    },
    {
      title: 'Medium Energy / Energia M\u00e9dia \ud83d\udfe1',
      description: 'Atividades de imers\u00e3o passiva. Boas para momentos de energia moderada.',
      color: '#F59E0B',
      icon: 'headphones',
      energyLevel: 'medium',
      sortOrder: 1,
      tasks: [
        { title: 'Ouvir \u00e1udios, v\u00eddeos ou Radio Garden', timeOfDay: '', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], priority: 'medium', sortOrder: 0 },
        { title: 'Escutar v\u00eddeos', timeOfDay: '', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], priority: 'medium', sortOrder: 1 },
        { title: 'Jogar em ingl\u00eas', timeOfDay: '', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], priority: 'low', sortOrder: 2 },
        { title: 'Assistir filmes e s\u00e9ries', timeOfDay: '', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], priority: 'medium', sortOrder: 3 },
      ],
    },
    {
      title: 'Low Energy / Energia Baixa \ud83d\udd35',
      description: 'Atividades leves para quando estiver cansado. Mantenha o contato com o idioma mesmo nos dias dif\u00edceis.',
      color: '#3B82F6',
      icon: 'coffee',
      energyLevel: 'low',
      sortOrder: 2,
      tasks: [
        { title: 'Ler no Quora', timeOfDay: '', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], priority: 'low', sortOrder: 0 },
        { title: 'Escutar Radio Garden', timeOfDay: '', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], priority: 'low', sortOrder: 1 },
        { title: 'Escutar \u00e1udios', timeOfDay: '', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], priority: 'low', sortOrder: 2 },
      ],
    },
    {
      title: 'Tarefas Di\u00e1rias \ud83d\udcdd',
      description: 'Tarefas fixas do planejador di\u00e1rio para manter a consist\u00eancia nos estudos.',
      color: '#7C3AED',
      icon: 'calendar',
      energyLevel: 'high',
      sortOrder: 3,
      tasks: [
        { title: 'Assistir 30 min de v\u00eddeos em ingl\u00eas filtrando e guardando conte\u00fado | 5am antes do trabalho', timeOfDay: '05:00', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], priority: 'high', sortOrder: 0 },
        { title: 'Estudar meus v\u00eddeos', timeOfDay: '06:00', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], priority: 'high', sortOrder: 1 },
        { title: 'Escutar v\u00eddeos ou Radio Garden indo para o trabalho e em tempo livre | manh\u00e3', timeOfDay: '07:30', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], priority: 'medium', sortOrder: 2 },
        { title: 'Fazer arte da conversa\u00e7\u00e3o antes do trabalho', timeOfDay: '07:00', daysOfWeek: ['tuesday', 'thursday'], priority: 'high', sortOrder: 3 },
        { title: 'Roleplay sobre atendimento no trabalho em rela\u00e7\u00e3o a tinta', timeOfDay: '08:00', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], priority: 'high', sortOrder: 4 },
      ],
    },
    {
      title: 'Role Play \ud83c\udfad',
      description: 'Pr\u00e1tica de situa\u00e7\u00f5es reais no idioma. Simule conversas do dia a dia!',
      color: '#EC4899',
      icon: 'users',
      energyLevel: 'high',
      sortOrder: 4,
      tasks: [
        { title: 'Roleplay - Situa\u00e7\u00f5es no trabalho', timeOfDay: '', daysOfWeek: ['monday', 'wednesday', 'friday'], priority: 'high', sortOrder: 0 },
        { title: 'Roleplay - Situa\u00e7\u00f5es na universidade', timeOfDay: '', daysOfWeek: ['tuesday', 'thursday'], priority: 'high', sortOrder: 1 },
        { title: 'Roleplay - Conversas do cotidiano (restaurante, mercado, etc)', timeOfDay: '', daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], priority: 'medium', sortOrder: 2 },
      ],
    },
  ];

  for (const rd of routineData) {
    const existingRoutine = await prisma.routine.findFirst({
      where: { title: rd.title, userId: adminUser.id },
    });
    if (existingRoutine) continue;

    const routine = await prisma.routine.create({
      data: {
        title: rd.title,
        description: rd.description,
        color: rd.color,
        icon: rd.icon,
        energyLevel: rd.energyLevel,
        sortOrder: rd.sortOrder,
        userId: adminUser.id,
      },
    });

    for (const task of rd.tasks) {
      await prisma.task.create({
        data: {
          title: task.title,
          timeOfDay: task.timeOfDay,
          daysOfWeek: task.daysOfWeek,
          priority: task.priority,
          sortOrder: task.sortOrder,
          routineId: routine.id,
        },
      });
    }
  }

  // ============================================================
  // HABITS - Based on Notion Habit Tracker (Language Competencies)
  // ============================================================
  const habitNames = ['Listening', 'Speaking', 'Reading', 'Writing'];
  for (let i = 0; i < habitNames.length; i++) {
    const existing = await prisma.habit.findFirst({
      where: { name: habitNames[i], userId: adminUser.id },
    });
    if (existing) continue;
    await prisma.habit.create({
      data: {
        name: habitNames[i],
        color: '#7C3AED',
        icon: 'target',
        sortOrder: i,
        userId: adminUser.id,
      },
    });
  }

  // ============================================================
  // REFERENCES - Based on Notion References section
  // ============================================================
  const references = [
    // YouTube Channels
    { title: 'MemeSack', url: 'https://www.youtube.com/@MemeSack', category: 'youtube', description: 'Canal do YouTube para imers\u00e3o em ingl\u00eas' },
    { title: 'IShowSpeed', url: 'https://www.youtube.com/@IShowSpeed', category: 'youtube', description: 'Canal do YouTube para imers\u00e3o em ingl\u00eas' },
    { title: 'Kai Cenat', url: 'https://www.youtube.com/@KaiCenat', category: 'youtube', description: 'Canal do YouTube para imers\u00e3o em ingl\u00eas' },
    // Websites
    { title: 'Educaplay - Types of Activities', url: 'https://www.educaplay.com/types-of-activities/', category: 'website', description: 'Atividades interativas para aprender idiomas' },
    { title: 'Babadum - Jogo de Vocabul\u00e1rio', url: 'https://babadum.com/play/?lang=7&game=1', category: 'website', description: 'Jogo para aprender vocabul\u00e1rio de forma divertida' },
    { title: 'TED Talks', url: 'https://www.ted.com/', category: 'website', description: 'Palestras em ingl\u00eas com legendas' },
    { title: 'Language Guide - Vocabulary', url: 'https://www.languageguide.org/english/vocabulary/', category: 'website', description: 'Guia visual de vocabul\u00e1rio em ingl\u00eas' },
    { title: 'TV Garden', url: 'https://tv.garden/us', category: 'website', description: 'Assistir TV ao vivo de v\u00e1rios pa\u00edses em ingl\u00eas' },
    // Songs
    { title: 'd4vd - Feel It', url: 'https://www.youtube.com/results?search_query=d4vd+feel+it', category: 'music', description: 'M\u00fasica para treinar listening' },
    { title: 'PARTYOF2 - poser', url: 'https://www.youtube.com/results?search_query=partyof2+poser', category: 'music', description: 'M\u00fasica para treinar listening' },
    { title: 'Khantrast - Landed In Brooklyn', url: 'https://www.youtube.com/results?search_query=khantrast+landed+in+brooklyn', category: 'music', description: 'M\u00fasica para treinar listening' },
    { title: 'Baby Keem & Kendrick Lamar', url: 'https://www.youtube.com/results?search_query=baby+keem+kendrick+lamar', category: 'music', description: 'M\u00fasica para treinar listening e vocabul\u00e1rio' },
    { title: 'NF - When I Grow Up', url: 'https://www.youtube.com/results?search_query=nf+when+i+grow+up', category: 'music', description: 'M\u00fasica com letras claras para estudar' },
    { title: 'Jace June - Come Home', url: 'https://www.youtube.com/results?search_query=jace+june+come+home', category: 'music', description: 'M\u00fasica para treinar listening' },
    { title: 'NEMZZZ - NEMZZZ TYPE BEAT', url: 'https://www.youtube.com/results?search_query=nemzzz+type+beat', category: 'music', description: 'Beat/M\u00fasica para imers\u00e3o' },
    { title: 'Lil Tecca - Love Me (Lyrics)', url: 'https://www.youtube.com/results?search_query=lil+tecca+love+me+lyrics', category: 'music', description: 'M\u00fasica com lyrics para acompanhar' },
    // Films & Series
    { title: 'Anne with E', url: '', category: 'film', description: 'S\u00e9rie para praticar ingl\u00eas - vocabul\u00e1rio rico' },
    { title: 'Steve Universe', url: '', category: 'film', description: 'Desenho animado - ingl\u00eas simples e divertido' },
    { title: 'All the Spider-Man movies', url: '', category: 'film', description: 'Filmes para praticar listening com a\u00e7\u00e3o' },
    // Book
    { title: 'All About Love', url: '', category: 'book', description: 'Livro em ingl\u00eas para pr\u00e1tica de reading' },
    // Social Media
    { title: 'Roleplay & Vida Real', url: '', category: 'social', description: 'Perfil de rede social para pr\u00e1tica de idiomas' },
    // Notes / Content ideas from Notion
    { title: 'Words and sentences that I forget everytime', url: '', category: 'article', description: 'Lista pessoal de palavras e frases dif\u00edceis de lembrar' },
    { title: 'Things I said in my videos', url: '', category: 'article', description: 'Anota\u00e7\u00f5es do que disse nos v\u00eddeos para revisar erros' },
    { title: 'Ideias pra v\u00eddeo', url: '', category: 'article', description: 'Ideias de conte\u00fado para v\u00eddeos em ingl\u00eas' },
    { title: 'Erros cometidos em v\u00eddeos', url: '', category: 'article', description: 'Registro de erros para n\u00e3o repetir' },
    { title: 'Nick aulas', url: '', category: 'article', description: 'Notas de aulas' },
  ];

  for (const ref of references) {
    const existing = await prisma.reference.findFirst({
      where: { title: ref.title, userId: adminUser.id },
    });
    if (existing) continue;
    await prisma.reference.create({
      data: {
        title: ref.title,
        url: ref.url || null,
        description: ref.description,
        category: ref.category,
        userId: adminUser.id,
      },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
