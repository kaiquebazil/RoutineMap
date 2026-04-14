export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const task = await prisma.task.findFirst({
      where: { id: params?.id },
      include: { routine: true },
    });
    if (!task || task?.routine?.userId !== session.user.id) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }
    const today = new Date().toISOString().split('T')[0] ?? '';
    const existing = await prisma.taskCompletion.findUnique({
      where: { taskId_date: { taskId: params?.id, date: today } },
    });
    if (existing) {
      await prisma.taskCompletion.delete({ where: { id: existing.id } });
      return NextResponse.json({ completed: false, date: today });
    } else {
      await prisma.taskCompletion.create({
        data: { taskId: params?.id, date: today },
      });
      return NextResponse.json({ completed: true, date: today });
    }
  } catch (error: any) {
    console.error('Toggle task error:', error);
    return NextResponse.json({ error: 'Erro ao alternar tarefa' }, { status: 500 });
  }
}
