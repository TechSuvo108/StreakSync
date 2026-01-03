import React from 'react';
import { User, Goal, Achievement } from '../types';
import { Trophy, Star, Zap, Calendar, Medal, Award, Target, TrendingUp } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  goals: Goal[];
}



export const ProfileView: React.FC<ProfileViewProps> = ({ user, goals }) => {
  const totalCompleted = goals.reduce((acc, goal) => acc + (goal.streakDays), 0); // Simplified total checks
  const longestStreak = Math.max(...goals.map(g => g.longestStreak), 0);
  const activeStreaks = goals.filter(g => !g.completedToday).length; // Goals left today
  
  // Calculate level progress (simple logic: current XP % 1000 / 1000)
  const xpForNextLevel = 2000;
  const progressPercent = (user.xp / xpForNextLevel) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile Card */}
      <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-4">
             <div className="flex items-end">
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-lg object-cover"
                />
                <div className="ml-4 mb-1">
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
             </div>
             <div className="bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600 backdrop-blur-sm">
                 <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current Level</span>
                 <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xl">
                     <Medal className="w-5 h-5" />
                     <span>{user.level}</span>
                 </div>
             </div>
          </div>

          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">XP Progress</span>
                <span className="text-indigo-400">{user.xp} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                  <p className="text-slate-400 text-xs font-medium uppercase">Active Goals</p>
                  <p className="text-2xl font-bold text-white">{goals.length}</p>
              </div>
          </div>
          
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center space-x-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                  <p className="text-slate-400 text-xs font-medium uppercase">Longest Streak</p>
                  <p className="text-2xl font-bold text-white">{longestStreak} Days</p>
              </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                  <p className="text-slate-400 text-xs font-medium uppercase">Total Check-ins</p>
                  <p className="text-2xl font-bold text-white">{totalCompleted}</p>
              </div>
          </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Trophy className="w-5 h-5 text-amber-400 mr-2" />
              Recent Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Dynamic Achievements */}
              {longestStreak >= 3 && (
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-indigo-500/50 transition-colors group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-blue-500/20 text-blue-400">
                          <Award className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm mb-1">On Fire</h4>
                      <p className="text-xs text-slate-500">Reached a 3-day streak</p>
                      <p className="text-[10px] text-slate-600 mt-2 text-right">Unlocked</p>
                  </div>
              )}
               {goals.length >= 1 && (
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-indigo-500/50 transition-colors group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-slate-700/50 text-slate-400">
                          <Target className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm mb-1">Goal Setter</h4>
                      <p className="text-xs text-slate-500">Created your first goal</p>
                      <p className="text-[10px] text-slate-600 mt-2 text-right">Unlocked</p>
                  </div>
              )}
               {totalCompleted >= 5 && (
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-indigo-500/50 transition-colors group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-purple-500/20 text-purple-400">
                          <Zap className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm mb-1">Consistent</h4>
                      <p className="text-xs text-slate-500">Completed 5 check-ins</p>
                      <p className="text-[10px] text-slate-600 mt-2 text-right">Unlocked</p>
                  </div>
              )}
              {/* Placeholder for locked */}
              {totalCompleted < 50 && (
                  <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800 opacity-60 grayscale">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-slate-800 text-slate-600">
                          <Trophy className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-400 text-sm mb-1">Master</h4>
                      <p className="text-xs text-slate-600">Reach 50 Check-ins</p>
                      <p className="text-[10px] text-slate-700 mt-2 text-right">Locked</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
