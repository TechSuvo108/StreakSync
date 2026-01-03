import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { User as AppUser } from '../types';
import { User as FirebaseUser } from 'firebase/auth';


const COLLECTION_NAME = 'users';

export const createUserProfile = async (user: FirebaseUser): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTION_NAME, user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: AppUser = {
        id: user.uid,
        name: user.displayName || 'Anonymous',
        email: user.email || '',
        avatar: user.photoURL || '',
        level: 1,
        xp: 0
      };
      await setDoc(userRef, newUser);
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const subscribeToUserProfile = (uid: string, callback: (user: AppUser | null) => void) => {
  const userRef = doc(db, COLLECTION_NAME, uid);
  return onSnapshot(userRef, 
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as AppUser);
      } else {
        console.log("User document does not exist yet.");
        callback(null);
      }
    },
    (error) => {
      console.error("Error subscribing to user profile:", error);
      callback(null);
    }
  );
};

export const updateUserXP = async (uid: string, xpToAdd: number) => {
    const userRef = doc(db, COLLECTION_NAME, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        const currentData = userSnap.data() as AppUser;
        await updateDoc(userRef, {
            xp: currentData.xp + xpToAdd
        });
    }
};

export const getUsersByGoalCategory = async (category: string, currentUserId: string): Promise<AppUser[]> => {
  try {
    // 1. Get all goals with this category
    const goalsRef = collection(db, 'goals');
    const q = query(goalsRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);

    // 2. Extract unique user IDs (excluding current user)
    const userIds = new Set<string>();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId !== currentUserId) {
        userIds.add(data.userId);
      }
    });

    if (userIds.size === 0) return [];

    // 3. Fetch user profiles (batches of 10 if we were strictly following "in" limits, 
    // but for now we'll fetch all matching IDs. Since 'in' allows max 10, we'll implement a chunking strategy or just fetch individually)
    
    // Simple approach for hackathon: Fetch all users and filter (not scalable but works for demo)
    // Better approach: fetch individual docs
    const users: AppUser[] = [];
    const idArray = Array.from(userIds);
    
    // Chunking for 'in' query limit of 10
    for (let i = 0; i < idArray.length; i += 10) {
        const chunk = idArray.slice(i, i + 10);
        if (chunk.length > 0) {
             const userQuery = query(collection(db, COLLECTION_NAME), where("id", "in", chunk));
             const userSnaps = await getDocs(userQuery);
             userSnaps.forEach(doc => {
                 if (doc.exists()) users.push(doc.data() as AppUser);
             });
        }
    }
    
    return users;

  } catch (error) {
    console.error("Error fetching users by interest:", error);
    return [];
  }
};


export const searchUsersByGoalTitle = async (
  goalQuery: string,
  currentUserId: string
): Promise<AppUser[]> => {
  try {
    if (!goalQuery.trim()) return [];

    // 1️⃣ Search goals whose title contains the query
    const goalsRef = collection(db, 'goals');
    const q = query(
      goalsRef,
      where("title", ">=", goalQuery),
      where("title", "<=", goalQuery + '\uf8ff')
    );

    const goalSnapshot = await getDocs(q);

    // 2️⃣ Collect unique userIds (exclude current user)
    const userIds = new Set<string>();
    goalSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.userId && data.userId !== currentUserId) {
        userIds.add(data.userId);
      }
    });

    if (userIds.size === 0) return [];

    // 3️⃣ Fetch user profiles
    const users: AppUser[] = [];
    const idArray = Array.from(userIds);

    for (let i = 0; i < idArray.length; i += 10) {
      const chunk = idArray.slice(i, i + 10);
      const userQuery = query(
        collection(db, 'users'),
        where("id", "in", chunk)
      );
      const userSnap = await getDocs(userQuery);
      userSnap.forEach(doc => users.push(doc.data() as AppUser));
    }

    return users;

  } catch (error) {
    console.error("Error searching users by goal:", error);
    return [];
  }
};
