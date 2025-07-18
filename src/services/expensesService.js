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
  where,
  query,
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
  return {
    id: docRef.id,
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
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

export const getExpensesByCampaignId = async (campaignId) => {
  const q = [
    where("campaignId", "==", campaignId),
    orderBy("createdAt", "desc"),
  ];
  const querySnapshot = await getDocs(
    // Compose the query using Firestore's query function
    // (collection, ...query constraints)
    // This is the correct way to use multiple constraints
    // e.g. query(collection(db, 'expenses'), where(...), orderBy(...))
    // But for compatibility, check if query is available
    typeof query === "function" ? query(expensesRef, ...q) : expensesRef
  );
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// CATEGORY BACKEND FUNCTIONS

const categoriesRef = collection(db, "expense_categories");

export const getAllExpenseCategories = async () => {
  const querySnapshot = await getDocs(categoriesRef);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addExpenseCategory = async (category) => {
  const docRef = await addDoc(categoriesRef, {
    ...category,
    createdAt: new Date().toISOString(),
    createdBy: category.createdBy || null, // Add createdBy field
  });
  return { id: docRef.id, ...category, createdBy: category.createdBy || null };
};

export const updateExpenseCategory = async (id, data) => {
  const docRef = doc(db, "expense_categories", id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteExpenseCategory = async (id) => {
  const docRef = doc(db, "expense_categories", id);
  await deleteDoc(docRef);
  return id;
};
