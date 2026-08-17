import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

const IMGBB_KEY = '6e07b57efa93945b1b15ba119d359069';

export default function ContactEditor() {
  const { data, updateSection } = useCMS();

  const defaultContact = {
    title: "Bookings & Press",
    subtitle: "For worldwide bookings, press inquiries, and collaborations.",
    emailLabel: "Booking & Press Email",
    bookingEmail: "kubrasoysal9@gmail.com",
    telephone: "+90 553 687 8313",
    basedIn: "TURKIYE / ISTANBUL",
    socials: [
      { name: "Instagram", url: "https://instagram.com/kubrasoysal" },
      { name: "SoundCloud", url: "https://soundcloud.com/kubrasoysal" }
    ],
    epkTitle: "Electronic Press Kit",
    epkText: "Access the official Tech Rider, stage plot, and comprehensive list of past venues and residencies for promoters and booking agents.",
    epkButton: "View EPK & Tech Rider",
    techRiderImage: "",
    gigs: []
  };

  const [contact, setContact] = useState({ ...defaultContact, ...data.contact });
  const [socials, setSocials] = useState(
    Array.isArray(data.contact?.socials) ? data.contact.socials : defaultContact.socials
  );
  const [gigsText, setGigsText] = useState((contact.gigs || defaultContact.gigs).join('\n'));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const updatedContact = { ...defaultContact, ...data.contact };
    setContact(updatedContact);
    setSocials(Array.isArray(data.contact?.socials) ? data.contact.socials : defaultContact.socials);
    setGigsText((updatedContact.gigs || []).join('\n'));
  }, [data.contact]);

  const handleChange = (field, value) => {
    setContact({ ...contact, [field]: value });
  };

  // --- Socials ---
  const addSocial = () => setSocials([...socials, { name: '', url: '' }]);
  const removeSocial = (i) => setSocials(socials.filter((_, idx) => idx !== i));
  const updateSocial = (i, field, value) => {
    const updated = [...socials];
    updated[i] = { ...updated[i], [field]: value };
    setSocials(updated);
  };

  // --- Tech Rider Image Upload ---
  const handleTechRiderUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST', body: formData
      });
      const json = await res.json();
      if (json.success) {
        setContact(prev => ({ ...prev, techRiderImage: json.data.url }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const updatedGigs = gigsText.split('\n').map(g => g.trim()).filter(g => g !== '');
    const finalContact = { ...contact, socials, gigs: updatedGigs };
    await updateSection('contact', finalContact);
    setSaving(false);
    alert('Saved to database!');
  };

  const inputCls = "w-full bg-black border border-white/20 p-3 text-white text-sm focus:border-white outline-none transition-colors";

  return (
    <div className="bg-[#050505] border border-white/10 p-8 rounded-xl">
      <h2 className="text-2xl font-heading font-black uppercase tracking-tighter mb-6">Edit Bookings, Press & EPK</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Main Title</label>
          <input value={contact.title || ''} onChange={(e) => handleChange('title', e.target.value)} className={inputCls} />
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Subtitle</label>
          <input value={contact.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Email Label</label>
          <input value={contact.emailLabel || ''} onChange={(e) => handleChange('emailLabel', e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Booking Email</label>
          <input value={contact.bookingEmail || ''} onChange={(e) => handleChange('bookingEmail', e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Telephone</label>
          <input value={contact.telephone || ''} onChange={(e) => handleChange('telephone', e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Based In</label>
          <input value={contact.basedIn || ''} onChange={(e) => handleChange('basedIn', e.target.value)} className={inputCls} />
        </div>

        {/* DYNAMIC SOCIALS */}
        <div className="md:col-span-2 mt-2 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-black uppercase">Social Links</h3>
            <button onClick={addSocial} className="text-xs px-4 py-2 border border-white/30 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest font-bold">
              + Add Link
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {socials.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  placeholder="Platform (e.g. YouTube)"
                  value={s.name}
                  onChange={(e) => updateSocial(i, 'name', e.target.value)}
                  className="flex-1 bg-black border border-white/20 p-3 text-white text-sm focus:border-white outline-none"
                />
                <input
                  placeholder="https://..."
                  value={s.url}
                  onChange={(e) => updateSocial(i, 'url', e.target.value)}
                  className="flex-[2] bg-black border border-white/20 p-3 text-white text-sm focus:border-white outline-none"
                />
                <button onClick={() => removeSocial(i)} className="text-gray-500 hover:text-white transition-colors px-2 text-lg font-bold">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* EPK */}
        <div className="md:col-span-2 mt-2 pt-4 border-t border-white/10">
          <h3 className="text-lg font-heading font-black uppercase mb-4">EPK</h3>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">EPK Title</label>
          <input value={contact.epkTitle || ''} onChange={(e) => handleChange('epkTitle', e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">EPK Button Text</label>
          <input value={contact.epkButton || ''} onChange={(e) => handleChange('epkButton', e.target.value)} className={inputCls} />
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">EPK Description</label>
          <textarea value={contact.epkText || ''} onChange={(e) => handleChange('epkText', e.target.value)} className={`${inputCls} h-24`} />
        </div>

        {/* TECH RIDER IMAGE */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Equipment & Stage Plot Image</label>
          {contact.techRiderImage && (
            <img src={contact.techRiderImage} alt="Tech Rider" className="w-48 h-auto border border-white/10 mb-3 object-contain" />
          )}
          <label className="flex items-center gap-3 cursor-pointer border border-white/20 px-4 py-3 hover:border-white transition-colors w-fit">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-xs uppercase tracking-widest text-gray-400">{uploading ? 'Uploading...' : 'Upload Tech Rider Image'}</span>
            <input type="file" accept="image/*" onChange={handleTechRiderUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Past Gigs & Residencies (one per line)</label>
          <textarea value={gigsText} onChange={(e) => setGigsText(e.target.value)} className={`${inputCls} h-48`} />
        </div>
        
        <div className="md:col-span-2">
          <button onClick={handleSave} disabled={saving || uploading} className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors mt-4 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}


