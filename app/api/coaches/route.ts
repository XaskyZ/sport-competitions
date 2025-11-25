import { NextRequest, NextResponse } from 'next/server';
import { getCoaches, createCoach } from '@/lib/db';

export async function GET() {
    try {
        const coaches = await getCoaches();
        return NextResponse.json(coaches);
    } catch (error) {
        console.error('Error fetching coaches:', error);
        return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { fullName } = await request.json();

        if (!fullName) {
            return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
        }

        const result = await createCoach(fullName);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Error creating coach:', error);
        return NextResponse.json({ error: 'Failed to create coach' }, { status: 500 });
    }
}
