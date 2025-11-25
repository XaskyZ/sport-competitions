import { NextRequest, NextResponse } from 'next/server';
import { getResultById, updateResult, deleteResult } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await getResultById(parseInt(id));
        if (!result) {
            return NextResponse.json({ error: 'Result not found' }, { status: 404 });
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching result:', error);
        return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { competitionId, sportTypeId, athleteId, awardId, eventDate } = await request.json();

        if (!competitionId || !sportTypeId || !athleteId || !awardId || !eventDate) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        await updateResult(parseInt(id), competitionId, sportTypeId, athleteId, awardId, eventDate);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating result:', error);
        return NextResponse.json({ error: 'Failed to update result' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteResult(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting result:', error);
        return NextResponse.json({ error: 'Failed to delete result' }, { status: 500 });
    }
}
