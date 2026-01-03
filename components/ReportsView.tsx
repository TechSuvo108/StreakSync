import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Goal } from '../types';
import { Calendar, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface ReportsViewProps {
  goals: Goal[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ goals }) => {
  // Mock Data for reports
  // Calculate real metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completedToday).length;
  const missedGoals = totalGoals - completedGoals;
  
  const completionData = [
    { name: 'Completed', value: completedGoals || 1 }, // prevent empty chart
    { name: 'Pending', value: missedGoals },
  ];
  
  const COLORS = ['#10b981', '#ef4444'];

  const overallScore = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const totalCheckins = goals.reduce((acc, g) => acc + g.streakDays, 0);

  // Mock monthly trend based on current score
  const monthlyProgress = [
    { name: 'W1', score: Math.max(0, overallScore - 10) },
    { name: 'W2', score: Math.max(0, overallScore - 5) },
    { name: 'W3', score: Math.max(0, overallScore - 2) },
    { name: 'W4', score: overallScore },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Score Card */}
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
            <h3 className="text-slate-400 font-medium text-sm mb-2">Consistency Score</h3>
            <div className="flex items-end space-x-2">
                <span className="text-4xl font-bold text-white">{overallScore}</span>
                <span className="text-indigo-400 font-bold mb-1 text-sm">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Based on today's activity.</p>
         </div>

         {/* Total Check-ins */}
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
            <h3 className="text-slate-400 font-medium text-sm mb-2">Total Check-ins</h3>
            <div className="flex items-end space-x-2">
                <span className="text-4xl font-bold text-white">{totalCheckins}</span>
            </div>
            <p className="text-xs text-emerald-400 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% from last month
            </p>
         </div>

         {/* Freeze Used */}
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
            <h3 className="text-slate-400 font-medium text-sm mb-2">Streak Freezes Used</h3>
            <div className="flex items-end space-x-2">
                <span className="text-4xl font-bold text-white">2</span>
                <span className="text-slate-500 mb-1 text-sm">/ 5</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Refills in 14 days.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-bold text-white mb-6">Completion Rate</h3>
              <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={completionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {completionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{color: '#fff'}} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-bold text-white mb-6">Monthly Trend</h3>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyProgress}>
                         <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {/* Heatmap Placeholder */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-white">Yearly Activity</h3>
               <div className="flex items-center space-x-2 text-xs text-slate-400">
                   <span>Less</span>
                   <div className="flex space-x-1">
                       <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
                       <div className="w-3 h-3 bg-indigo-900 rounded-sm"></div>
                       <div className="w-3 h-3 bg-indigo-700 rounded-sm"></div>
                       <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
                       <div className="w-3 h-3 bg-indigo-300 rounded-sm"></div>
                   </div>
                   <span>More</span>
               </div>
          </div>
          <div className="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-1 h-32">
              {/* Generating a fake heatmap grid */}

              {Array.from({ length: 364 }).map((_, i) => {
                  // Reset to clean state. 
                  // In a real app, we would map each index to a date and check goal history.
                  // For now, we only know about "today" from the goal status.
                  const isToday = i === 363;
                  const hasActivity = isToday && completedGoals > 0;
                  
                  return (
                      <div 
                        key={i} 
                        className={`rounded-sm ${hasActivity ? 'bg-indigo-500' : 'bg-slate-700/50'}`}
                        style={{ opacity: hasActivity ? 1 : 0.2 }}
                        title={isToday ? "Today" : `Day ${i + 1}`}
                      ></div>
                  )
              })}
          </div>
      </div>
    </div>
  );
};
