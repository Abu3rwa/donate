import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage with progress tracking.
 * @param {File} file The file to upload.
 * @param {string} path The path in Firebase Storage to upload the file to.
 * @param {function} onProgress A callback function to receive progress updates.
 * @returns {Promise<string>} A promise that resolves with the download URL.
 */
export const uploadFileWithProgress = (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
        reject(new Error('فشل رفع الملف'));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          console.error('Error getting download URL:', error);
          reject(new Error('فشل في الحصول على رابط التنزيل'));
        }
      }
    );
  });
};

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

export const uploadVideo = async (file, onProgress) => {
    const timestamp = Date.now();
    const fileName = `videos/${timestamp}_${file.name}`;
    return await uploadFileWithProgress(file, fileName, onProgress);
}

export const deleteFile = async (url) => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error for delete operations as they're not critical
  }
}; 