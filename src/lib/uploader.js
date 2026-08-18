

export async function uploadImage(file) {
  if (!file) throw new Error("No file selected.");

  // Prepare base64
  const getBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
  
  let fullBase64;
  try {
    fullBase64 = await getBase64(file);
  } catch(e) {
    throw new Error("Dosya okunamadi.");
  }

  // Attempt 1: ImgBB
  try {
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
    }
  } catch (imgbbErr) {
    console.warn("ImgBB upload failed. Falling back to Base64 compression...", imgbbErr);
  }

  // Attempt 2 (Failproof Fallback): Compressed Base64 Data URL
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 800; 

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
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => resolve(fullBase64); 
    img.src = fullBase64;
  });
}
