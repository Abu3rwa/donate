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
  writeBatch,
} from "firebase/firestore";
import { deleteFile } from "./fileUploadService";

const campaignsRef = collection(db, "campaigns");
const donationsRef = collection(db, "donations");

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
  // Get campaign data to find associated files
  const campaignDocRef = doc(db, "campaigns", id);
  const campaignSnap = await getDoc(campaignDocRef);
  if (campaignSnap.exists()) {
    const campaignData = campaignSnap.data();
    // Delete image
    if (campaignData.image) {
      try {
        await deleteFile(campaignData.image);
      } catch (e) {
        /* ignore */
      }
    }
    // Delete gallery images
    if (Array.isArray(campaignData.gallery)) {
      for (const url of campaignData.gallery) {
        if (url) {
          try {
            await deleteFile(url);
          } catch (e) {
            /* ignore */
          }
        }
      }
    }
    // Delete video if it's an uploaded file (not a URL)
    if (
      campaignData.video &&
      campaignData.video.startsWith("https://firebasestorage")
    ) {
      try {
        await deleteFile(campaignData.video);
      } catch (e) {
        /* ignore */
      }
    }
    // Delete documents
    if (Array.isArray(campaignData.documents)) {
      for (const url of campaignData.documents) {
        if (url) {
          try {
            await deleteFile(url);
          } catch (e) {
            /* ignore */
          }
        }
      }
    }
  }
  // Delete all donations for this campaign
  const q = query(donationsRef, where("campaignId", "==", id));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  // Delete the campaign itself
  batch.delete(campaignDocRef);
  await batch.commit();
  return id;
};
