export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const body = await req.json();
    const { title, description, timeOfDay, daysOfWeek, priority, routineId } = body ?? {};
    if (!title || !routineId) {
      return NextResponse.json({ error: 'Título e rotina são obrigatórios' }, { status: 400 });
    }
    const routine = await prisma.routine.findFirst({
      where: { id: routineId, userId: session.user.id },
    });
    if (!routine) {
      return NextResponse.json({ error: 'Rotina não encontrada' }, { status: 404 });
    }
    const count = await prisma.task.count({ where: { routineId } });
    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        timeOfDay: timeOfDay ?? null,
        daysOfWeek: daysOfWeek ?? [],
        priority: priority ?? 'medium',
        sortOrder: count,
        routineId,
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Erro ao criar tarefa' }, { status: 500 });
  }
}
