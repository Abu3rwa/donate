import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";

// Map type to Firestore collection names
const COLLECTIONS = {
  expense: "expenses",
  donation: "donations",
  campaign: "campaigns",
  post: "posts",
  story: "stories",
};

const COMMENT_COLLECTIONS = {
  expense: "expense_comments",
  donation: "donation_comments",
  campaign: "campaign_comments",
  post: "post_comments",
  story: "story_comments",
};

export const moderationService = {
  // Fetch all items of a given type (optionally filter by status)
  getItems: async (type, { status } = {}) => {
    try {
      const colName = COLLECTIONS[type];
      if (!colName) throw new Error("Unknown moderation type: " + type);
      let q = collection(db, colName);
      if (status) {
        q = query(q, where("status", "==", status));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  },
  // Delete a comment by ID
  deleteComment: async (type, commentId) => {
    try {
      const commentColName = COMMENT_COLLECTIONS[type];
      if (!commentColName) throw new Error("Unknown moderation type: " + type);
      // Dynamically import deleteDoc to avoid circular deps
      const { deleteDoc } = await import("firebase/firestore");
      const commentDoc = doc(db, commentColName, commentId);
      await deleteDoc(commentDoc);
      return { success: true };
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
  // Approve an item
  approveItem: async (type, id, comment, author) => {
    try {
      const colName = COLLECTIONS[type];
      const commentColName = COMMENT_COLLECTIONS[type];
      if (!colName || !commentColName)
        throw new Error("Unknown moderation type: " + type);
      const itemRef = doc(db, colName, id);
      await updateDoc(itemRef, { status: "approved" });
      if (comment) {
        const commentCol = collection(db, commentColName);
        await addDoc(commentCol, {
          [`${type}Id`]: id,
          type: "approve",
          text: comment,
          author,
          createdAt: new Date().toISOString(),
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Error approving item:", error);
      throw error;
    }
  },

  // Reject an item
  rejectItem: async (type, id, comment, author) => {
    try {
      const colName = COLLECTIONS[type];
      const commentColName = COMMENT_COLLECTIONS[type];
      if (!colName || !commentColName)
        throw new Error("Unknown moderation type: " + type);
      const itemRef = doc(db, colName, id);
      await updateDoc(itemRef, { status: "rejected" });
      if (comment) {
        const commentCol = collection(db, commentColName);
        await addDoc(commentCol, {
          [`${type}Id`]: id,
          type: "reject",
          text: comment,
          author,
          createdAt: new Date().toISOString(),
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Error rejecting item:", error);
      throw error;
    }
  },

  // Add a comment to an item
  addComment: async (type, id, newComment) => {
    try {
      const commentColName = COMMENT_COLLECTIONS[type];
      if (!commentColName) throw new Error("Unknown moderation type: " + type);
      const commentCol = collection(db, commentColName);
      await addDoc(commentCol, {
        [`${type}Id`]: id,
        ...newComment,
        type: "comment",
        createdAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Fetch all comments for an item
  getComments: async (type, id) => {
    try {
      const commentColName = COMMENT_COLLECTIONS[type];
      if (!commentColName) throw new Error("Unknown moderation type: " + type);
      const commentsCol = query(
        collection(db, commentColName),
        where(`${type}Id`, "==", id)
      );
      const commentSnapshot = await getDocs(commentsCol);
      return commentSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
};
