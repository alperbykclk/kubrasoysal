import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

export default function NavigationEditor() {
  const { data, updateSection } = useCMS();

  const defaultNavigation = [
    { id: "1", name: "Home", path: "#home" },
    { id: "2", name: "Music", path: "#music" },
    { id: "3", name: "Tour", path: "#tour" },
    { id: "4", name: "Media", path: "#media" },
    { id: "5", name: "About", path: "#about" },
    { id: "6", name: "Contact", path: "#contact" }
  ];

  const [items, setItems] = useState(
    Array.isArray(data.navigation) && data.navigation.length > 0
      ? data.navigation
      : defaultNavigation
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (Array.isArray(data.navigation) && data.navigation.length > 0) {
      setItems(data.navigation);
    }
  }, [data.navigation]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: "New Link", path: "#" }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setItems(updated);
  };

  const handleMoveDown = (index) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setItems(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSection('navigation', items);
    setSaving(false);
    alert('Navigation menu links updated and saved to database!');
  };

  const inputCls = "w-full bg-black border border-white/20 p-3 text-white text-sm focus:border-white outline-none transition-colors";

  return (
    <div className="bg-[#050505] border border-white/10 p-8 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-black uppercase tracking-tighter">Edit Hamburger Menu Links</h2>
          <p className="text-xs text-gray-500 mt-1">Control the main navigation links in the header overlay</p>
        </div>
        <button 
          onClick={handleAddItem}
          className="text-xs px-4 py-2 border border-white/30 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest font-bold"
        >
          + Add Menu Item
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={item.id || index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-black/40 border border-white/10 p-4 rounded-lg">
            <div className="flex items-center gap-1 text-gray-400">
              <button 
                onClick={() => handleMoveUp(index)} 
                disabled={index === 0}
                className="p-1 hover:text-white disabled:opacity-20 transition-colors"
                title="Move Up"
              >
                ▲
              </button>
              <button 
                onClick={() => handleMoveDown(index)} 
                disabled={index === items.length - 1}
                className="p-1 hover:text-white disabled:opacity-20 transition-colors"
                title="Move Down"
              >
                ▼
              </button>
            </div>

            <div className="flex-1 w-full">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Link Title</label>
              <input 
                value={item.name} 
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                placeholder="e.g. Music"
                className={inputCls}
              />
            </div>

            <div className="flex-[2] w-full">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Target Path / URL</label>
              <input 
                value={item.path} 
                onChange={(e) => handleItemChange(index, 'path', e.target.value)}
                placeholder="e.g. #music or https://..."
                className={inputCls}
              />
            </div>

            <button 
              onClick={() => handleRemoveItem(index)}
              className="text-gray-500 hover:text-red-400 transition-colors px-2 text-xl font-bold self-end sm:self-center"
              title="Delete Link"
            >
              ×
            </button>
          </div>
        ))}

        <button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors mt-6 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Navigation Menu'}
        </button>
      </div>
    </div>
  );
}
