import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { uploadImage } from '../../lib/uploader';

export default function MusicEditor() {
  const { data, updateSection } = useCMS();
  const [tracks, setTracks] = useState(data.music);
  const [uploadingTrackId, setUploadingTrackId] = useState(null);

  const handleTrackChange = (index, field, value) => {
    const updated = [...tracks];
    updated[index][field] = value;
    setTracks(updated);
  };

  const handleAddTrack = () => {
    setTracks([...tracks, { id: Date.now().toString(), title: "New Track", type: "Original Mix", image: "", link: "" }]);
  };

  const handleRemoveTrack = (index) => {
    const updated = tracks.filter((_, i) => i !== index);
    setTracks(updated);
  };

  const handleImageUpload = async (e, trackIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingTrackId(tracks[trackIndex].id);
    try {
      const url = await uploadImage(file);
      handleTrackChange(trackIndex, 'image', url);
    } catch (err) {
      alert('Error uploading image: ' + (err.message || err));
    } finally {
      setUploadingTrackId(null);
    }
  };

  const handleRemoveTrackImage = (trackIndex) => {
    handleTrackChange(trackIndex, 'image', '');
  };

  const handleSave = () => {
    updateSection('music', tracks);
    alert('Music section updated!');
  };

  return (
    <div className="bg-[#050505] border border-white/10 p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-black uppercase tracking-tighter">Edit Latest Music</h2>
        <button onClick={handleAddTrack} className="bg-white/10 hover:bg-white hover:text-black px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors">
          + Add Track
        </button>
      </div>
      
      <div className="flex flex-col gap-8">
        {tracks.map((track, index) => (
          <div key={track.id} className="bg-black border border-white/10 p-6 relative">
            <button 
              onClick={() => handleRemoveTrack(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest"
            >
              Remove Track
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Title</label>
                <input 
                  value={track.title} onChange={(e) => handleTrackChange(index, 'title', e.target.value)}
                  className="w-full bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Type (e.g. Original Mix)</label>
                <input 
                  value={track.type} onChange={(e) => handleTrackChange(index, 'type', e.target.value)}
                  className="w-full bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Track Cover</label>
                <div className="flex items-center gap-4">
                  {track.image && (
                    <div className="relative group">
                      <img src={track.image} alt="cover" className="w-14 h-14 object-cover border border-white/20 rounded-sm" />
                      <button
                        type="button"
                        onClick={() => handleRemoveTrackImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg transition-colors"
                        title="Remove Cover Photo"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors">
                    {uploadingTrackId === track.id ? 'Uploading...' : 'Upload Image'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">SoundCloud Link</label>
                <input 
                  value={track.link} onChange={(e) => handleTrackChange(index, 'link', e.target.value)}
                  className="w-full bg-[#050505] border border-white/20 p-3 text-white text-sm focus:border-white"
                />
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
