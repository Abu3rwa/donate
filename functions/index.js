const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const sendCredentialsEmail = require("./sendCredentialsEmail");

exports.createUserByAdmin = onCall(async (request) => {
  console.log("request", request);
  // 1. Authentication check
  if (!request.auth) {
    throw new Error("You must be logged in to create a user.");
  }

  // 2. Authorization check
  const adminDoc = await admin
    .firestore()
    .collection("users")
    .doc(request.auth.uid)
    .get();
  if (!adminDoc.exists || adminDoc.data().adminType !== "super_admin") {
    throw new Error("Only super admins can create users.");
  }
  console.log("adminDoc", adminDoc);

  // 3. Input validation
  const {
    displayName,
    email,
    password,
    role,
    adminType,
    permissions,
    phone,
    homeCountry,
    currentCountry,
  } = request.data;
  if (!displayName || !email || !password || !role) {
    throw new Error("Missing required fields.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  try {
    // 4. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });

    // 5. Create user document in Firestore
    const userProfile = {
      displayName,
      email,
      phone: phone || "",
      homeCountry: homeCountry || "",
      currentCountry: currentCountry || "",
      role,
      adminType: adminType || null,
      permissions: permissions || [],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: request.auth.uid,
    };
    await admin
      .firestore()
      .collection("users")
      .doc(userRecord.uid)
      .set(userProfile);

    // 6. Send credentials email to the new user
    await sendCredentialsEmail({
      to: email,
      displayName,
      email,
      password,
      role,
      permissions: permissions || [],
    });

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    };
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      throw new Error("Email already in use.");
    }
    throw new Error(error.message || "Failed to create user.");
  }
});

exports.resetPasswordByAdmin = onCall(async (request) => {
  // 1. Authentication check
  if (!request.auth) {
    throw new Error("You must be logged in to reset a password.");
  }

  // 2. Authorization check
  const adminDoc = await admin
    .firestore()
    .collection("users")
    .doc(request.auth.uid)
    .get();
  if (!adminDoc.exists || adminDoc.data().adminType !== "super_admin") {
    throw new Error("Only super admins can reset passwords.");
  }

  // 3. Input validation
  const { userId, newPassword } = request.data;
  if (!userId || !newPassword) {
    throw new Error("Missing required fields: userId and newPassword.");
  }
  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  try {
    await admin.auth().updateUser(userId, { password: newPassword });
    return { success: true, message: "Password reset successfully." };
  } catch (error) {
    throw new Error(error.message || "Failed to reset password.");
  }
});

exports.signOutUserByAdmin = onCall(async (request) => {
  // 1. Authentication check
  if (!request.auth) {
    throw new Error("You must be logged in to sign out a user.");
  }

  // 2. Authorization check
  const adminDoc = await admin
    .firestore()
    .collection("users")
    .doc(request.auth.uid)
    .get();
  if (!adminDoc.exists || adminDoc.data().adminType !== "super_admin") {
    throw new Error("Only super admins can sign out users.");
  }

  // 3. Input validation
  const { userId } = request.data;
  if (!userId) {
    throw new Error("Missing required field: userId.");
  }

  try {
    await admin.auth().revokeRefreshTokens(userId);
    return {
      success: true,
      message: "User signed out successfully (tokens revoked).",
    };
  } catch (error) {
    throw new Error(error.message || "Failed to sign out user.");
  }
});

exports.sendPasswordResetEmailByAdmin = onCall(async (request) => {
  if (!request.auth) {
    throw new Error("You must be logged in to send a password reset email.");
  }
  const adminDoc = await admin
    .firestore()
    .collection("users")
    .doc(request.auth.uid)
    .get();
  if (!adminDoc.exists || adminDoc.data().adminType !== "super_admin") {
    throw new Error("Only super admins can send password reset emails.");
  }
  const { email } = request.data;
  if (!email) {
    throw new Error("Missing required field: email.");
  }
  try {
    const link = await admin.auth().generatePasswordResetLink(email);
    // Option 1: Return the link to the admin to copy/send
    return { success: true, link };
    // Option 2: Use a mail service to send the link directly to the user
  } catch (error) {
    throw new Error(error.message || "Failed to generate password reset link.");
  }
});

exports.deleteUserByAdmin = onCall(async (request) => {
  // 1. Authentication check
  if (!request.auth) {
    throw new Error("You must be logged in to delete a user.");
  }

  // 2. Authorization check
  const adminDoc = await admin
    .firestore()
    .collection("users")
    .doc(request.auth.uid)
    .get();
  if (!adminDoc.exists || adminDoc.data().adminType !== "super_admin") {
    throw new Error("Only super admins can delete users.");
  }

  // 3. Input validation
  const { userId } = request.data;
  if (!userId) {
    throw new Error("Missing required field: userId.");
  }

  try {
    // 4. Delete user from Firebase Auth
    await admin.auth().deleteUser(userId);
    // 5. Delete user document from Firestore
    await admin.firestore().collection("users").doc(userId).delete();
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    throw new Error(error.message || "Failed to delete user.");
  }
});
