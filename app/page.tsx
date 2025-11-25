import { getStats } from '@/lib/db';
import { Trophy, Users, Award, Calendar } from 'lucide-react';

export default async function Home() {
  const stats = await getStats();

  const cards = [
    { title: 'Athletes', value: stats.athletes, icon: Users, color: 'bg-blue-500' },
    { title: 'Coaches', value: stats.coaches, icon: Award, color: 'bg-green-500' },
    { title: 'Competitions', value: stats.competitions, icon: Calendar, color: 'bg-purple-500' },
    { title: 'Awards', value: stats.awards, icon: Trophy, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-600">Sports Competitions Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <div key={card.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <a href="/athletes" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-blue-600">Athletes</h2>
            <p className="text-gray-600">View and manage all athletes</p>
          </a>

          <a href="/coaches" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-blue-600">Coaches</h2>
            <p className="text-gray-600">View and manage coaches</p>
          </a>

          <a href="/reports" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-blue-600">Reports</h2>
            <p className="text-gray-600">View competition reports</p>
          </a>
        </div>
      </div>
    </div>
  );
}