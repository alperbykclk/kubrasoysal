import { useState } from 'react';
import SetsEditor from './SetsEditor';
import MusicEditor from './MusicEditor';
import TourEditor from './TourEditor';
import MediaEditor from './MediaEditor';
import ArtistEditor from './ArtistEditor';
import ContactEditor from './ContactEditor';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('sets');

  const tabs = [
    { id: 'sets', label: 'Live Sets' },
    { id: 'music', label: 'Latest Music' },
    { id: 'tour', label: 'Tour Dates' },
    { id: 'media', label: 'Media Albums' },
    { id: 'artist', label: 'The Artist' },
    { id: 'contact', label: 'Bookings & Press' }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#050505] border-r border-white/10 p-6 flex flex-col">
        <div className="mb-12">
          <h1 className="text-2xl font-heading font-black tracking-tighter">KS ADMIN</h1>
          <a href="/" target="_blank" className="text-gray-500 hover:text-white text-xs uppercase tracking-widest mt-2 block transition-colors">
            View Live Site ↗
          </a>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 uppercase tracking-widest text-xs font-bold transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-black' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="mt-8 text-left px-4 py-3 uppercase tracking-widest text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'sets' && <SetsEditor />}
          {activeTab === 'music' && <MusicEditor />}
          {activeTab === 'tour' && <TourEditor />}
          {activeTab === 'media' && <MediaEditor />}
          {activeTab === 'artist' && <ArtistEditor />}
          {activeTab === 'contact' && <ContactEditor />}
        </div>
      </main>
    </div>
  );
}
