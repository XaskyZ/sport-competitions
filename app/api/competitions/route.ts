import { NextRequest, NextResponse } from 'next/server';
import { getCompetitionsWithTypeId, createCompetition } from '@/lib/db';

export async function GET() {
    try {
        const competitions = await getCompetitionsWithTypeId();
        return NextResponse.json(competitions);
    } catch (error) {
        console.error('Error fetching competitions:', error);
        return NextResponse.json({ error: 'Failed to fetch competitions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, typeId } = await request.json();

        if (!name || !typeId) {
            return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
        }

        const result = await createCompetition(name, typeId);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Error creating competition:', error);
        return NextResponse.json({ error: 'Failed to create competition' }, { status: 500 });
    }
}
