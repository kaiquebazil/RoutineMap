export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const today = new Date().toISOString().split('T')[0] ?? '';
    const routines = await prisma.routine.count({ where: { userId: session.user.id } });
    const tasks = await prisma.task.count({
      where: { routine: { userId: session.user.id } },
    });
    const todayCompletions = await prisma.taskCompletion.count({
      where: {
        date: today,
        task: { routine: { userId: session.user.id } },
      },
    });
    const last7days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0] ?? '';
      const count = await prisma.taskCompletion.count({
        where: {
          date: dateStr,
          task: { routine: { userId: session.user.id } },
        },
      });
      last7days.push({ date: dateStr, count });
    }
    return NextResponse.json({
      routines,
      tasks,
      todayCompletions,
      last7days,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
