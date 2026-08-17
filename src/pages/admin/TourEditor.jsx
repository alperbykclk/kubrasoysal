import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export default function TourEditor() {
  const { data, updateSection } = useCMS();
  const [gigs, setGigs] = useState(data.tour);

  const handleGigChange = (index, field, value) => {
    const updated = [...gigs];
    updated[index][field] = value;
    setGigs(updated);
  };

  const handleAddGig = () => {
    setGigs([...gigs, { id: Date.now().toString(), date: "DD.MM.YYYY", venue: "New Venue", location: "City", isPast: false }]);
  };

  const handleRemoveGig = (index) => {
    const updated = gigs.filter((_, i) => i !== index);
    setGigs(updated);
  };

  const handleSave = () => {
    updateSection('tour', gigs);
    alert('Tour section updated!');
  };

  return (
    <div className="bg-[#050505] border border-white/10 p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-black uppercase tracking-tighter">Edit Tour Dates</h2>
        <button onClick={handleAddGig} className="bg-white/10 hover:bg-white hover:text-black px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors">
          + Add Gig
        </button>
      </div>
      
      <div className="flex flex-col gap-4">
        {gigs.map((gig, index) => (
          <div key={gig.id} className="bg-black border border-white/10 p-4 relative flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[120px]">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Date</label>
              <input 
                value={gig.date} onChange={(e) => handleGigChange(index, 'date', e.target.value)}
                className="w-full bg-[#050505] border border-white/20 p-2 text-white text-sm focus:border-white"
              />
            </div>
            <div className="flex-[2] min-w-[200px]">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Venue</label>
              <input 
                value={gig.venue} onChange={(e) => handleGigChange(index, 'venue', e.target.value)}
                className="w-full bg-[#050505] border border-white/20 p-2 text-white text-sm focus:border-white"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Location</label>
              <input 
                value={gig.location} onChange={(e) => handleGigChange(index, 'location', e.target.value)}
                className="w-full bg-[#050505] border border-white/20 p-2 text-white text-sm focus:border-white"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input 
                type="checkbox" 
                checked={gig.isPast} 
                onChange={(e) => handleGigChange(index, 'isPast', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-[10px] uppercase tracking-widest text-gray-400">Past Gig</label>
            </div>
            <button 
              onClick={() => handleRemoveGig(index)}
              className="mt-4 ml-auto text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest"
            >
              Remove
            </button>
          </div>
        ))}

        <button onClick={handleSave} className="mt-8 bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors">
          Save All Changes
        </button>
      </div>
    </div>
  );
}
