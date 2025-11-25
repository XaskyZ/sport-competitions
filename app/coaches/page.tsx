import { getCoaches } from '@/lib/db';
import CoachesTable from './CoachesTable';

export default async function CoachesPage() {
    const coaches = await getCoaches();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">Coaches</h1>
                </div>

                <CoachesTable initialCoaches={coaches} />
            </div>
        </div>
    );
}