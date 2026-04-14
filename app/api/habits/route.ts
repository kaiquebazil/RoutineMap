export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const habits = await prisma.habit.findMany({
      where: { userId: session.user.id },
      include: { entries: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(habits);
  } catch (error: any) {
    console.error('GET habits error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });

    const count = await prisma.habit.count({ where: { userId: session.user.id } });
    const habit = await prisma.habit.create({
      data: {
        name: body.name,
        color: body.color || '#7C3AED',
        icon: body.icon || 'target',
        sortOrder: count,
        userId: session.user.id,
      },
    });
    return NextResponse.json(habit, { status: 201 });
  } catch (error: any) {
    console.error('POST habit error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
