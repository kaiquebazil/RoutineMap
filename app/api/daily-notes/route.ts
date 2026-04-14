export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    if (!date) return NextResponse.json({ error: 'Date param required' }, { status: 400 });

    const note = await prisma.dailyNote.findUnique({
      where: { userId_date: { userId: session.user.id, date } },
    });
    return NextResponse.json(note || { date, intention: '', todos: '', notes: '' });
  } catch (error: any) {
    console.error('GET daily note error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { date, intention, todos, notes } = body;
    if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    const note = await prisma.dailyNote.upsert({
      where: { userId_date: { userId: session.user.id, date } },
      update: { intention, todos, notes },
      create: { date, intention, todos, notes, userId: session.user.id },
    });
    return NextResponse.json(note);
  } catch (error: any) {
    console.error('POST daily note error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
