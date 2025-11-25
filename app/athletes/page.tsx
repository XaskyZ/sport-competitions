import { getAthletes, getSportTypes, getCoaches } from '@/lib/db';
import AthletesTable from './AthletesTable';

export default async function AthletesPage() {
    const [athletes, sportTypes, coaches] = await Promise.all([
        getAthletes(),
        getSportTypes(),
        getCoaches(),
    ]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">Athletes</h1>
                </div>

                <AthletesTable
                    initialAthletes={athletes}
                    sportTypes={sportTypes}
                    coaches={coaches}
                />
            </div>
        </div>
    );
}