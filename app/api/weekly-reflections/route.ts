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
    const weekStart = searchParams.get('weekStart');
    if (!weekStart) return NextResponse.json({ error: 'weekStart param required' }, { status: 400 });

    const reflection = await prisma.weeklyReflection.findUnique({
      where: { userId_weekStart: { userId: session.user.id, weekStart } },
    });
    return NextResponse.json(reflection || { weekStart, threeWords: '', proudMoments: '', struggles: '', learned: '' });
  } catch (error: any) {
    console.error('GET weekly reflection error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { weekStart, threeWords, proudMoments, struggles, learned } = body;
    if (!weekStart) return NextResponse.json({ error: 'weekStart is required' }, { status: 400 });

    const reflection = await prisma.weeklyReflection.upsert({
      where: { userId_weekStart: { userId: session.user.id, weekStart } },
      update: { threeWords, proudMoments, struggles, learned },
      create: { weekStart, threeWords, proudMoments, struggles, learned, userId: session.user.id },
    });
    return NextResponse.json(reflection);
  } catch (error: any) {
    console.error('POST weekly reflection error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
