import React, { useState } from 'react';
import { GoalType, GoalCategory } from '../types';
import { X, Sparkles, BrainCircuit, Wand2 } from 'lucide-react';
import { suggestCommunityName, generateGoalDetails } from '../services/geminiService';

interface CreateGoalModalProps {
  onClose: () => void;
  onCreate: (title: string, description: string, why: string, type: GoalType, category: GoalCategory, communityName?: string) => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [why, setWhy] = useState('');
  const [type, setType] = useState<GoalType>(GoalType.DAILY);
  const [category, setCategory] = useState<GoalCategory>(GoalCategory.FITNESS);
  const [communityName, setCommunityName] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);

  const handleAutofill = async () => {
    if (!title) return;
    setIsAutofilling(true);
    const { description: desc, why: reason } = await generateGoalDetails(title);
    if (desc) setDescription(desc);
    if (reason) setWhy(reason);
    setIsAutofilling(false);
  };

  const handleSuggestName = async () => {
    if (!title) return;
    setIsSuggesting(true);
    const name = await suggestCommunityName(title, description);
    setCommunityName(name);
    setIsSuggesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(title, description, why, type, category, communityName);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
            Commit to a New Goal
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Goal Title</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                required
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g., Read 30 minutes daily"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                 type="button"
                 onClick={handleAutofill}
                 disabled={!title || isAutofilling}
                 className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center text-sm ${
                   !title 
                     ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                     : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                 }`}
                 title="Auto-generate description & why"
               >
                 {isAutofilling ? (
                   <Sparkles className="w-4 h-4 animate-spin" />
                 ) : (
                   <>
                     <Wand2 className="w-4 h-4 mr-1.5" />
                     Autofill
                   </>
                 )}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
               <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={type}
                onChange={(e) => setType(e.target.value as GoalType)}
               >
                 {Object.values(GoalType).map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
               <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
               >
                 {Object.values(GoalCategory).map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20 resize-none"
              placeholder="Details about your routine..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="bg-indigo-900/10 p-4 rounded-lg border border-indigo-500/20">
             <label className="block text-sm font-bold text-indigo-400 mb-1">Emotional Anchor (Your "Why")</label>
             <p className="text-xs text-slate-500 mb-2">Why does this matter to you? We'll remind you of this when things get tough.</p>
             <textarea 
               required
               className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20 resize-none"
               placeholder="I want to prove to myself that I can be consistent..."
               value={why}
               onChange={(e) => setWhy(e.target.value)}
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-1">Squad Name (Optional)</label>
             <div className="flex space-x-2">
               <input 
                 type="text" 
                 className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                 placeholder="e.g., Morning Milers"
                 value={communityName}
                 onChange={(e) => setCommunityName(e.target.value)}
               />
               <button
                 type="button"
                 onClick={handleSuggestName}
                 disabled={!title || isSuggesting}
                 className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                   !title 
                     ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                     : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
                 }`}
               >
                 {isSuggesting ? (
                   <Sparkles className="w-4 h-4 animate-spin" />
                 ) : (
                   <>
                     <BrainCircuit className="w-4 h-4 mr-2" />
                     AI Suggest
                   </>
                 )}
               </button>
             </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105"
            >
              Create Streak
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
