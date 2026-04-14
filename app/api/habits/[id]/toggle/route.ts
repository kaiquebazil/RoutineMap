export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const habit = await prisma.habit.findFirst({ where: { id: params.id, userId: session.user.id } });
    if (!habit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const { date } = body;
    if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    const existing = await prisma.habitEntry.findUnique({
      where: { habitId_date: { habitId: params.id, date } },
    });

    if (existing) {
      await prisma.habitEntry.delete({ where: { id: existing.id } });
      return NextResponse.json({ completed: false });
    } else {
      await prisma.habitEntry.create({ data: { habitId: params.id, date } });
      return NextResponse.json({ completed: true });
    }
  } catch (error: any) {
    console.error('Toggle habit error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
