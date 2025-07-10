const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.testAuth = functions.https.onCall(async (data, context) => {
  console.log("🔍 Test Auth Function Called");
  console.log("Context auth:", context.auth);
  console.log("Context auth uid:", context.auth?.uid);
  console.log("Context auth token:", context.auth?.token);
  
  if (!context.auth) {
    console.log("❌ No auth context");
    throw new functions.https.HttpsError("unauthenticated", "You must be signed in.");
  }
  
  console.log("✅ Auth context exists");
  
  // Try to get user document
  try {
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    console.log("📄 User document exists:", userDoc.exists);
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log("👤 User data:", {
        uid: userData.uid,
        email: userData.email,
        adminType: userData.adminType,
        role: userData.role
      });
    }
  } catch (error) {
    console.error("❌ Error getting user document:", error);
  }
  
  return {
    success: true,
    uid: context.auth.uid,
    email: context.auth.token.email,
    message: "Authentication test successful"
  };
}); 