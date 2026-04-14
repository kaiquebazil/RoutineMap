export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const routine = await prisma.routine.findFirst({
      where: { id: params?.id, userId: session.user.id },
      include: {
        tasks: {
          orderBy: { sortOrder: 'asc' },
          include: {
            completions: {
              where: { date: new Date().toISOString().split('T')[0] ?? '' },
            },
          },
        },
      },
    });
    if (!routine) {
      return NextResponse.json({ error: 'Rotina não encontrada' }, { status: 404 });
    }
    return NextResponse.json(routine);
  } catch (error: any) {
    console.error('Get routine error:', error);
    return NextResponse.json({ error: 'Erro ao buscar rotina' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const existing = await prisma.routine.findFirst({
      where: { id: params?.id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Rotina não encontrada' }, { status: 404 });
    }
    const body = await req.json();
    const routine = await prisma.routine.update({
      where: { id: params?.id },
      data: {
        title: body?.title ?? existing.title,
        description: body?.description !== undefined ? body.description : existing.description,
        color: body?.color ?? existing.color,
        icon: body?.icon ?? existing.icon,
        energyLevel: body?.energyLevel ?? existing.energyLevel,
        isActive: body?.isActive !== undefined ? body.isActive : existing.isActive,
      },
      include: { tasks: { orderBy: { sortOrder: 'asc' } } },
    });
    return NextResponse.json(routine);
  } catch (error: any) {
    console.error('Update routine error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar rotina' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const existing = await prisma.routine.findFirst({
      where: { id: params?.id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Rotina não encontrada' }, { status: 404 });
    }
    await prisma.routine.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete routine error:', error);
    return NextResponse.json({ error: 'Erro ao excluir rotina' }, { status: 500 });
  }
}
