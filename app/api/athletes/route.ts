import { NextRequest, NextResponse } from 'next/server';
import { getAthletes, createAthlete } from '@/lib/db';

export async function GET() {
    try {
        const athletes = await getAthletes();
        return NextResponse.json(athletes);
    } catch (error) {
        console.error('Error fetching athletes:', error);
        return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, type, sportTypeId, coachId } = await request.json();

        if (!name || !type || !sportTypeId || !coachId) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const result = await createAthlete(name, type, sportTypeId, coachId);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Error creating athlete:', error);
        return NextResponse.json({ error: 'Failed to create athlete' }, { status: 500 });
    }
}
