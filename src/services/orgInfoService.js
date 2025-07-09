import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const ORG_INFO_DOC = 'organization/info'; // Collection: organization, Doc: info

export async function getOrgInfo() {
  try {
    console.log("Getting organization info from Firestore");
    const ref = doc(db, ORG_INFO_DOC);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : null;
    console.log("Organization info retrieved:", data);
    return data;
  } catch (error) {
    console.error("Error in getOrgInfo:", error);
    throw error;
  }
}

// Validate organization data before saving
function validateOrgData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('بيانات غير صالحة');
  }
  
  // Ensure required fields exist
  const requiredFields = ['name', 'longName', 'contacts', 'social'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`الحقل المطلوب مفقود: ${field}`);
    }
  }
  
  // Validate contacts structure
  if (!data.contacts.phones || !Array.isArray(data.contacts.phones)) {
    throw new Error('أرقام الهاتف غير صحيحة');
  }
  
  if (!data.contacts.emails || !Array.isArray(data.contacts.emails)) {
    throw new Error('البريد الإلكتروني غير صحيح');
  }
  
  // Validate social links structure
  if (!data.social || !Array.isArray(data.social)) {
    throw new Error('روابط التواصل الاجتماعي غير صحيحة');
  }
  
  return true;
}

export async function setOrgInfo(data) {
  try {
    console.log("Setting organization info in Firestore:", data);
    
    // Validate data before saving
    validateOrgData(data);
    
    const ref = doc(db, ORG_INFO_DOC);
    await setDoc(ref, data, { merge: true });
    console.log("Organization info saved to Firestore successfully");
  } catch (error) {
    console.error("Error in setOrgInfo:", error);
    throw error;
  }
}

export async function updateOrgInfo(data) {
  const ref = doc(db, ORG_INFO_DOC);
  await updateDoc(ref, data);
} 