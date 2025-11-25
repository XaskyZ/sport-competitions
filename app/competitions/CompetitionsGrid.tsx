'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Competition {
    id: number;
    name: string;
    type: string;
    type_id?: number;
}

interface CompetitionType {
    id: number;
    name: string;
}

interface CompetitionsGridProps {
    initialCompetitions: Competition[];
    competitionTypes: CompetitionType[];
}

export default function CompetitionsGrid({ initialCompetitions, competitionTypes }: CompetitionsGridProps) {
    const [competitions, setCompetitions] = useState<Competition[]>(initialCompetitions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        typeId: competitionTypes[0]?.id || 1,
    });
    const [loading, setLoading] = useState(false);

    const openCreateModal = () => {
        setEditingCompetition(null);
        setFormData({ name: '', typeId: competitionTypes[0]?.id || 1 });
        setIsModalOpen(true);
    };

    const openEditModal = async (competition: Competition) => {
        try {
            const res = await fetch(`/api/competitions/${competition.id}`);
            const data = await res.json();
            setEditingCompetition(data);
            setFormData({ name: data.name, typeId: data.type_id });
            setIsModalOpen(true);
        } catch (error) {
            alert('Error loading competition data');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCompetition(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingCompetition) {
                await fetch(`/api/competitions/${editingCompetition.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('/api/competitions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            const res = await fetch('/api/competitions');
            const updatedCompetitions = await res.json();
            setCompetitions(updatedCompetitions);
            closeModal();
        } catch (error) {
            alert('Error saving competition');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this competition?')) return;

        try {
            await fetch(`/api/competitions/${id}`, { method: 'DELETE' });
            setCompetitions(competitions.filter(c => c.id !== id));
        } catch (error) {
            alert('Error deleting competition. Make sure no schedules are assigned to this competition.');
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'World Championship': return 'bg-yellow-100 text-yellow-800';
            case 'National Championship': return 'bg-blue-100 text-blue-800';
            case 'Regional': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
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
                    Add Competition
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map((comp) => (
                    <div key={comp.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative group">
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => openEditModal(comp)}
                                className="text-blue-600 hover:text-blue-800 bg-white rounded-full p-1 shadow"
                                title="Edit"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(comp.id)}
                                className="text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-600">{comp.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(comp.type)}`}>
                            {comp.type}
                        </span>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            {editingCompetition ? 'Edit Competition' : 'Add New Competition'}
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
                                    value={formData.typeId}
                                    onChange={(e) => setFormData({ ...formData, typeId: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    {competitionTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
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
                                    {loading ? 'Saving...' : (editingCompetition ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
