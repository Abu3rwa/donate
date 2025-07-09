import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const expensesRef = collection(db, "expenses");

// Get all pending expenses, ordered by createdAt desc
export const getPendingExpenses = async () => {
  const q = query(expensesRef, where("status", "==", "pending"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Approve expense (set status to 'approved', add optional comment)
export const approveExpense = async (id, comment, admin) => {
  const docRef = doc(db, "expenses", id);
  await updateDoc(docRef, { status: "approved", approvedAt: serverTimestamp(), approvedBy: admin });
  if (comment) {
    await addExpenseComment(id, { text: comment, author: admin, type: "approve" });
  }
  return id;
};

// Reject expense (set status to 'rejected', add optional comment)
export const rejectExpense = async (id, comment, admin) => {
  const docRef = doc(db, "expenses", id);
  await updateDoc(docRef, { status: "rejected", rejectedAt: serverTimestamp(), rejectedBy: admin });
  if (comment) {
    await addExpenseComment(id, { text: comment, author: admin, type: "reject" });
  }
  return id;
};

// Add a comment to an expense
export const addExpenseComment = async (expenseId, { text, author, type = "comment" }) => {
  const commentsRef = collection(db, "expenses", expenseId, "comments");
  const comment = {
    text,
    author,
    type,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(commentsRef, comment);
  return { id: docRef.id, ...comment };
};

// Get all comments for an expense
export const getExpenseComments = async (expenseId) => {
  const commentsRef = collection(db, "expenses", expenseId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}; 