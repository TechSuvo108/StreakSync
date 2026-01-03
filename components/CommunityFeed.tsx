import React, { useState, useEffect } from 'react';
import { Post, GoalCategory, User, Comment as PostComment } from '../types';
import { searchUsersByGoalTitle } from '../services/userService';

import {
    addComment,
    subscribeToComments,
    deleteComment,
    deletePost
} from '../services/postService';

import { Search, UserPlus, Heart, MessageCircle, Trophy, Send, Trash2 } from 'lucide-react';



interface CommunityFeedProps {
    posts: Post[];
    onPost: (content: string, goalTitle: string) => void;
    onLike: (postId: string) => void;
    onChallengeUser: (targetUserId: string, targetUserName: string) => void;
    currentUserId: string;
    currentUserAvatar?: string;
    currentUserName?: string;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({
    posts,
    onPost,
    onLike,
    onChallengeUser,
    currentUserId,
    currentUserAvatar = '',
    currentUserName = 'User'
}) => {
    const [newPost, setNewPost] = useState('');
    const [selectedGoal, setSelectedGoal] = useState('General Update');

    // Comment State
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(false);

    // Partner Finder State
    const [searchGoal, setSearchGoal] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searching, setSearching] = useState(false);


    useEffect(() => {
        let unsub: () => void;
        if (activeCommentPostId) {
            setCommentsLoading(true);
            unsub = subscribeToComments(activeCommentPostId, (fetchedComments) => {
                setComments(fetchedComments);
                setCommentsLoading(false);
            });
        } else {
            setComments([]);
        }
        return () => {
            if (unsub) unsub();
        };
    }, [activeCommentPostId]);

    const handleSearch = async () => {
        setSearching(true);
        const users = await searchUsersByGoalTitle(searchGoal, currentUserId);
        setSearchResults(users);
        setSearching(false);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPost.trim()) {
            onPost(newPost, selectedGoal);
            setNewPost('');
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeCommentPostId || !newComment.trim()) return;

