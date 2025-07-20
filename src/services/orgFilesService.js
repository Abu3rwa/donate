// src/services/orgFilesService.js
// Service for organization documents (Org Files)
import { db, storage } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const ORG_FILES_COLLECTION = "organization_documents"; // Change as needed
const ORG_FILES_STORAGE = "org_files"; // Storage folder

/**
 * Fetch all organization documents from Firestore
 * @returns {Promise<Array>} Array of document objects
 */
export async function fetchOrgDocuments() {
  const q = query(
    collection(db, ORG_FILES_COLLECTION),
    orderBy("uploadDate", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Upload a new organization document (file + metadata)
 * @param {File} file
 * @param {Object} metadata (e.g., category, uploadedBy)
 * @returns {Promise<Object>} The created document
 */
export async function uploadOrgDocument(file, metadata = {}) {
  // Upload file to Firebase Storage
  const storageRef = ref(
    storage,
    `${ORG_FILES_STORAGE}/${Date.now()}_${file.name}`
  );
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Add metadata to Firestore
  const docRef = await addDoc(collection(db, ORG_FILES_COLLECTION), {
    name: file.name,
    url,
    category: metadata.category || "Uncategorized",
    uploadedBy: metadata.uploadedBy || "Unknown",
    uploadDate: serverTimestamp(),
    ...metadata,
    storagePath: storageRef.fullPath,
  });
  const docSnap = await getDoc(docRef);
  return { id: docRef.id, ...docSnap.data() };
}

/**
 * Update organization document metadata (not file)
 * @param {string} docId
 * @param {Object} updates
 * @returns {Promise<void>}
 */
export async function updateOrgDocument(docId, updates) {
  const docRef = doc(db, ORG_FILES_COLLECTION, docId);
  await updateDoc(docRef, { ...updates });
}

/**
 * Delete an organization document (metadata + file)
 * @param {string} docId
 * @param {string} storagePath
 * @returns {Promise<void>}
 */
export async function deleteOrgDocument(docId, storagePath) {
  // Delete Firestore doc
  await deleteDoc(doc(db, ORG_FILES_COLLECTION, docId));
  // Delete file from Storage
  if (storagePath) {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  }
}
