import { getFunctions, httpsCallable } from "firebase/functions";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { app, auth } from "../config/firebase";

// Get all users from Firestore
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

// Get a user by ID from Firestore
export async function getUserById(uid) {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

// Update a user document in Firestore by uid
export async function updateUserDocument(uid, userProfile) {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, userProfile, { merge: true });
}

// Update a user document in Firestore by uid (partial update)
export async function updateUserById(uid, updates) {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
}

// Delete a user document and their image from Firestore and Storage by uid
export async function deleteUserDocumentAndImageById(uid) {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  // Fetch user document to get image URL
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data();
    const imageUrl = userData.photoURL || userData.profileImage;
    if (
      imageUrl &&
      typeof imageUrl === "string" &&
      !imageUrl.startsWith("data:")
    ) {
      try {
        // Extract the storage path from the URL
        const storage = getStorage();
        const baseUrl = "https://firebasestorage.googleapis.com/v0/b/";
        let path = null;
        if (imageUrl.startsWith(baseUrl)) {
          // Parse the path from the download URL
          const matches = imageUrl.match(/\/o\/([^?]+)/);
          if (matches && matches[1]) {
            path = decodeURIComponent(matches[1]);
          }
        } else if (imageUrl.startsWith("gs://")) {
          path = imageUrl.replace("gs://", "");
        }
        if (path) {
          const imgRef = storageRef(storage, path);
          await deleteObject(imgRef);
        }
      } catch (err) {
        console.warn("Failed to delete user image from storage:", err);
      }
    }
  }
  await deleteDoc(userRef);
}

// TEMP: Delete user doc and Auth by id (no auth, no storage)
export async function deleteUserDocByIdTemp(uid) {
  // Delete user document from Firestore only (no Auth, no Storage)
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}

export async function deleteUserDocAndAuthByIdTemp(uid) {
  // Delete from Auth
  try {
    await window.firebase.auth().deleteUser(uid);
  } catch (err) {
    // If user not found in Auth, ignore
    if (!(err && err.code === "auth/user-not-found")) throw err;
  }
  // Delete from Firestore
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}

// Cloud Function: Create user by admin
export async function createUserByAdminCloud(userData) {
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true);
  }
  const functions = getFunctions(app, "us-central1");
  const callCreateUser = httpsCallable(functions, "createUserByAdmin");
  const result = await callCreateUser(userData);
  if (result.debugAuth) {
    console.log("Backend context.auth (from function):", result.debugAuth);
  }
  return result.data;
}

// Cloud Function: Reset password by admin
export async function resetPasswordByAdminCloud({ userId, newPassword }) {
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true);
  }
  const functions = getFunctions(app, "us-central1");
  const callResetPassword = httpsCallable(functions, "resetPasswordByAdmin");
  const result = await callResetPassword({ userId, newPassword });
  return result.data;
}

// Cloud Function: Sign out user by admin
export async function signOutUserByAdminCloud({ userId }) {
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true);
  }
  const functions = getFunctions(app, "us-central1");
  const callSignOutUser = httpsCallable(functions, "signOutUserByAdmin");
  const result = await callSignOutUser({ userId });
  return result.data;
}

// Cloud Function: Send password reset email by admin
export async function sendPasswordResetEmailByAdminCloud({ email }) {
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true);
  }
  const functions = getFunctions(app, "us-central1");
  const callSendResetEmail = httpsCallable(
    functions,
    "sendPasswordResetEmailByAdmin"
  );
  const result = await callSendResetEmail({ email });
  return result.data;
}

// Cloud Function: Delete user by admin
export async function deleteUserByAdminCloud({ userId }) {
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true);
  }
  const functions = getFunctions(app, "us-central1");
  const callDeleteUser = httpsCallable(functions, "deleteUserByAdmin");
  const result = await callDeleteUser({ userId });
  return result.data;
}
