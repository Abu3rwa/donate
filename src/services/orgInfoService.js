import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";

const ORG_INFO_DOC_ID = "info";
const ORG_INFO_COLLECTION = "organization";
const docRef = () => doc(db, ORG_INFO_COLLECTION, ORG_INFO_DOC_ID);

/**
 * Get the entire organization info/settings document (flat structure).
 */
export const getOrgInfo = async () => {
  try {
    const snap = await getDoc(docRef());
    console.log(snap.data());
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error getting organization info:", error);
    throw error;
  }
};

/**
 * Update (merge) the organization info/settings document (flat structure).
 * @param {Object} orgInfo
 */
export const updateOrgInfo = async (orgInfo) => {
  try {
    await setDoc(docRef(), orgInfo, { merge: true });
  } catch (error) {
    console.error("Error updating organization info:", error);
    throw error;
  }
};

/**
 * Update a specific top-level field in the settings document.
 * @param {string} field
 * @param {any} value
 */
export const updateSettingsField = async (field, value) => {
  try {
    await updateDoc(docRef(), { [field]: value });
  } catch (error) {
    console.error(`Error updating settings field '${field}':`, error);
    throw error;
  }
};

/**
 * Get a specific top-level field from the settings document.
 * @param {string} field
 */
export const getSettingsField = async (field) => {
  try {
    const snap = await getDoc(docRef());
    return snap.exists() ? snap.data()[field] : null;
  } catch (error) {
    console.error(`Error getting settings field '${field}':`, error);
    throw error;
  }
};

/**
 * Upload a file to Firebase Storage and return its download URL.
 */
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// --- Flat structure field helpers ---

/**
 * Get or update banks (array)
 */
export const getBanks = async () => getSettingsField("banks");
export const updateBanks = async (banks) => updateSettingsField("banks", banks);

/**
 * Get or update contacts (object)
 */
export const getContacts = async () => getSettingsField("contacts");
export const updateContacts = async (contacts) =>
  updateSettingsField("contacts", contacts);

/**
 * Get or update description (string)
 */
export const getDescription = async () => getSettingsField("description");
export const updateDescription = async (description) =>
  updateSettingsField("description", description);

/**
 * Get or update donationType (string)
 */
export const getDonationType = async () => getSettingsField("donationType");
export const updateDonationType = async (donationType) =>
  updateSettingsField("donationType", donationType);

/**
 * Get or update location (string)
 */
export const getLocation = async () => getSettingsField("location");
export const updateLocation = async (location) =>
  updateSettingsField("location", location);

/**
 * Get or update logo (string)
 */
export const getLogo = async () => getSettingsField("logo");
export const updateLogo = async (logo) => updateSettingsField("logo", logo);

/**
 * Get or update longName (string)
 */
export const getLongName = async () => getSettingsField("longName");
export const updateLongName = async (longName) =>
  updateSettingsField("longName", longName);

/**
 * Get or update name (string)
 */
export const getName = async () => getSettingsField("name");
export const updateName = async (name) => updateSettingsField("name", name);

/**
 * Get or update recurring (object)
 */
export const getRecurring = async () => getSettingsField("recurring");
export const updateRecurring = async (recurring) =>
  updateSettingsField("recurring", recurring);

/**
 * Get or update recurringAmount (string)
 */
export const getRecurringAmount = async () =>
  getSettingsField("recurringAmount");
export const updateRecurringAmount = async (recurringAmount) =>
  updateSettingsField("recurringAmount", recurringAmount);

/**
 * Get or update recurringInterval (string)
 */
export const getRecurringInterval = async () =>
  getSettingsField("recurringInterval");
export const updateRecurringInterval = async (recurringInterval) =>
  updateSettingsField("recurringInterval", recurringInterval);

/**
 * Get or update social (array)
 */
export const getSocial = async () => getSettingsField("social");
export const updateSocial = async (social) =>
  updateSettingsField("social", social);

/**
 * Get or update videos (array)
 */
export const getVideos = async () => getSettingsField("videos");
export const updateVideos = async (videos) =>
  updateSettingsField("videos", videos);
