import { NextRequest, NextResponse } from 'next/server';
import { getCoachById, updateCoach, deleteCoach } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const coach = await getCoachById(parseInt(id));
        if (!coach) {
            return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
        }
        return NextResponse.json(coach);
    } catch (error) {
        console.error('Error fetching coach:', error);
        return NextResponse.json({ error: 'Failed to fetch coach' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { fullName } = await request.json();

        if (!fullName) {
            return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
        }

        await updateCoach(parseInt(id), fullName);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating coach:', error);
        return NextResponse.json({ error: 'Failed to update coach' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteCoach(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting coach:', error);
        return NextResponse.json({ error: 'Failed to delete coach' }, { status: 500 });
    }
}
