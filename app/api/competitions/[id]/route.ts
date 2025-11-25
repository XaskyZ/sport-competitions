import { NextRequest, NextResponse } from 'next/server';
import { getCompetitionById, updateCompetition, deleteCompetition } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const competition = await getCompetitionById(parseInt(id));
        if (!competition) {
            return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
        }
        return NextResponse.json(competition);
    } catch (error) {
        console.error('Error fetching competition:', error);
        return NextResponse.json({ error: 'Failed to fetch competition' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { name, typeId } = await request.json();

        if (!name || !typeId) {
            return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
        }

        await updateCompetition(parseInt(id), name, typeId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating competition:', error);
        return NextResponse.json({ error: 'Failed to update competition' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteCompetition(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting competition:', error);
        return NextResponse.json({ error: 'Failed to delete competition' }, { status: 500 });
    }
}
