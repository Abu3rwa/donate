const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

async function createSuperAdmin() {
  try {
    const db = admin.firestore();
    const userId = '4QqqU1WUUnaz6wNjrnLPAXYvivl2';
    
    const userData = {
      uid: userId,
      email: 'abdu.sd@gmail.com',
      displayName: 'Abdulhafeez Alameen',
      firstName: 'Abdulhafeez',
      lastName: 'Alameen',
      adminType: 'super_admin',
      adminLevel: 5,
      role: 'مدير عام',
      permissions: ['all'],
      emailVerified: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      source: 'website',
      status: 'Active'
    };
    
    await db.collection('users').doc(userId).set(userData);
    console.log("✅ Super admin user document created successfully!");
    console.log("User ID:", userId);
    console.log("Admin Type:", userData.adminType);
    console.log("Permissions:", userData.permissions);
    
  } catch (error) {
    console.error("Error creating super admin:", error);
  } finally {
    process.exit(0);
  }
}

createSuperAdmin(); 