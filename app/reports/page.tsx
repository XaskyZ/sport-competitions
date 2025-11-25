import { query, getResults, getCompetitionsSimple, getSportTypes, getAthletesSimple, getAwards } from '@/lib/db';
import ResultsTable from './ResultsTable';

export default async function ReportsPage() {
    // Данные для CRUD
    const [results, competitions, sportTypes, athletes, awards] = await Promise.all([
        getResults(),
        getCompetitionsSimple(),
        getSportTypes(),
        getAthletesSimple(),
        getAwards(),
    ]);

    // Вызываем процедуру для получения наград
    const awardsByComp = await query('SELECT * FROM sp_GetAwardsByCompetitionAndSport($1, $2)', [1, 6]);

    // Вызываем процедуру для женщин 18-20 лет
    const femaleAthletes = await query('SELECT * FROM sp_GetFemaleAthletes18to20($1)', [2025]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">Reports & Results</h1>
                </div>

                {/* Results CRUD Table */}
                <ResultsTable
                    initialResults={results}
                    competitions={competitions}
                    sportTypes={sportTypes}
                    athletes={athletes}
                    awards={awards}
                />

                {/* Report 1: Awards by Competition */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">📊 Report: World Ice Hockey Championship - Ice Hockey Awards</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Competition</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Sport</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Athlete</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Award</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Coach</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {awardsByComp.map((award: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">{award.competition_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{award.sport_type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{award.athlete_name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${award.award_name === 'Gold Medal' ? 'bg-yellow-100 text-yellow-800' :
                                                    award.award_name === 'Silver Medal' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-orange-100 text-orange-800'
                                                }`}>
                                                {award.award_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {new Date(award.event_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{award.coach_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Report 2: Female Athletes 18-20 years */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">📊 Report: Female Athletes (18-20 years old)</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Birth Year</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Age</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Sport</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Coach</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {femaleAthletes.map((athlete: any) => (
                                    <tr key={athlete.athlete_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{athlete.athlete_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{athlete.birth_year}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{athlete.age}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{athlete.sport_type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{athlete.coach_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}