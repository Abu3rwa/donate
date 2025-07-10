/**
 * Firebase Cloud Function to allow an admin to create a new user.
 *
 * This function performs the following steps:
 * 1.  Authenticates the request to ensure the caller is logged in.
 * 2.  Authorizes the caller by checking if they are a 'super_admin'.
 * 3.  Validates the input data (email, password, displayName).
 * 4.  Creates a new user in Firebase Authentication.
 * 5.  Creates a corresponding user document in the 'users' collection in Firestore.
 * 6.  Returns the UID of the newly created user.
 */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK.
// This is required to interact with Firebase services from the backend.
admin.initializeApp();

exports.createUserByAdmin = functions.https.onCall(async (data, context) => {
  // --- 1. Authentication Check ---
  // The `context.auth` object is automatically populated by Firebase if the
  // client-side call is made by an authenticated user. If it's missing,
  // the user is not logged in.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to create a user."
    );
  }

  // --- 2. Permission/Authorization Check ---
  // We verify that the user making the call has the 'super_admin' role.
  // We fetch their user document from Firestore using their UID from the auth context.
  try {
    const adminUserDoc = await admin
      .firestore()
      .collection("users")
      .doc(context.auth.uid)
      .get();

    if (!adminUserDoc.exists || adminUserDoc.data().adminType !== "super_admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You do not have the required permissions to create a user."
      );
    }
  } catch (error) {
    console.error("Permission check failed:", error);
    throw new functions.https.HttpsError(
        "internal", 
        "An error occurred while verifying your permissions."
    );
  }


  // --- 3. Input Validation ---
  // Ensure the client sent all the necessary information.
  const { email, password, displayName } = data;
  if (!email || !password || !displayName) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with 'email', 'password', and 'displayName' arguments."
    );
  }

  try {
    // --- 4. Create User in Firebase Authentication ---
    // This creates the user in the Firebase Authentication service, which allows them to log in.
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: false, // You can set this to true if you have a verification flow
    });

    // --- 5. Create User Document in Firestore ---
    // Now, we create a corresponding document in the 'users' collection.
    // We take all the data passed from the client form.
    const userProfile = {
      ...data, // This includes firstName, lastName, phone, role, adminType, etc.
      uid: userRecord.uid, // Add the newly created UID
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp for accuracy
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    };

    // IMPORTANT: Never store the plain text password in your database.
    // Remove it from the profile object before saving to Firestore.
    delete userProfile.password;

    // Set the document in the 'users' collection with the user's UID as the document ID.
    await admin.firestore().collection("users").doc(userRecord.uid).set(userProfile);

    // --- 6. Return Success Response ---
    // Send the new user's UID back to the client.
    console.log(`Successfully created new user: ${displayName} (${userRecord.uid})`);
    return { uid: userRecord.uid };

  } catch (error) {
    // --- 7. Error Handling ---
    console.error("Error creating user:", error);

    // Provide a more specific error message if it's a known auth error code.
    if (error.code === 'auth/email-already-exists') {
        throw new functions.https.HttpsError('already-exists', 'The email address is already in use by another account.');
    }
    if (error.code === 'auth/invalid-password') {
        throw new functions.https.HttpsError('invalid-argument', 'The password must be a string with at least 6 characters.');
    }

    // For other errors, throw a generic 'internal' error to avoid leaking details.
    throw new functions.https.HttpsError("internal", "An unexpected error occurred while creating the user.");
  }
});
