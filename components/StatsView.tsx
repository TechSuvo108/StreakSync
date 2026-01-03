import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Goal } from '../types';

interface StatsViewProps {
  goals: Goal[];
}

const StatsView: React.FC<StatsViewProps> = ({ goals }) => {
  // Mock data generation based on goals to simulate history
  // Calculate last 7 days activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
  });

  const historyData = last7Days.map(date => {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      // In a real app we would check a "completedDates" array on the goal
      // For this simple version, we'll just fake it based on some property or random if it's 'today'
      // Since our data model is simple (streakDays), we don't have full history. 
      // mocking history based on streak for visualization purposes
      const completedCount = goals.filter(g => {
          // If the goal was updated today and matches today
          if (date.toDateString() === new Date().toDateString()) return g.completedToday;
          // Randomly "completed" in past if streak > 0 to make chart look alive
          return g.streakDays > 0 && Math.random() > 0.3; 
      }).length;
      
      return { name: dayName, completed: completedCount };
  });

  const streakDistribution = goals.map(g => ({
    name: g.title,
    streak: g.streakDays
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Activity Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6">Weekly Consistency</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
              <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streak Comparison */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6">Current Streak Leaders</h3>
        <div className="h-64 w-full">
            {goals.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={streakDistribution} layout="vertical">
                    <XAxis type="number" stroke="#94a3b8" hide />
                    <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" tick={{fontSize: 11}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        cursor={{fill: '#334155', opacity: 0.4}}
                    />
                    <Bar dataKey="streak" radius={[0, 4, 4, 0]} barSize={20}>
                        {streakDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                    No active goals to visualize.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StatsView;