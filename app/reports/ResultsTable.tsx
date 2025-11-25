'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Result {
    id: number;
    competition_id: number;
    sport_type_id: number;
    athlete_id: number;
    award_id: number;
    event_date: string;
    competition_name: string;
    sport_type: string;
    athlete_name: string;
    award_name: string;
}

interface Competition {
    id: number;
    name: string;
}

interface SportType {
    id: number;
    name: string;
}

interface Athlete {
    id: number;
    name: string;
}

interface Award {
    id: number;
    name: string;
}

interface ResultsTableProps {
    initialResults: Result[];
    competitions: Competition[];
    sportTypes: SportType[];
    athletes: Athlete[];
    awards: Award[];
}

export default function ResultsTable({
    initialResults,
    competitions,
    sportTypes,
    athletes,
    awards
}: ResultsTableProps) {
    const [results, setResults] = useState<Result[]>(initialResults);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResult, setEditingResult] = useState<Result | null>(null);
    const [formData, setFormData] = useState({
        competitionId: competitions[0]?.id || 1,
        sportTypeId: sportTypes[0]?.id || 1,
        athleteId: athletes[0]?.id || 1,
        awardId: awards[0]?.id || 1,
        eventDate: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);

    const openCreateModal = () => {
        setEditingResult(null);
        setFormData({
            competitionId: competitions[0]?.id || 1,
            sportTypeId: sportTypes[0]?.id || 1,
            athleteId: athletes[0]?.id || 1,
            awardId: awards[0]?.id || 1,
            eventDate: new Date().toISOString().split('T')[0],
        });
        setIsModalOpen(true);
    };

    const openEditModal = async (result: Result) => {
        try {
            const res = await fetch(`/api/results/${result.id}`);
            const data = await res.json();
            setEditingResult(result);
            setFormData({
                competitionId: data.competition_id,
                sportTypeId: data.sport_type_id,
                athleteId: data.athlete_id,
                awardId: data.award_id,
                eventDate: new Date(data.event_date).toISOString().split('T')[0],
            });
            setIsModalOpen(true);
        } catch (error) {
            alert('Error loading result data');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingResult(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingResult) {
                await fetch(`/api/results/${editingResult.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('/api/results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            const res = await fetch('/api/results');
            const updatedResults = await res.json();
            setResults(updatedResults);
            closeModal();
        } catch (error) {
            alert('Error saving result');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this result?')) return;

        try {
            await fetch(`/api/results/${id}`, { method: 'DELETE' });
            setResults(results.filter(r => r.id !== id));
        } catch (error) {
            alert('Error deleting result');
        }
    };

    const getAwardColor = (awardName: string) => {
        switch (awardName) {
            case 'Gold Medal': return 'bg-yellow-100 text-yellow-800';
            case 'Silver Medal': return 'bg-gray-200 text-gray-800';
            case 'Bronze Medal': return 'bg-orange-100 text-orange-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-600">All Results</h2>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={20} />
                    Add Result
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Competition</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Sport</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Athlete</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Award</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Date</th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {results.map((result) => (
                            <tr key={result.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-800">{result.competition_name}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{result.sport_type}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{result.athlete_name}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${getAwardColor(result.award_name)}`}>
                                        {result.award_name}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {new Date(result.event_date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => openEditModal(result)}
                                        className="text-blue-600 hover:text-blue-800 mx-1"
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(result.id)}
                                        className="text-red-600 hover:text-red-800 mx-1"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            {editingResult ? 'Edit Result' : 'Add New Result'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Competition</label>
                                <select
                                    value={formData.competitionId}
                                    onChange={(e) => setFormData({ ...formData, competitionId: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    {competitions.map((comp) => (
                                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sport Type</label>
                                <select
                                    value={formData.sportTypeId}
                                    onChange={(e) => setFormData({ ...formData, sportTypeId: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    {sportTypes.map((sport) => (
                                        <option key={sport.id} value={sport.id}>{sport.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Athlete</label>
                                <select
                                    value={formData.athleteId}
                                    onChange={(e) => setFormData({ ...formData, athleteId: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    {athletes.map((athlete) => (
                                        <option key={athlete.id} value={athlete.id}>{athlete.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Award</label>
                                <select
                                    value={formData.awardId}
                                    onChange={(e) => setFormData({ ...formData, awardId: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    {awards.map((award) => (
                                        <option key={award.id} value={award.id}>{award.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                                <input
                                    type="date"
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (editingResult ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
