import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

export default function MediaSection() {
  const { data } = useCMS();
  const albums = data.media;
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const header = document.getElementById('main-header');
    if (selectedAlbum) {
      document.body.style.overflow = 'hidden';
      if (header) {
        header.style.display = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      if (header) {
        header.style.display = '';
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (header) {
        header.style.display = '';
      }
    };
  }, [selectedAlbum]);

  return (
    <section id="media" className="relative py-32 bg-black overflow-hidden z-20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase tracking-wide">Gallery</h3>
          <div className="h-1 w-24 bg-white mx-auto mt-6"></div>
        </motion.div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, idx) => (
            <motion.div 
              key={album.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedAlbum(album)}
              className="relative aspect-square group cursor-pointer overflow-hidden border border-white/10 rounded-sm"
            >
              {album.coverImage ? (
                <img 
                  src={album.coverImage} 
                  alt={album.title} 
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-[#050505] flex items-center justify-center text-gray-500 uppercase tracking-widest text-xs">
                  No Cover
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <h4 className="text-2xl font-heading font-black text-white uppercase tracking-tighter translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {album.title}
                </h4>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {album.images.length} Photos
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Album Modal (Popup) */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-4 md:p-8 custom-scrollbar"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tighter">
                {selectedAlbum.title}
              </h3>
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="text-white hover:text-gray-400 transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Masonry or Grid of Photos */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {selectedAlbum.images.length > 0 ? (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {selectedAlbum.images.map((img, i) => (
                    <div 
                      key={i} 
                      className="break-inside-avoid cursor-pointer group/item relative"
                      onClick={() => setSelectedImageIndex(i)}
                    >
                      <img 
                        src={img} 
                        alt={`Photo ${i+1}`} 
                        className="w-full h-auto object-cover border border-white/10 hover:border-white/50 transition-colors rounded-sm group-hover/item:opacity-80"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none">
                        <span className="bg-black/50 text-white px-3 py-1 rounded text-xs font-bold tracking-widest uppercase backdrop-blur-sm">View</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 uppercase tracking-widest text-sm h-full">
                  No photos in this album yet.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for single image viewing */}
      <AnimatePresence>
        {selectedImageIndex !== null && selectedAlbum && selectedAlbum.images[selectedImageIndex] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center"
          >
            <button 
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-gray-400 z-[210] p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {/* Prev Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : selectedAlbum.images.length - 1));
              }}
              className="absolute left-4 md:left-10 text-white hover:text-gray-400 z-[210] p-4 bg-black/20 hover:bg-black/50 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            {/* Image */}
            <img 
              src={selectedAlbum.images[selectedImageIndex]} 
              alt="Fullscreen" 
              className="max-w-full max-h-[90vh] object-contain px-16 select-none"
            />

            {/* Next Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => (prev < selectedAlbum.images.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 md:right-10 text-white hover:text-gray-400 z-[210] p-4 bg-black/20 hover:bg-black/50 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-xs tracking-widest">
              {selectedImageIndex + 1} / {selectedAlbum.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
