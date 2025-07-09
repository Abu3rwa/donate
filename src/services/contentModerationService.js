import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";

const flaggedContentRef = collection(db, "flaggedContent");

// Get all flagged content, ordered by createdAt desc
export const getFlaggedContent = async () => {
  const querySnapshot = await getDocs(flaggedContentRef);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Approve content (set status to 'approved')
export const approveContent = async (id) => {
  const docRef = doc(db, "flaggedContent", id);
  await updateDoc(docRef, { status: "approved" });
  return id;
};

// Reject/Delete content (set status to 'rejected' or delete)
export const rejectContent = async (id, { hardDelete = false } = {}) => {
  const docRef = doc(db, "flaggedContent", id);
  if (hardDelete) {
    await deleteDoc(docRef);
    return id;
  } else {
    await updateDoc(docRef, { status: "rejected" });
    return id;
  }
}; 