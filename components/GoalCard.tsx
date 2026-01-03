import React, { useState } from 'react';
import { Goal, GoalType } from '../types';
import { Flame, CheckCircle, Shield, BrainCircuit, Heart, Trophy, Trash2 } from 'lucide-react';
import { generateMotivation } from '../services/geminiService';

interface GoalCardProps {
  goal: Goal;
  userName: string;
  onCheckIn: (id: string) => void;
  onShare?: (goal: Goal) => void;
  onRemove?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, userName, onCheckIn, onShare, onRemove }) => {
  const [motivation, setMotivation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetMotivation = async () => {
    setLoading(true);
    const message = await generateMotivation(goal, userName);
    setMotivation(message);
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg hover:border-indigo-500 transition-colors duration-300 relative overflow-hidden group">
      {/* Background Gradient Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-400/10 px-2 py-1 rounded-md mb-2 inline-block">
            {goal.category}
          </span>
          <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
          <p className="text-slate-400 text-sm line-clamp-1">{goal.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1 text-orange-400 font-bold text-lg">
            <Flame className="w-5 h-5 fill-orange-400" />
            <span>{goal.streakDays}</span>
          </div>
          <span className="text-xs text-slate-500 uppercase font-semibold">Day Streak</span>
        </div>
      </div>

      {/* Progress Bar for Type Challenge */}
      {goal.type === GoalType.CHALLENGE && (
        <div className="w-full bg-slate-700 h-2 rounded-full mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full" 
            style={{ width: `${Math.min(goal.streakDays, 100)}%` }} // Assuming 100 day challenge for demo
          ></div>
        </div>
      )}

      {/* Emotional Anchor Section */}
      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 mb-4">
        <div className="flex items-center text-xs text-slate-400 mb-1">
          <Heart className="w-3 h-3 mr-1 text-rose-500" /> Why I started:
        </div>
        <p className="text-sm text-slate-300 italic">"{goal.why}"</p>
      </div>

      {motivation && (
        <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/30 mb-4 animate-fade-in">
           <div className="flex items-center text-xs text-indigo-300 mb-1">
            <BrainCircuit className="w-3 h-3 mr-1" /> AI Coach:
          </div>
          <p className="text-sm text-indigo-100">{motivation}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
           {goal.isFrozen && (
             <div className="flex items-center text-cyan-400 text-xs bg-cyan-900/20 px-2 py-1 rounded">
               <Shield className="w-3 h-3 mr-1" /> Freeze Active
             </div>
           )}
           {onShare && (
              <button 
                onClick={() => onShare(goal)}
                className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center bg-indigo-500/10 px-2 py-1 rounded"
                title="Share as Challenge"
              >
                  <Trophy className="w-3 h-3 mr-1" /> Share
              </button>
           )}
            {onRemove && (
              <button 
                onClick={() => onRemove(goal.id)}
                className="text-red-400 hover:text-red-300 text-xs flex items-center bg-red-500/10 px-2 py-1 rounded"
                title="Remove Streak"
              >
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
              </button>
           )}
        </div>

        <div className="flex space-x-2">
           {/* ... existing buttons ... */}
           <button 
            onClick={handleGetMotivation}
            disabled={loading}
            className="p-2 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title="Get AI Motivation"
           >
             <BrainCircuit className={`w-5 h-5 ${loading ? 'animate-pulse text-indigo-400' : ''}`} />
           </button>
           
           <button 
            onClick={() => onCheckIn(goal.id)}
            disabled={goal.completedToday}
            className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              goal.completedToday 
                ? 'bg-emerald-500/20 text-emerald-400 cursor-default' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25'
            }`}
           >
             {goal.completedToday ? (
               <>
                 <CheckCircle className="w-4 h-4 mr-2" /> Done
               </>
             ) : (
               'Check In'
             )}
           </button>
        </div>
      </div>
    </div>
  );
};
