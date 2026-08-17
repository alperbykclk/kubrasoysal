import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export default function MediaEditor() {
  const { data, updateSection } = useCMS();
  const [albums, setAlbums] = useState(data.media);
  const [uploadingAlbumId, setUploadingAlbumId] = useState(null);

  const handleImageUpload = async (e, albumIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Hardcoded ImgBB API Key as requested by user
    const apiKey = '6e07b57efa93945b1b15ba119d359069';

    setUploadingAlbumId(albums[albumIndex].id);
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      
      if (json.success) {
        const imageUrl = json.data.url;
        const updated = [...albums];
        updated[albumIndex].images.push(imageUrl);
        // If it's the first image, make it the cover
        if (!updated[albumIndex].coverImage) {
          updated[albumIndex].coverImage = imageUrl;
        }
        setAlbums(updated);
      } else {
        alert('Upload failed: ' + json.error.message);
      }
    } catch (err) {
      alert('Error uploading image.');
    } finally {
      setUploadingAlbumId(null);
    }
  };

  const handleAddAlbum = () => {
    setAlbums([...albums, { id: Date.now().toString(), title: "New Album", coverImage: "", images: [] }]);
  };

  const handleRemoveAlbum = (index) => {
    const updated = albums.filter((_, i) => i !== index);
    setAlbums(updated);
  };

  const handleRemoveImage = (albumIndex, imageIndex) => {
    const updated = [...albums];
    updated[albumIndex].images.splice(imageIndex, 1);
    // If the cover image was removed, set to first available or empty
    if (updated[albumIndex].images.length > 0) {
      updated[albumIndex].coverImage = updated[albumIndex].images[0];
    } else {
      updated[albumIndex].coverImage = "";
    }
    setAlbums(updated);
  };

  const handleSave = () => {
    updateSection('media', albums);
    alert('Media section updated!');
  };

  return (
    <div className="bg-[#050505] border border-white/10 p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-black uppercase tracking-tighter">Edit Media Albums</h2>
        <button onClick={handleAddAlbum} className="bg-white/10 hover:bg-white hover:text-black px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors">
          + Add Album
        </button>
      </div>
      
      <div className="flex flex-col gap-8">
        {albums.map((album, albumIndex) => (
          <div key={album.id} className="bg-black border border-white/10 p-6 relative">
            <button 
              onClick={() => handleRemoveAlbum(albumIndex)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest"
            >
              Delete Album
            </button>
            
            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Album Title</label>
              <input 
                value={album.title} 
                onChange={(e) => {
                  const updated = [...albums];
                  updated[albumIndex].title = e.target.value;
                  setAlbums(updated);
                }}
                className="w-full md:w-1/2 bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white"
              />
            </div>

            {/* Images Grid */}
            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 block">Album Photos</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {album.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="relative aspect-square group">
                    <img src={img} className="w-full h-full object-cover rounded-sm border border-white/10" />
                    <button 
                      onClick={() => handleRemoveImage(albumIndex, imgIndex)}
                      className="absolute inset-0 bg-red-500/80 text-white font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
                
                {/* Upload Button Box */}
                <label className="aspect-square border-2 border-dashed border-white/20 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition-colors">
                  {uploadingAlbumId === album.id ? (
                    <span className="text-xs uppercase tracking-widest animate-pulse">Uploading...</span>
                  ) : (
                    <>
                      <span className="text-2xl mb-2">+</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 text-center px-2">Upload Photo</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageUpload(e, albumIndex)}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}

        <button onClick={handleSave} className="bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors">
          Save All Changes
        </button>
      </div>
    </div>
  );
}
