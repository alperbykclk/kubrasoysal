export async function uploadImage(file) {
  if (!file) throw new Error("No file selected.");

  // Helper to get base64 string from File
  const getBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(f);
  });

  const rawFullBase64 = await getBase64(file);

  // --- PRE-COMPRESSION (Optimize Image BEFORE Upload) ---
  const compressedBase64 = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 1200; // Resize to max 1200px width/height

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // Compress to 80% quality JPEG
      resolve(canvas.toDataURL('image/jpeg', 0.80));
    };
    img.onerror = () => resolve(rawFullBase64); // If compression fails, use original
    img.src = rawFullBase64;
  });

  const rawBase64 = compressedBase64.includes(',') ? compressedBase64.split(',')[1] : compressedBase64;

  // Provider 1: ImgBB
  try {
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
    }
  } catch (e) {
    console.warn("ImgBB upload failed, attempting fallback...", e);
  }

  // Provider 2: FreeImage.host API
  try {
    const formData = new FormData();
    formData.append('key', '6d207e02198a847aa98d0a2a901485a5');
    formData.append('action', 'upload');
    formData.append('source', rawBase64);
    formData.append('format', 'json');

    const res = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    if (json && json.status_code === 200 && json.image?.url) {
      return json.image.url;
    }
  } catch (e) {
    console.warn("FreeImage upload failed, returning Data URL...", e);
  }

  // Provider 3 (Ultimate Failproof Fallback): Return the compressed Data URL directly
  return compressedBase64;
}
