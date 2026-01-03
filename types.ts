export enum GoalType {
  DAILY = 'Daily Habit',
  PROJECT = 'Long-term Project',
  CHALLENGE = 'Time-bound Challenge'
}

export enum GoalCategory {
  FITNESS = 'Fitness',
  LEARNING = 'Learning',
  MINDFULNESS = 'Mindfulness',
  CAREER = 'Career',
  CREATIVE = 'Creative',
  OTHER = 'Other'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  why: string; // The "Emotional Anchor"
  type: GoalType;
  category: GoalCategory;
  startDate: string; // ISO Date
  streakDays: number;
  longestStreak: number;
  isFrozen: boolean; // Streak freeze active
  communityId: string; // Linked community
  communityName?: string; // AI Suggested Squad Name
  completedToday: boolean;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  goalTitle: string;
  timestamp: string;
  reactions: number;
  likedBy?: string[];
  isAI?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface Community {
  id: string;
  name: string;
  memberCount: number;
  description: string;
}
