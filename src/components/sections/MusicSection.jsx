import { motion } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

export default function MusicSection() {
  const { data } = useCMS();
  const releases = data.music;
  return (
    <section id="music" className="relative py-10 md:py-16 bg-[#050505] z-10 flex flex-col items-center">
      <div className="max-w-[1400px] mx-auto px-6 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center md:text-left flex flex-col items-center md:items-start"
        >
          <div className="text-5xl md:text-8xl font-heading font-black text-white/5 uppercase tracking-tighter absolute -mt-8 md:-mt-12 md:-ml-4 select-none">Discography</div>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase relative z-10 tracking-tighter leading-none mb-4">Latest Music</h2>
          <p className="text-gray-400 font-sans tracking-widest uppercase text-xs md:text-sm mb-6">Listen on SoundCloud</p>
          <div className="h-1 w-16 bg-white"></div>
        </motion.div>

        {/* Horizontal Scrollable Container */}
        <div className="flex overflow-x-auto gap-4 md:gap-8 w-full snap-x snap-mandatory pb-8 scroll-smooth custom-scrollbar">
          {releases.map((release, index) => (
            <motion.a 
              href={release.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative aspect-square overflow-hidden cursor-pointer rounded-sm block shadow-xl flex-none w-[85%] sm:w-[calc(50%-1rem)] md:w-[calc(30%-1.5rem)] lg:w-[calc(25%-1.5rem)] snap-start"
            >
              <img src={release.image} alt={release.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{release.type}</p>
                <h3 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-tighter leading-none">{release.title}</h3>
                
                <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="px-4 py-2 border border-white text-white font-bold uppercase tracking-wider text-[10px] hover:bg-white hover:text-black transition-colors">
                    Listen
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <a 
            href="https://soundcloud.com/kubrasoysal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-bold uppercase tracking-widest text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.812 16.875v-9.75h.375v9.75h-.375zm-1.5 0v-8.25h.375v8.25h-.375zm-1.5-.75v-6.75h.375v6.75h-.375zm-1.5-1.5v-3.75H7.687v3.75h-.375zm-1.5-.75v-2.25h.375v2.25h-.375zm12.375 3v-9.75h.375v9.75h-.375zm1.5-1.5v-6.75h.375v6.75h-.375zm1.5-.75v-5.25h.375v5.25h-.375zm1.5-.75v-3.75h.375v3.75h-.375zm1.5-.75v-2.25h.375v2.25h-.375zM8.812 16.875v-9.75h.375v9.75h-.375zm1.5 0v-8.25h.375v8.25h-.375zm1.5-.75v-6.75h.375v6.75h-.375zm1.5-1.5v-3.75h.375v3.75h-.375zm1.5-.75v-2.25h.375v2.25h-.375z"/>
              <path d="M22.5 16.5A4.5 4.5 0 0 0 18 12c-1.332 0-2.52.578-3.336 1.492A5.967 5.967 0 0 0 12 12a5.967 5.967 0 0 0-2.664 1.492A4.5 4.5 0 0 0 6 12a4.5 4.5 0 0 0-4.5 4.5V18h21v-1.5z"/>
            </svg>
            View Full Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
}
