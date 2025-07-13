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
  orderBy,
  where,
} from "firebase/firestore";

const campaignsRef = collection(db, "campaigns");

// Get all campaigns
export const getAllCampaigns = async ({ dateRange = "all" } = {}) => {
  let q = query(campaignsRef, orderBy("createdAt", "desc"));

  if (dateRange && dateRange !== "all") {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = null;
    }

    if (startDate) {
      q = query(q, where("createdAt", ">=", startDate.toISOString()));
    }
  }

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
