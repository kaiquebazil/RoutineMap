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
    const routines = await prisma.routine.findMany({
      where: { userId: session.user.id },
      include: {
        tasks: {
          orderBy: { sortOrder: 'asc' },
          include: {
            completions: {
              where: {
                date: new Date().toISOString().split('T')[0] ?? '',
              },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(routines ?? []);
  } catch (error: any) {
    console.error('Get routines error:', error);
    return NextResponse.json({ error: 'Erro ao buscar rotinas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const body = await req.json();
    const { title, description, color, icon, energyLevel } = body ?? {};
    if (!title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
    }
    const count = await prisma.routine.count({ where: { userId: session.user.id } });
    const routine = await prisma.routine.create({
      data: {
        title,
        description: description ?? null,
        color: color ?? '#7C3AED',
        icon: icon ?? 'calendar',
        energyLevel: energyLevel ?? 'medium',
        sortOrder: count,
        userId: session.user.id,
      },
      include: { tasks: true },
    });
    return NextResponse.json(routine, { status: 201 });
  } catch (error: any) {
    console.error('Create routine error:', error);
    return NextResponse.json({ error: 'Erro ao criar rotina' }, { status: 500 });
  }
}
