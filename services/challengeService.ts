import { db } from './firebase';
import { collection, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, setDoc, addDoc, deleteDoc, getDoc } from 'firebase/firestore';


export interface Challenge {
    id: string;
    title: string;
    description: string;
    participants: string[]; // array of users who joined
    completedBy?: string[]; // array of users who completed it
    daysLeft: number;
    type: string;
    color: string;
    creatorId?: string; // Optional: user who created it
    startDate?: string;
    progress?: number; // Calculated on frontend
}

const COLLECTION_NAME = 'challenges';

// Seed initial challenges if empty
const SEED_CHALLENGES = [
  {
    id: "c1",
    title: "The 30-Day Reset",
    description: "Build a consistent routine by sticking to one habit for 30 days straight.",
    daysLeft: 12,
    type: "Global Event",
    color: "from-rose-500 to-orange-500",
    participants: []
  },
  {
    id: "c2",
    title: "Mindful Mornings",
    description: "Complete a mindfulness session before 9 AM every day for a week.",
    daysLeft: 5,
    type: "Community Challenge",
    color: "from-indigo-500 to-cyan-500",
    participants: []
  },
  {
    id: "c3",
    title: "Tech Detox Weekend",
    description: "Limit screen time to 1 hour per day this coming weekend.",
    daysLeft: 2,
    type: "Community Challenge",
    color: "from-emerald-500 to-teal-500",
    participants: []
  }
];

export const subscribeToChallenges = (callback: (challenges: Challenge[]) => void) => {
    return onSnapshot(collection(db, COLLECTION_NAME), async (snapshot) => {
        if (snapshot.empty) {
            // Seed data inside the subscription for simplicity if empty
            // In a real app, this would be an admin script
            for (const challenge of SEED_CHALLENGES) {
                await setDoc(doc(db, COLLECTION_NAME, challenge.id), challenge);
            }
        }

        const challenges: Challenge[] = [];
        snapshot.forEach((doc) => {
            challenges.push({ id: doc.id, ...doc.data() } as Challenge);
        });
        callback(challenges as Challenge[]);
    });
};

export const joinChallenge = async (challengeId: string, userId: string) => {
    try {
        const challengeRef = doc(db, COLLECTION_NAME, challengeId);
        await updateDoc(challengeRef, {
            participants: arrayUnion(userId)
        });
    } catch (error) {
        console.error("Error joining challenge", error);
        throw error;
    }
};

export const leaveChallenge = async (challengeId: string, userId: string) => {
    try {
        const challengeRef = doc(db, COLLECTION_NAME, challengeId);
        await updateDoc(challengeRef, {
            participants: arrayRemove(userId),
            // Optional: decide if leaving removes completion status. Usually yes for active challenges.
            completedBy: arrayRemove(userId)
        });
    } catch (error) {
        console.error("Error leaving challenge", error);
        throw error;
    }
};

export const completeChallenge = async (challengeId: string, userId: string) => {
    try {
        const challengeRef = doc(db, COLLECTION_NAME, challengeId);
        await updateDoc(challengeRef, {
            completedBy: arrayUnion(userId)
        });
    } catch (error) {
        console.error("Error completing challenge", error);
        throw error;
    }
};

export const createChallenge = async (challenge: Omit<Challenge, 'id'>) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), challenge);
    } catch (error) {
        console.error("Error creating challenge", error);
        throw error;
    }
};

export const deleteChallenge = async (
  challengeId: string,
  currentUserId: string
) => {
  try {
    const challengeRef = doc(db, COLLECTION_NAME, challengeId);
    const challengeSnap = await getDoc(challengeRef);

    if (!challengeSnap.exists()) {
      throw new Error("Challenge not found");
    }

    const challengeData = challengeSnap.data();

    // 🔐 Only creator can delete
    if (challengeData.creatorId !== currentUserId) {
      throw new Error("You are not allowed to delete this challenge");
    }

    // 🗑️ Delete challenge
    await deleteDoc(challengeRef);

  } catch (error) {
    console.error("Error deleting challenge:", error);
    throw error;
  }
};
