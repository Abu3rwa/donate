import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const expensesRef = collection(db, "expenses");

export const getAllExpenses = async () => {
  const q = orderBy("createdAt", "desc");
  const querySnapshot = await getDocs(expensesRef, q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getExpenseById = async (id) => {
  const docRef = doc(db, "expenses", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Expense not found");
  return { id: docSnap.id, ...docSnap.data() };
};

export const addExpense = async (data) => {
  const docRef = await addDoc(expensesRef, {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data, status: "pending", createdAt: new Date().toISOString() };
};

export const updateExpense = async (id, data) => {
  const docRef = doc(db, "expenses", id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteExpense = async (id) => {
  const docRef = doc(db, "expenses", id);
  await deleteDoc(docRef);
  return id;
}; 