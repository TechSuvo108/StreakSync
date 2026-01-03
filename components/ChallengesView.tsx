import React, { useState } from 'react';
import { Trophy, Users, Clock, Target, ArrowRight, Zap, CheckCircle, XCircle, Plus, Calendar, Trash2 } from 'lucide-react';
import { Challenge } from '../services/challengeService';
import { deleteChallenge } from '../services/challengeService';


interface ChallengesViewProps {
    challenges: Challenge[];
    userId: string;
    onJoin: (id: string) => void;
    onLeave: (id: string) => void;
    onComplete: (id: string) => void;
    onCreate: (data: any) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ challenges, userId, onJoin, onLeave, onComplete, onCreate }) => {
    const [showCreate, setShowCreate] = useState(false);
    const [showPast, setShowPast] = useState(false);

    // Create Form State
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newDays, setNewDays] = useState(7);

    const activeChallenges = challenges.filter(c => c.daysLeft > 0 || !showPast); // Simplified filter
    const displayedChallenges = showPast ? challenges.filter(c => c.daysLeft <= 0) : activeChallenges;

    const handleDeleteChallenge = async (challengeId: string) => {
        const confirmDelete = window.confirm("Delete this challenge for everyone?");
        if (!confirmDelete) return;

        try {
            await deleteChallenge(challengeId, userId);
        } catch (error) {
            console.error("Failed to delete challenge", error);
        }
    };


    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate({
            title: newTitle,
            description: newDesc,
            daysLeft: newDays,
            type: 'Community Challenge',
            color: 'from-fuchsia-500 to-pink-500',
            participants: [],
            startDate: new Date().toISOString()
        });
        setShowCreate(false);
        setNewTitle('');
        setNewDesc('');
    };

    if (showCreate) {
        return (
            <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl border border-slate-700 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-4">Create New Challenge</h2>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Challenge Title</label>
                        <input
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                            placeholder="e.g., 7 Days of Code"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Description</label>
                        <textarea
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none h-24"
                            placeholder="What's the goal?"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Duration (Days)</label>
                        <input
                            type="number"
                            value={newDays}
                            onChange={e => setNewDays(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                            min="1"
                            max="365"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowCreate(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold"
                        >
                            Create Challenge
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {showPast ? 'Past Challenges' : 'Active Challenges'}
                    </h2>
                    <p className="text-slate-400">Push your limits and earn exclusive badges.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center shadow-lg hover:shadow-indigo-500/25 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New
                    </button>
                    <button
                        onClick={() => setShowPast(!showPast)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center bg-slate-800 px-3 py-2 rounded-lg"
                    >
                        {showPast ? 'View Active' : 'View Past'} <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${showPast ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {!showPast && (
                    <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 shadow-2xl">
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="mb-6 md:mb-0 max-w-xl">
                                <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white mb-4 backdrop-blur-md">
                                    <Zap className="w-3 h-3 text-yellow-300" />
                                    <span>GLOBAL EVENT</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Winter Arc: 90 Days of Focus</h3>
                                <p className="text-indigo-100 mb-6">Join the global movement to end the year strong.</p>

                            </div>

                            <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors transform hover:scale-105">
                                Join Event
                            </button>
                        </div>
                    </div>
                )}

                {displayedChallenges.map(challenge => {
                    const joined = challenge.participants.includes(userId);
                    const completed = challenge.completedBy?.includes(userId);

                    return (
                        <div key={challenge.id} className={`bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-colors group ${completed ? 'opacity-75' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${challenge.color} flex items-center justify-center shadow-lg`}>
                                    {completed ? <CheckCircle className="w-6 h-6 text-white" /> : <Trophy className="w-6 h-6 text-white" />}
                                </div>
                                <div className="flex space-x-2">
                                    {completed ? (
                                        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded flex items-center">
                                            <CheckCircle className="w-3 h-3 mr-1" /> COMPLETED
                                        </span>
                                    ) : joined ? (
                                        <div className="flex space-x-2">
                                            {/* DELETE CHALLENGE (only creator) */}
                                            {challenge.creatorId === userId && (
                                                <button
                                                    onClick={() => handleDeleteChallenge(challenge.id)}
                                                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                                                    title="Delete Challenge"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}

                                            {completed ? (
                                                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded flex items-center">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> COMPLETED
                                                </span>
                                            ) : joined ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => onComplete(challenge.id)}
                                                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                                                    >
                                                        Complete
                                                    </button>
                                                    <button
                                                        onClick={() => onLeave(challenge.id)}
                                                        className="bg-slate-700 hover:bg-rose-600/20 hover:text-rose-400 text-slate-400 text-xs font-bold px-3 py-1.5 rounded transition-colors"
                                                    >
                                                        Leave
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => onJoin(challenge.id)}
                                                    className="bg-slate-700 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                                                >
                                                    JOIN
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onJoin(challenge.id)}
                                            className="bg-slate-700 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                                        >
                                            JOIN
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h4 className="text-lg font-bold text-white mb-2">{challenge.title}</h4>
                            <p className="text-slate-400 text-sm mb-4 h-12 line-clamp-2">{challenge.description}</p>

                            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50 pt-4 mt-2">
                                <div className="flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    {challenge.participants.length.toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {activeChallenges.includes(challenge) ? `${challenge.daysLeft} days left` : 'Ended'}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
