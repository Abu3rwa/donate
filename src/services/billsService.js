import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const getBillsForExpense = async (expenseId) => {
  const billsRef = collection(db, "expenses", expenseId, "bills");
  const q = orderBy("createdAt", "desc");
  const querySnapshot = await getDocs(billsRef, q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const uploadBillFile = async (expenseId, file) => {
  const storageRef = ref(storage, `bills/${expenseId}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const addBillToExpense = async (expenseId, bill) => {
  let fileUrl = bill.fileUrl;
  if (bill.file && bill.file instanceof File) {
    fileUrl = await uploadBillFile(expenseId, bill.file);
  }
  const billsRef = collection(db, "expenses", expenseId, "bills");
  const billData = {
    ...bill,
    fileUrl,
    file: undefined, // Don't store the file object
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(billsRef, billData);
  return { id: docRef.id, ...billData };
};

export const deleteBillFromExpense = async (expenseId, billId) => {
  const billRef = doc(db, "expenses", expenseId, "bills", billId);
  await deleteDoc(billRef);
  return billId;
}; 