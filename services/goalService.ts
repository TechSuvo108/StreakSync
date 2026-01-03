import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { Goal } from '../types';

const COLLECTION_NAME = 'goals';

export const addGoal = async (goal: Omit<Goal, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), goal);
    return docRef.id;
  } catch (error) {
    console.error("Error adding goal: ", error);
    throw error;
  }
};

export const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
  try {
    const goalRef = doc(db, COLLECTION_NAME, goalId);
    await updateDoc(goalRef, updates);
  } catch (error) {
    console.error("Error updating goal: ", error);
    throw error;
  }
};

export const deleteGoal = async (goalId: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, goalId));
    } catch (error) {
        console.error("Error deleting goal", error);
        throw error;
    }
}

export const subscribeToGoals = (userId: string, callback: (goals: Goal[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
  
  return onSnapshot(q, (querySnapshot) => {
    const goals: Goal[] = [];
    querySnapshot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() } as Goal);
    });
    callback(goals);
  });
};
