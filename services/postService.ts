import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp, doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc, deleteDoc } from 'firebase/firestore';
import { Post, Comment } from '../types';

const COLLECTION_NAME = 'posts';
export const createPost = async (userId: string, userName: string, userAvatar: string, content: string, goalTitle: string) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      userName,
      userAvatar,
      content,
      goalTitle,
      timestamp: serverTimestamp(),
      reactions: 0,
      likedBy: [],
      isAI: false
    });
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
};

export const toggleLikePost = async (postId: string, userId: string) => {
    const postRef = doc(db, COLLECTION_NAME, postId);
    try {
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
            const postData = postSnap.data() as Post;
            const hasLiked = postData.likedBy?.includes(userId);

            if (hasLiked) {
                await updateDoc(postRef, {
                    reactions: increment(-1),
                    likedBy: arrayRemove(userId)
                });
            } else {
                await updateDoc(postRef, {
                    reactions: increment(1),
                    likedBy: arrayUnion(userId)
                });
            }
        }
    } catch (error) {
        console.error("Error toggling like:", error);
    }
};

export const addComment = async (postId: string, userId: string, userName: string, userAvatar: string, content: string) => {
    try {
        const commentsRef = collection(db, COLLECTION_NAME, postId, 'comments');
        await addDoc(commentsRef, {
            postId,
            userId,
            userName,
            userAvatar,
            content,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

export const subscribeToComments = (postId: string, callback: (comments: Comment[]) => void) => {
    const commentsRef = collection(db, COLLECTION_NAME, postId, 'comments');
    const q = query(commentsRef, orderBy("timestamp", "asc"));

    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate().toLocaleString() || new Date().toISOString()
        })) as Comment[];
        callback(comments);
    });
};


export const deleteComment = async (
  postId: string,
  commentId: string,
  currentUserId: string
) => {
  try {
    // 1️⃣ Get post (to check post owner)
    const postRef = doc(db, COLLECTION_NAME, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new Error("Post does not exist");
    }

    const postData = postSnap.data();
    const postOwnerId = postData.userId;

    // 2️⃣ Get comment (to check comment author)
    const commentRef = doc(db, COLLECTION_NAME, postId, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      throw new Error("Comment does not exist");
    }

    const commentData = commentSnap.data();
    const commentAuthorId = commentData.userId;

    // 3️⃣ Permission check (CRITICAL)
    const canDelete =
      currentUserId === commentAuthorId ||
      currentUserId === postOwnerId;

    if (!canDelete) {
      throw new Error("You are not allowed to delete this comment");
    }

    // 4️⃣ Delete comment
    await deleteDoc(commentRef);

  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};



// ... subscribeToProps ...

export const subscribeToProps = (callback: (posts: Post[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"), limit(50));
  
  return onSnapshot(q, (querySnapshot) => {
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert specific types if needed
      let timestamp = "Just now";
      if (data.timestamp) { 
        // Simple relative time format
        const date = (data.timestamp as Timestamp).toDate();
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // minutes
        if (diff < 60) timestamp = `${diff}m ago`;
        else if (diff < 1440) timestamp = `${Math.floor(diff/60)}h ago`;
        else timestamp = `${Math.floor(diff/1440)}d ago`;
      }

      posts.push({ 
        id: doc.id, 
        ...data,
        timestamp 
      } as Post);
    });
    callback(posts);
  });
};


export const deletePost = async (
  postId: string,
  currentUserId: string
) => {
  try {
    // 1️⃣ Get post reference
    const postRef = doc(db, COLLECTION_NAME, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new Error("Post does not exist");
    }

    const postData = postSnap.data();

    // 2️⃣ Permission check (ONLY post owner)
    if (postData.userId !== currentUserId) {
      throw new Error("You are not allowed to delete this post");
    }

    // 3️⃣ Delete post document
    await deleteDoc(postRef);

  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
