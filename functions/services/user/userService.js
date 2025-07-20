// userService.js - Business logic for users
const admin = require("firebase-admin");

/**
 * Create a new user in Firebase Auth and Firestore
 * @param {Object} userData
 * @returns {Promise<Object>} Created user data
 */
async function createUser(userData) {
  try {
    // 1. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: false,
      phoneNumber: userData.phone || undefined,
      photoURL: userData.photoURL || undefined,
      disabled: false,
    });

    // 2. Create user document in Firestore
    const userProfile = {
      displayName: userData.displayName,
      email: userData.email,
      phone: userData.phone || "",
      homeCountry: userData.homeCountry || "",
      currentCountry: userData.currentCountry || "",
      role: userData.role || "",
      adminType: userData.adminType || null,
      permissions: userData.permissions || [],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: userData.createdBy || null,
      photoURL: userData.photoURL || "",
    };
    console.log("🔥 userProfile to Firestore:", userProfile);
    await admin
      .firestore()
      .collection("users")
      .doc(userRecord.uid)
      .set(userProfile);

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      ...userProfile,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to create user.");
  }
}

/**
 * Get a user by ID from Firestore
 * @param {string} userId
 * @returns {Promise<Object>} User data
 */
async function getUser(userId) {
  try {
    const doc = await admin.firestore().collection("users").doc(userId).get();
    if (!doc.exists) {
      throw new Error("User not found.");
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(error.message || "Failed to get user.");
  }
}

/**
 * Update a user by ID in Firestore (and optionally Auth)
 * @param {string} userId
 * @param {Object} updates
 * @returns {Promise<Object>} Updated user data
 */
async function updateUser(userId, updates) {
  try {
    // Optionally update Auth fields
    const authUpdates = {};
    if (updates.displayName) authUpdates.displayName = updates.displayName;
    if (updates.email) authUpdates.email = updates.email;
    if (updates.password) authUpdates.password = updates.password;
    if (updates.phone) authUpdates.phoneNumber = updates.phone;
    if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
    if (Object.keys(authUpdates).length > 0) {
      await admin.auth().updateUser(userId, authUpdates);
    }
    // Update Firestore document
    await admin.firestore().collection("users").doc(userId).update(updates);
    // Return updated user
    const updatedDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    throw new Error(error.message || "Failed to update user.");
  }
}

/**
 * Delete a user by ID from Auth and Firestore
 * @param {string} userId
 * @returns {Promise<Object>} Deletion result
 */
async function deleteUser(userId) {
  try {
    // Delete from Auth
    await admin.auth().deleteUser(userId);
    // Delete from Firestore
    await admin.firestore().collection("users").doc(userId).delete();
    return { success: true, message: "User deleted successfully.", userId };
  } catch (error) {
    throw new Error(error.message || "Failed to delete user.");
  }
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