        try {
            await addComment(activeCommentPostId, currentUserId, currentUserName, currentUserAvatar, newComment);
            setNewComment('');
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await deletePost(postId, currentUserId);
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        try {
            await deleteComment(postId, commentId, currentUserId);
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };



    const toggleComments = (postId: string) => {
        if (activeCommentPostId === postId) {
            setActiveCommentPostId(null);
        } else {
            setActiveCommentPostId(postId);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed - Left 2/3 */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                    {/* ... existing form code ... */}
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share your progress..."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[80px]"
                        />
                        <div className="flex justify-between items-center mt-3">
                            <select
                                value={selectedGoal}
                                onChange={(e) => setSelectedGoal(e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-slate-400 text-xs rounded px-2 py-1 focus:outline-none"
                            >
                                <option>General Update</option>
                                <option>Morning Routine</option>
                                <option>Gym Session</option>
                                <option>Coding Streak</option>
                            </select>
                            <button
                                type="submit"
                                disabled={!newPost.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Community Pulse</h3>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-750 transition-colors">
                            <div className="flex items-start space-x-3">
                                <img
                                    src={post.userAvatar}
                                    alt={post.userName}
                                    className="w-10 h-10 rounded-full border-2 border-indigo-500/30"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-slate-200 text-sm">
                                                {post.userName}
                                                {post.isAI && (
                                                    <span className="ml-2 px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded border border-indigo-500/30">
                                                        AI Guide
                                                    </span>
                                                )}
                                            </h4>
                                            <span className="text-xs text-slate-500 block mb-1">
                                                working on <span className="text-indigo-400">{post.goalTitle}</span> • {post.timestamp}
                                            </span>
                                        </div>

                                        {/* 🗑️ DELETE POST BUTTON */}
                                        {post.userId === currentUserId && (
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="text-red-400 hover:text-red-300"
                                                title="Delete post"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>


                                    <p className="text-slate-300 text-sm mb-3 mt-1 leading-relaxed">{post.content}</p>

                                    <div className="flex items-center space-x-4 mb-2">
                                        <button
                                            onClick={() => onLike(post.id)}
                                            className="flex items-center space-x-1 group"
                                        >
                                            <div className={`p-1.5 rounded-full transition-colors ${post.likedBy?.includes(currentUserId)
                                                ? 'bg-rose-500/20'
                                                : 'bg-slate-700/50 group-hover:bg-rose-500/20'
                                                }`}>
                                                <Heart className={`w-3.5 h-3.5 transition-colors ${post.likedBy?.includes(currentUserId)
                                                    ? 'text-rose-500 fill-rose-500'
                                                    : 'text-slate-400 group-hover:text-rose-500'
                                                    }`} />
                                            </div>
                                            <span className={`text-xs ${post.likedBy?.includes(currentUserId)
                                                ? 'text-rose-500'
                                                : 'text-slate-400 group-hover:text-rose-500'
                                                }`}>{post.reactions}</span>
                                        </button>

                                        <button
                                            onClick={() => toggleComments(post.id)}
                                            className={`flex items-center space-x-1 group ${activeCommentPostId === post.id ? 'opacity-100' : 'opacity-70'}`}
                                        >
                                            <div className="p-1.5 rounded-full bg-slate-700/50 group-hover:bg-blue-500/20 transition-colors">
                                                <MessageCircle className={`w-3.5 h-3.5 group-hover:text-blue-500 transition-colors ${activeCommentPostId === post.id ? 'text-blue-500' : 'text-slate-400'}`} />
                                            </div>
                                            <span className={`text-xs group-hover:text-blue-500 ${activeCommentPostId === post.id ? 'text-blue-500' : 'text-slate-400'}`}>Reply</span>
                                        </button>

                                        <button className="flex items-center space-x-1 group" onClick={() => alert("Support feature coming soon!")}>
                                            <div className="p-1.5 rounded-full bg-slate-700/50 group-hover:bg-amber-500/20 transition-colors">
                                                <Trophy className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                                            </div>
                                            <span className="text-xs text-slate-400 group-hover:text-amber-500">Support</span>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {activeCommentPostId === post.id && (
                                        <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in">
                                            <div className="space-y-3 mb-4">
                                                {commentsLoading ? (
                                                    <p className="text-xs text-slate-500 text-center">Loading comments...</p>
                                                ) : comments.length > 0 ? (
                                                    comments.map(comment => (
                                                        <div key={comment.id} className="flex space-x-2">
                                                            <img src={comment.userAvatar} alt={comment.userName} className="w-6 h-6 rounded-full" />
                                                            <div className="bg-slate-700/30 rounded-lg p-2 flex-1">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-xs font-semibold text-slate-300">
                                                                        {comment.userName}
                                                                    </span>

                                                                    {(comment.userId === currentUserId || post.userId === currentUserId) && (
                                                                        <button
                                                                            onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                            className="text-red-400 hover:text-red-300"
                                                                            title="Delete comment"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <p className="text-xs text-slate-400">{comment.content}</p>
                                                            </div>

                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-slate-500 text-center italic">Be the first to reply!</p>
                                                )}
                                            </div>

                                            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
                                                <img src={currentUserAvatar || `https://ui-avatars.com/api/?name=${currentUserName}`} className="w-6 h-6 rounded-full" />
                                                <input
                                                    type="text"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Write a reply..."
                                                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-full px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                                                />
                                                <button type="submit" disabled={!newComment.trim()} className="p-1.5 bg-indigo-600 rounded-full text-white disabled:opacity-50">
                                                    <Send className="w-3 h-3" />
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar - Partner Finder - Right 1/3 */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-bold text-white">Find Partners</h3>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-slate-400 mb-1 block">Search by Goal</label>

                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="e.g. Gym, Coding, Meditation"
                                value={searchGoal}
                                onChange={(e) => setSearchGoal(e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded-lg text-sm"
                            >
                                Search
                            </button>
                        </div>

                    </div>

                    <div className="space-y-3">
                        {searching ? (
                            <div className="text-center py-4 text-slate-500 text-sm">Searching...</div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(user => (
                                <div key={user.id} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg border border-slate-700 hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center space-x-3">
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                                            <p className="text-xs text-slate-500">Lvl {user.level}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onChallengeUser(user.id, user.name)}
                                        className="p-2 hover:bg-slate-600 rounded-lg text-indigo-400 hover:text-indigo-300"
                                        title="Challenge"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 border border-slate-700 border-dashed rounded-lg">
                                <p className="text-slate-400 text-sm">No users found.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityFeed;