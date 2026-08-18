import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImage(file) {
  if (!file) throw new Error("No file selected.");

  try {
    // Attempt 1: Native Firebase Storage (Most secure and permanent)
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${file.name}`;
    const storageRef = ref(storage, `uploads/${filename}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (firebaseErr) {
    console.warn("Firebase Storage upload failed. Ensure Storage is enabled in Firebase Console. Falling back to ImgBB...", firebaseErr);

    // Attempt 2: ImgBB Fallback
    try {
      const getBase64 = (f) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });

      const fullBase64 = await getBase64(file);
      const rawBase64 = fullBase64.includes(',') ? fullBase64.split(',')[1] : fullBase64;

      const apiKey = '6e07b57efa93945b1b15ba119d359069';
      const formData = new FormData();
      formData.append('image', rawBase64);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      
      if (json && json.success && json.data?.url) {
        return json.data.url;
      } else {
        throw new Error(json?.error?.message || "ImgBB upload failed with no specific error");
      }
    } catch (imgbbErr) {
      console.error("ImgBB upload also failed:", imgbbErr);
      throw new Error(`Resim yüklenemedi. Sistem yöneticisine başvurun. (Firebase: ${firebaseErr.message})`);
    }
  }
}
