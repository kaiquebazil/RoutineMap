export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
    const body = await req.json();
    const updated = await prisma.task.update({
      where: { id: params?.id },
      data: {
        title: body?.title ?? task.title,
        description: body?.description !== undefined ? body.description : task.description,
        timeOfDay: body?.timeOfDay !== undefined ? body.timeOfDay : task.timeOfDay,
        daysOfWeek: body?.daysOfWeek ?? task.daysOfWeek,
        priority: body?.priority ?? task.priority,
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar tarefa' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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
    await prisma.task.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Erro ao excluir tarefa' }, { status: 500 });
  }
}
