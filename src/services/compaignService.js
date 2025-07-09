import { db } from "../config/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

const campaignsRef = collection(db, "campaigns");

// Get all campaigns
export const getAllCampaigns = async () => {
  const q = query(campaignsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get a single campaign by ID
export const getCampaignById = async (id) => {
  const docRef = doc(db, "campaigns", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Campaign not found");
  return { id: docSnap.id, ...docSnap.data() };
};

// Add a new campaign
export const addCampaign = async (data) => {
  const docRef = await addDoc(campaignsRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data, createdAt: new Date().toISOString() };
};

// Update a campaign
export const updateCampaign = async (id, data) => {
  const docRef = doc(db, "campaigns", id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

// Delete a campaign
export const deleteCampaign = async (id) => {
  const docRef = doc(db, "campaigns", id);
  await deleteDoc(docRef);
  return id;
};
