'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Athlete {
    id: number;
    name: string;
    type: string;
    sport_type: string;
    coach_name: string;
    sport_type_id?: number;
    coach_id?: number;
}

interface SportType {
    id: number;
    name: string;
}

interface Coach {
    id: number;
    full_name: string;
}

interface AthletesTableProps {
    initialAthletes: Athlete[];
    sportTypes: SportType[];
    coaches: Coach[];
}

export default function AthletesTable({ initialAthletes, sportTypes, coaches }: AthletesTableProps) {
    const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Individual',
        sportTypeId: sportTypes[0]?.id || 1,
        coachId: coaches[0]?.id || 1,
    });
    const [loading, setLoading] = useState(false);

    const openCreateModal = () => {
        setEditingAthlete(null);
        setFormData({
            name: '',
            type: 'Individual',
            sportTypeId: sportTypes[0]?.id || 1,
            coachId: coaches[0]?.id || 1,
        });
        setIsModalOpen(true);
    };

    const openEditModal = async (athlete: Athlete) => {
        try {
            const res = await fetch(`/api/athletes/${athlete.id}`);
            const data = await res.json();
            setEditingAthlete(data);
            setFormData({
                name: data.name,
                type: data.type,
                sportTypeId: data.sport_type_id,
                coachId: data.coach_id,
            });
            setIsModalOpen(true);
        } catch (error) {
            alert('Error loading athlete data');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAthlete(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingAthlete) {
                // Update
                await fetch(`/api/athletes/${editingAthlete.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                // Create
                await fetch('/api/athletes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            // Refresh the list
            const res = await fetch('/api/athletes');
            const updatedAthletes = await res.json();
            setAthletes(updatedAthletes);
            closeModal();
        } catch (error) {
            alert('Error saving athlete');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this athlete?')) return;

        try {
            await fetch(`/api/athletes/${id}`, { method: 'DELETE' });
            setAthletes(athletes.filter(a => a.id !== id));
        } catch (error) {
            alert('Error deleting athlete');
        }
    };

    return (
        <>
            {/* Add Button */}
            <div className="mb-4 flex justify-end">
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={20} />
                    Add Athlete
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sport</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Coach</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {athletes.map((athlete) => (
                            <tr key={athlete.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {athlete.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <span className={`px-2 py-1 rounded-full text-xs ${athlete.type === 'Individual' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                        {athlete.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{athlete.sport_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{athlete.coach_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => openEditModal(athlete)}
                                        className="text-blue-600 hover:text-blue-800 mx-2"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(athlete.id)}
                                        className="text-red-600 hover:text-red-800 mx-2"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            {editingAthlete ? 'Edit Athlete' : 'Add New Athlete'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    <option value="Individual">Individual</option>
                                    <option value="Team">Team</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coach</label>
                                <select
                                    value={formData.coachId}
                                    onChange={(e) => setFormData({ ...formData, coachId: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    {coaches.map((coach) => (
                                        <option key={coach.id} value={coach.id}>{coach.full_name}</option>
                                    ))}
                                </select>
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
                                    {loading ? 'Saving...' : (editingAthlete ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
