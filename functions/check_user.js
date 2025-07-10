const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp({
  projectId: "shoply-31172"
});

async function checkUser() {
  try {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc('4QqqU1WUUnaz6wNjrnLPAXYvivl2').get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log("✅ User document exists:");
      console.log("UID:", userData.uid);
      console.log("Email:", userData.email);
      console.log("Display Name:", userData.displayName);
      console.log("Admin Type:", userData.adminType);
      console.log("Role:", userData.role);
      console.log("Admin Level:", userData.adminLevel);
      console.log("Permissions:", userData.permissions);
    } else {
      console.log("❌ User document does not exist in Firestore");
      console.log("This is why the Cloud Function is failing!");
    }
  } catch (error) {
    console.error("Error checking user:", error);
  } finally {
    process.exit(0);
  }
}

checkUser(); 