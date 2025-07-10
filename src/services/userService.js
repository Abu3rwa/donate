import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

/**
 * Calls the 'createUserByAdmin' Cloud Function to create a new user.
 * This is the new, secure way to create users via an admin action.
 * @param {import('firebase/auth').Auth} auth - The Firebase Auth instance from the component.
 * @param {object} userPayload - The data for the new user, including email, password, etc.
 * @returns {Promise<any>} The result from the cloud function, which should include the new user's UID.
 */
export async function createUserByAdminCloud(auth, userPayload) {
  if (!auth || !auth.currentUser) {
    console.error("Authentication context is missing. Cannot call the function.");
    throw new Error("You must be logged in to perform this action.");
  }

  // It's good practice to specify the region if it's not us-central1
  const functions = getFunctions(auth.app); 
  const callCreateUser = httpsCallable(functions, "createUserByAdmin");

  try {
    // The Firebase SDK automatically includes the auth token.
    const result = await callCreateUser(userPayload);
    return result.data;
  } catch (error) {
    console.error("Error calling createUserByAdmin Cloud Function:", error);
    // Re-throw the error so the component can catch it and display a message.
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// This function is still useful if you need to update a user document.
export async function updateUserDocument(uid, userProfile) {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, userProfile, { merge: true });
}

// Delete a user document from Firestore by uid
export async function deleteUserById(uid) {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}

// Update a user document in Firestore by uid
export async function updateUserById(uid, updates) {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
}

// DEPRECATED: This function should no longer be used for creation,
// as it bypasses the secure Cloud Function.
export async function createUserByAdmin(userProfile) {
  console.warn("DEPRECATED: User creation should be done via the createUserByAdminCloud function.");
  const db = getFirestore();
  const userRef = doc(collection(db, "users"));
  await setDoc(userRef, userProfile);
  return { id: userRef.id, ...userProfile };
}
