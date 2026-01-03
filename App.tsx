import React, { useState, useEffect } from 'react';
import { User, Goal, GoalType, GoalCategory, Post } from './types';
import { GoalCard } from './components/GoalCard';
import StatsView from './components/StatsView';
import CommunityFeed from './components/CommunityFeed';
import { CreateGoalModal } from './components/CreateGoalModal';
import { ProfileView } from './components/ProfileView';
import { ChallengesView } from './components/ChallengesView';
import { ReportsView } from './components/ReportsView';
import { LayoutDashboard, Users, UserCircle, Plus, Trophy, Activity, Filter, LogOut } from 'lucide-react';
import { suggestCommunityName } from './services/geminiService';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { createUserProfile, subscribeToUserProfile, updateUserXP } from './services/userService';
import { addGoal, subscribeToGoals, updateGoal, deleteGoal } from './services/goalService';
import { createPost, subscribeToProps, toggleLikePost } from './services/postService';
import { subscribeToChallenges, joinChallenge, leaveChallenge, completeChallenge, Challenge, createChallenge } from './services/challengeService';

// Mock Posts for now


const App: React.FC = () => {
    const { user: authUser, loading: authLoading, logout } = useAuth();
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    const [activeTab, setActiveTab] = useState<'dashboard' | 'community' | 'challenges' | 'reports' | 'profile'>('dashboard');
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const categories = ['All', ...Object.values(GoalCategory)];

    // Data Subscription Effect
    useEffect(() => {
        if (authUser) {
            // Ensure profile exists
            createUserProfile(authUser);

            const unsubUser = subscribeToUserProfile(authUser.uid, (profile) => {
                setUserProfile(profile);
            });
            
            const unsubGoals = subscribeToGoals(authUser.uid, (fetchedGoals) => {
                setGoals(fetchedGoals);
            });

            // Subscribe to all posts (for community feel, we see everyone's posts)
            const unsubPosts = subscribeToProps((fetchedPosts) => {
                setPosts(fetchedPosts);
            });

            const unsubChallenges = subscribeToChallenges((fetchedChallenges) => {
                setChallenges(fetchedChallenges);
            });

            return () => {
                unsubUser();
                unsubGoals();
                unsubPosts();
                unsubChallenges();
            };
        } else {
            setUserProfile(null);
            setGoals([]);
        }
    }, [authUser]);


    const handleCreateGoal = async (title: string, description: string, why: string, type: GoalType, category: GoalCategory) => {
        if (!authUser) return;

        const newGoal: Omit<Goal, 'id'> = {
            userId: authUser.uid,
            title,
            description,
            why,
            type,
            category,
            startDate: new Date().toISOString(),
            streakDays: 0,
            longestStreak: 0,
            isFrozen: false,
            communityId: 'temp',
            completedToday: false
        };

        // In a real app, we might get community suggestion here
        // const commName = await suggestCommunityName(title, description);

        try {
            await addGoal(newGoal);
            setShowCreateModal(false);
        } catch (error) {
            console.error("Failed to create goal", error);
        }
    };

    const handlePost = async (content: string, goalTitle: string) => {
        if (!authUser || !userProfile) return;
        try {
            await createPost(authUser.uid, userProfile.name, userProfile.avatar, content, goalTitle);
        } catch (error) {
            console.error("Failed to post", error);
        }
    };

    const handleLikePost = async (postId: string) => {
        if (!authUser) return;
        try {
            await toggleLikePost(postId, authUser.uid);
        } catch (error) {
            console.error("Failed to like post", error);
        }
    };

    const handleChallengeUser = async (targetUserId: string, targetUserName: string) => {
        if (!authUser || !userProfile) return;
        try {
            await createChallenge({
                title: `${userProfile.name} vs ${targetUserName}`,
                description: `1v1 Streak Battle in ${activeCategory}`,
                daysLeft: 7,
                type: '1v1 Battle',
                color: 'from-rose-500 to-pink-600',
                participants: [authUser.uid, targetUserId],
                completedBy: [],
                creatorId: authUser.uid,
                startDate: new Date().toISOString()
            });
            alert(`Challenge sent to ${targetUserName}!`);
        } catch (error) {
            console.error("Failed to challenge user", error);
        }
    };

    const handleCheckIn = async (id: string) => {
        if (!authUser) return;
        
        const goal = goals.find(g => g.id === id);
        if (goal && !goal.completedToday) {
            try {
                await updateGoal(id, {
                    completedToday: true,
                    streakDays: goal.streakDays + 1,
                    longestStreak: Math.max(goal.longestStreak, goal.streakDays + 1)
                });
                // XP gain
                await updateUserXP(authUser.uid, 50);
            } catch (error) {
                console.error("Failed to check in", error);
            }
        }
    };

    const handleJoinChallenge = async (challengeId: string) => {
        if (!authUser) return;
        try {
            await joinChallenge(challengeId, authUser.uid);
        } catch (error) {
            console.error("Failed to join challenge", error);
        }
    };

    const handleLeaveChallenge = async (challengeId: string) => {
        if (!authUser) return;
        try {
            await leaveChallenge(challengeId, authUser.uid);
        } catch (error) {
            console.error("Failed to leave challenge", error);
        }
    };

    const handleCompleteChallenge = async (challengeId: string) => {
        if (!authUser) return;
        try {
            await completeChallenge(challengeId, authUser.uid);
            await updateUserXP(authUser.uid, 500); // Big bonus for completion
        } catch (error) {
            console.error("Failed to complete challenge", error);
        }
    };

    const handleCreateChallenge = async (challengeData: Omit<Challenge, 'id'>) => {
         if (!authUser) return;
         try {
             await createChallenge({
                 ...challengeData,
                 creatorId: authUser.uid
             });
         } catch(error) {
             console.error("Failed to create challenge", error);
         }
    };

    const handleShareGoal = async (goal: Goal) => {
        if (!authUser) return;
        try {
            await createChallenge({
                title: `Challenge: ${goal.title}`,
                description: `Join me in this challenge! ${goal.description}`,
                daysLeft: 30, // Default duration
                type: 'Community Challenge',
                color: 'from-orange-500 to-amber-500',
                participants: [authUser.uid],
                completedBy: [],
                creatorId: authUser.uid,
                startDate: new Date().toISOString()
            });
            // Optional: Notify user of success
        } catch (error) {
            console.error("Failed to share goal as challenge", error);
        }
    };

    const handleRemoveGoal = async (goalId: string) => {
        if (!authUser) return;
        if (window.confirm("Are you sure you want to remove this streak? This action cannot be undone.")) {
             try {
                 await deleteGoal(goalId);
             } catch (error) {
                 console.error("Failed to delete goal", error);
             }
        }
    };

    // Filter Goals based on active Category
    const filteredGoals = goals.filter(g => activeCategory === 'All' || g.category === activeCategory);

    // Auth Loading State
    if (authLoading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
    }

    // Unauthenticated State
    if (!authUser) {
        return <LoginScreen />;
    }

    // Profile Loading State
    if (!userProfile) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Setting up profile...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex">
        
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm fixed h-full z-20">
            <div className="p-6 flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">StreakSync</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-4">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
            </button>
            
            <button 
                onClick={() => setActiveTab('community')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === 'community' ? 'bg-indigo-600/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Users className="w-5 h-5" />
                <span>Community</span>
            </button>


            <button 
                onClick={() => setActiveTab('challenges')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === 'challenges' ? 'bg-indigo-600/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Trophy className="w-5 h-5" />
                <span>Challenges</span>
            </button>
            
            <button 
                onClick={() => setActiveTab('reports')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-indigo-600/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Activity className="w-5 h-5" />
                <span>Reports</span>
            </button>
            </nav>

            <div className="p-4 border-t border-slate-800">
            <div 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-3 mb-4 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'profile' ? 'bg-indigo-600/20 border border-indigo-500/50' : 'bg-slate-800/50 hover:bg-slate-800'}`}
                >
                <img src={userProfile.avatar || "https://ui-avatars.com/api/?name=" + userProfile.name} alt="Profile" className="w-10 h-10 rounded-full border border-indigo-500" />
                <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{userProfile.name}</p>
                <div className="flex items-center text-xs text-indigo-400">
                    <span>Level {userProfile.level}</span>
                    <span className="mx-1">•</span>
                    <span>{userProfile.xp} XP</span>
                </div>
                </div>
            </div>
            <button 
                onClick={() => logout()}
                className="flex items-center space-x-2 text-slate-500 hover:text-red-400 text-sm transition-colors w-full px-2">
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
            </button>
            </div>
        </aside>

        {/* Mobile Nav */}
        <nav className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 z-40 lg:hidden">
            <div className="flex justify-around items-center h-16 px-2">
            <button onClick={() => setActiveTab('dashboard')} className={`p-2 ${activeTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-500'}`}>
                <LayoutDashboard className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('community')} className={`p-2 ${activeTab === 'community' ? 'text-indigo-400' : 'text-slate-500'}`}>
                <Users className="w-6 h-6" />
            </button>
            <button onClick={() => setShowCreateModal(true)} className="p-3 bg-indigo-600 rounded-full text-white -mt-6 border-4 border-slate-950 shadow-lg shadow-indigo-500/30">
                <Plus className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('challenges')} className={`p-2 ${activeTab === 'challenges' ? 'text-indigo-400' : 'text-slate-500'}`}>
                <Trophy className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('profile')} className={`p-2 ${activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-500'}`}>
                <UserCircle className="w-6 h-6" />
            </button>
            </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto h-screen pb-24 lg:pb-8">
            
            {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Today's Focus</h1>
                    <p className="text-slate-400">You have {filteredGoals.filter(g => !g.completedToday).length} goals remaining today.</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="hidden lg:flex bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-indigo-500/25 items-center transition-transform transform hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Streak
                </button>
                </header>

                {/* Categories Filter */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <Filter className="w-5 h-5" />
                    </div>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                activeCategory === cat 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                {/* Active Challenges Section */}
                {challenges.filter(c => c.participants.includes(authUser.uid)).length > 0 && (
                     <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Active Challenges</h2>
                            <button onClick={() => setActiveTab('challenges')} className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {challenges.filter(c => c.participants.includes(authUser.uid)).map(challenge => (
                                <div key={challenge.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${challenge.color} flex items-center justify-center`}>
                                            <Trophy className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                                            {challenge.daysLeft}d left
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-200 text-sm mb-1 truncate">{challenge.title}</h3>
                                    <p className="text-xs text-slate-500 mb-3 line-clamp-1">{challenge.description}</p>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}

                <StatsView goals={goals} />

                {filteredGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredGoals.map(goal => (
                         <GoalCard 
                             key={goal.id} 
                             goal={goal} 
                             userName={userProfile.name}
                             onCheckIn={handleCheckIn}
                             onShare={handleShareGoal}
                             onRemove={handleRemoveGoal}
                         />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                        <div className="bg-slate-800 p-4 rounded-full mb-4">
                            <Filter className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">No goals found</h3>
                        <p className="text-slate-500">No goals match the "{activeCategory}" category.</p>
                    </div>
                )}
            </div>
            )}
            {activeTab === 'community' && (
            <div className="animate-fade-in max-w-5xl mx-auto">
                <CommunityFeed 
                    posts={posts} 
                    onPost={handlePost} 
                    onLike={handleLikePost}
                    onChallengeUser={handleChallengeUser}
                    currentUserId={authUser.uid}
                    currentUserAvatar={userProfile.avatar}
                    currentUserName={userProfile.name}
                />
            </div>
            )}

            {activeTab === 'challenges' && (
                <div className="max-w-5xl mx-auto">
                    <ChallengesView 
                        challenges={challenges} 
                        userId={authUser.uid} 
                        onJoin={handleJoinChallenge}
                        onLeave={handleLeaveChallenge}
                        onComplete={handleCompleteChallenge}
                        onCreate={handleCreateChallenge}
                    />
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="max-w-5xl mx-auto">
                    <ReportsView goals={goals} />
                </div>
            )}

            {activeTab === 'profile' && (
            <div className="max-w-5xl mx-auto">
                <ProfileView user={userProfile} goals={goals} />
            </div>
            )}
        </main>

        {showCreateModal && (
            <CreateGoalModal 
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateGoal}
            />
        )}
        </div>
    );
};

export default App;