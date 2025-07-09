import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('فشل رفع الملف');
  }
};

export const uploadLogo = async (file) => {
  const timestamp = Date.now();
  const fileName = `logos/${timestamp}_${file.name}`;
  return await uploadFile(file, fileName);
};

export const deleteFile = async (url) => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error for delete operations as they're not critical
  }
}; 