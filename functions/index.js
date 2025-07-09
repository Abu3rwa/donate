const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createUserByAdmin = functions.https.onCall(async (data, context) => {
  // Only allow authenticated admins
  if (!context.auth || !context.auth.token || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can create users."
    );
  }

  const { email, password, displayName, ...extra } = data;
  if (!email || !password) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email and password are required."
    );
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      ...extra,
    });
    // Optionally, set custom claims or save extra profile info in Firestore here
    return { uid: userRecord.uid };
  } catch (error) {
    console.error("[createUserByAdmin] Failed to create user:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      error,
      data,
      context: context.auth ? context.auth.token : null,
    });
    throw new functions.https.HttpsError("internal", error.message);
  }
});
