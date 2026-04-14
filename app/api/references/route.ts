export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const references = await prisma.reference.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(references);
  } catch (error: any) {
    console.error('GET references error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    if (!body.title) return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });

    const ref = await prisma.reference.create({
      data: {
        title: body.title,
        url: body.url || null,
        description: body.description || null,
        category: body.category || 'other',
        userId: session.user.id,
      },
    });
    return NextResponse.json(ref, { status: 201 });
  } catch (error: any) {
    console.error('POST reference error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
