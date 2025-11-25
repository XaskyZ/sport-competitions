'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Coach {
    id: number;
    full_name: string;
}

interface CoachesTableProps {
    initialCoaches: Coach[];
}

export default function CoachesTable({ initialCoaches }: CoachesTableProps) {
    const [coaches, setCoaches] = useState<Coach[]>(initialCoaches);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
    const [formData, setFormData] = useState({ fullName: '' });
    const [loading, setLoading] = useState(false);

    const openCreateModal = () => {
        setEditingCoach(null);
        setFormData({ fullName: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (coach: Coach) => {
        setEditingCoach(coach);
        setFormData({ fullName: coach.full_name });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCoach(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingCoach) {
                await fetch(`/api/coaches/${editingCoach.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('/api/coaches', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            const res = await fetch('/api/coaches');
            const updatedCoaches = await res.json();
            setCoaches(updatedCoaches);
            closeModal();
        } catch (error) {
            alert('Error saving coach');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this coach?')) return;

        try {
            await fetch(`/api/coaches/${id}`, { method: 'DELETE' });
            setCoaches(coaches.filter(c => c.id !== id));
        } catch (error) {
            alert('Error deleting coach. Make sure no athletes are assigned to this coach.');
        }
    };

    return (
        <>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={20} />
                    Add Coach
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {coaches.map((coach) => (
                            <tr key={coach.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{coach.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{coach.full_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => openEditModal(coach)}
                                        className="text-blue-600 hover:text-blue-800 mx-2"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coach.id)}
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            {editingCoach ? 'Edit Coach' : 'Add New Coach'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ fullName: e.target.value })}
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
                                    {loading ? 'Saving...' : (editingCoach ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
