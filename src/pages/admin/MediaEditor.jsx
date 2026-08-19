import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { uploadImage } from '../../lib/uploader';

export default function MediaEditor() {
  const { data, updateSection } = useCMS();
  const [albums, setAlbums] = useState(data.media);
  const [uploadingAlbumId, setUploadingAlbumId] = useState(null);

  const handleImageUpload = async (e, albumIndex) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingAlbumId(albums[albumIndex].id);
    
    try {
      // Upload all files concurrently
      const uploadPromises = files.map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      
      const updated = [...albums];
      updated[albumIndex].images.push(...urls);
      if (!updated[albumIndex].coverImage && urls.length > 0) {
        updated[albumIndex].coverImage = urls[0];
      }
      setAlbums(updated);
    } catch (err) {
      alert('Error uploading images: ' + (err.message || err));
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
    if (updated[albumIndex].images.length > 0) {
      updated[albumIndex].coverImage = updated[albumIndex].images[0];
    } else {
      updated[albumIndex].coverImage = "";
    }
    setAlbums(updated);
  };

  const handleMoveImage = (albumIndex, imgIndex, direction) => {
    const updated = [...albums];
    const newIndex = imgIndex + direction;
    if (newIndex < 0 || newIndex >= updated[albumIndex].images.length) return;
    
    // Swap
    const temp = updated[albumIndex].images[imgIndex];
    updated[albumIndex].images[imgIndex] = updated[albumIndex].images[newIndex];
    updated[albumIndex].images[newIndex] = temp;
    
    // Always sync coverImage to be the first image in the album (index 0)
    if (updated[albumIndex].images.length > 0) {
      updated[albumIndex].coverImage = updated[albumIndex].images[0];
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
                    
                    {/* Move Left Button */}
                    {imgIndex > 0 && (
                      <button 
                        type="button"
                        onClick={() => handleMoveImage(albumIndex, imgIndex, -1)}
                        className="absolute bottom-2 left-2 bg-black/70 hover:bg-black text-white rounded-md w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg transition-colors z-10 opacity-0 group-hover:opacity-100"
                        title="Move Left"
                      >
                        ←
                      </button>
                    )}
                    
                    {/* Move Right Button */}
                    {imgIndex < album.images.length - 1 && (
                      <button 
                        type="button"
                        onClick={() => handleMoveImage(albumIndex, imgIndex, 1)}
                        className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white rounded-md w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg transition-colors z-10 opacity-0 group-hover:opacity-100"
                        title="Move Right"
                      >
                        →
                      </button>
                    )}

                    {/* Delete Button */}
                    <button 
                      type="button"
                      onClick={() => handleRemoveImage(albumIndex, imgIndex)}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg transition-colors z-10 opacity-0 group-hover:opacity-100"
                      title="Remove Photo"
                    >
                      ×
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
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 text-center px-2">Upload Photo(s)</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple 
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
