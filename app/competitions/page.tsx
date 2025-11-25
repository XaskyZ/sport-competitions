// app/competitions/page.tsx
import { getCompetitionsWithTypeId, getCompetitionTypes } from '@/lib/db';
import CompetitionsGrid from './CompetitionsGrid';

export default async function CompetitionsPage() {
    const [competitions, competitionTypes] = await Promise.all([
        getCompetitionsWithTypeId(),
        getCompetitionTypes(),
    ]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">Competitions</h1>
                </div>

                <CompetitionsGrid
                    initialCompetitions={competitions}
                    competitionTypes={competitionTypes}
                />
            </div>
        </div>
    );
}