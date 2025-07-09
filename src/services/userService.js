import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

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

// delete user

// Create or update a user document in Firestore
export async function createUserDocument(uid, userProfile) {
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

// Create a user document in Firestore by admin
export async function createUserByAdmin(userProfile) {
  const db = getFirestore();
  // Generate a new document with a random ID
  const userRef = doc(collection(db, "users"));
  await setDoc(userRef, userProfile);
  return { id: userRef.id, ...userProfile };
}

// Create a user by admin via Cloud Function
export async function createUserByAdminCloud(userProfile) {
  const response = await fetch('https://createuserbyadmin-iftacyz4va-uc.a.run.app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userProfile),
  });
  if (!response.ok) {
    throw new Error('Failed to create user by admin');
  }
  return await response.json();
}
