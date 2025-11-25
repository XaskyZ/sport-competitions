import { NextRequest, NextResponse } from 'next/server';
import { getResults, createResult } from '@/lib/db';

export async function GET() {
    try {
        const results = await getResults();
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { competitionId, sportTypeId, athleteId, awardId, eventDate } = await request.json();

        if (!competitionId || !sportTypeId || !athleteId || !awardId || !eventDate) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const result = await createResult(competitionId, sportTypeId, athleteId, awardId, eventDate);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Error creating result:', error);
        return NextResponse.json({ error: 'Failed to create result' }, { status: 500 });
    }
}
