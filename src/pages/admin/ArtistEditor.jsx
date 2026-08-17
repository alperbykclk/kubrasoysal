import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { uploadImage } from '../../lib/uploader';

export default function ArtistEditor() {
  const { data, updateSection } = useCMS();
  const [artist, setArtist] = useState(data.artist || {
    title: "The Artist",
    text1: "", text2: "", quote: "", text3: "", image: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data.artist) {
      setArtist(data.artist);
    }
  }, [data.artist]);

  const handleChange = (field, value) => {
    setArtist(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      handleChange('image', url);
      alert('Image uploaded successfully!');
    } catch (err) {
      alert('Error uploading image: ' + (err.message || err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    handleChange('image', '');
  };

  const handleSave = () => {
    updateSection('artist', artist);
    alert('Artist section updated!');
  };

  return (
    <div className="bg-[#050505] border border-white/10 p-8 rounded-xl">
      <h2 className="text-2xl font-heading font-black uppercase tracking-tighter mb-6">Edit The Artist</h2>
      
      <div className="flex flex-col gap-6">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Title</label>
          <input 
            value={artist.title || ''} onChange={(e) => handleChange('title', e.target.value)}
            className="w-full bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Portrait Image</label>
          <div className="flex items-center gap-4">
            {artist.image && (
              <div className="relative group">
                <img src={artist.image} alt="cover" className="w-20 h-24 object-cover border border-white/20 rounded-sm" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg transition-colors"
                  title="Remove Photo"
                >
                  ×
                </button>
              </div>
            )}
            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
              {isUploading ? 'Uploading...' : 'Upload Image'}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Paragraph 1</label>
          <textarea 
            value={artist.text1 || ''} onChange={(e) => handleChange('text1', e.target.value)}
            className="w-full bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white min-h-[100px]"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Paragraph 2</label>
          <textarea 
            value={artist.text2 || ''} onChange={(e) => handleChange('text2', e.target.value)}
            className="w-full bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white min-h-[100px]"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Highlighted Quote</label>
          <textarea 
            value={artist.quote || ''} onChange={(e) => handleChange('quote', e.target.value)}
            className="w-full bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white min-h-[60px]"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Paragraph 3</label>
          <textarea 
            value={artist.text3 || ''} onChange={(e) => handleChange('text3', e.target.value)}
            className="w-full bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white min-h-[100px]"
          />
        </div>

        <button onClick={handleSave} className="bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors mt-4">
          Save Changes
        </button>
      </div>
    </div>
  );
}

