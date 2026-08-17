import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export default function SetsEditor() {
  const { data, updateSection } = useCMS();
  // Support migration from single object to array
  const initialData = Array.isArray(data.sets) ? data.sets : [data.sets];
  const [sets, setSets] = useState(initialData);

  const handleAdd = () => {
    const newSet = {
      id: Date.now().toString(),
      title: "NEW LIVE SET",
      subtitle: "LIVE SET",
      description: "Mix Type",
      dateInfo: "DD.MM.YYYY | ARTIST",
      videoId: ""
    };
    setSets([...sets, newSet]);
  };

  const handleRemove = (id) => {
    setSets(sets.filter(s => s.id !== id));
  };

  const handleChange = (id, field, value) => {
    setSets(sets.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSection('sets', sets);
    alert('Live Sets updated successfully!');
  };

  return (
    <div className="bg-[#050505] border border-white/10 p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-black uppercase tracking-tighter">Edit Live Sets</h2>
        <button onClick={handleAdd} className="bg-white text-black px-4 py-2 font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors">
          + Add Set
        </button>
      </div>
      
      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {sets.map((set, index) => (
          <div key={set.id} className="border border-white/10 p-6 rounded-lg relative">
            <button 
              type="button" 
              onClick={() => handleRemove(set.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400 font-bold text-sm uppercase tracking-widest"
            >
              Remove
            </button>
            <h3 className="text-lg font-bold mb-4">Set #{index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block font-bold">Main Title</label>
                <input 
                  value={set.title} onChange={(e) => handleChange(set.id, 'title', e.target.value)}
                  className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block font-bold">Subtitle</label>
                <input 
                  value={set.subtitle} onChange={(e) => handleChange(set.id, 'subtitle', e.target.value)}
                  className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block font-bold">Description / Mix Type</label>
                <input 
                  value={set.description} onChange={(e) => handleChange(set.id, 'description', e.target.value)}
                  className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block font-bold">Date & Artists</label>
                <input 
                  value={set.dateInfo} onChange={(e) => handleChange(set.id, 'dateInfo', e.target.value)}
                  className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block font-bold">YouTube Video ID</label>
                <input 
                  value={set.videoId} onChange={(e) => handleChange(set.id, 'videoId', e.target.value)}
                  className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors"
                />
                <p className="text-[10px] text-gray-600 mt-2">The 11-character code at the end of a YouTube URL. (e.g. hCFLjiEOywk)</p>
              </div>
            </div>
          </div>
        ))}

        {sets.length === 0 && (
          <p className="text-gray-500 italic text-center py-4">No live sets added. Click "Add Set" to create one.</p>
        )}

        <button type="submit" className="mt-4 bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors">
          Save Changes
        </button>
      </form>
    </div>
  );
}
