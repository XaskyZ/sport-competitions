import { NextRequest, NextResponse } from 'next/server';
import { getAthleteById, updateAthlete, deleteAthlete } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const athlete = await getAthleteById(parseInt(id));
        if (!athlete) {
            return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
        }
        return NextResponse.json(athlete);
    } catch (error) {
        console.error('Error fetching athlete:', error);
        return NextResponse.json({ error: 'Failed to fetch athlete' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { name, type, sportTypeId, coachId } = await request.json();

        if (!name || !type || !sportTypeId || !coachId) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        await updateAthlete(parseInt(id), name, type, sportTypeId, coachId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating athlete:', error);
        return NextResponse.json({ error: 'Failed to update athlete' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteAthlete(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting athlete:', error);
        return NextResponse.json({ error: 'Failed to delete athlete' }, { status: 500 });
    }
}
