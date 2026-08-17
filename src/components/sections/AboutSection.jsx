import { motion } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

export default function AboutSection() {
  const { data } = useCMS();
  const artist = data.artist || {
    title: "The Artist",
    text1: "", text2: "", quote: "", text3: "", image: ""
  };

  const GENRES_ARRAY = [
    "TECH HOUSE", "INDIE DANCE", "MELODIC TECHNO", "PEAK TECHNO", 
    "AFRO HOUSE", "ORGANIC HOUSE", "PROGRESSIVE TECHNO"
  ];

  // Helper component to render the list with separators
  const MarqueeGroup = () => (
    <div className="flex items-center px-4 md:px-8">
      {GENRES_ARRAY.map((genre, idx) => (
        <span key={idx} className="flex items-center">
          <span className="hover:text-white cursor-pointer transition-colors duration-300">
            {genre}
          </span>
          <span className="text-white/20 mx-4 md:mx-8">/</span>
        </span>
      ))}
    </div>
  );

  return (
    <section id="about" className="relative py-16 md:py-20 bg-black overflow-hidden">
      
      {/* INFINITE MARQUEE */}
      <div className="w-full overflow-hidden whitespace-nowrap mb-16 md:mb-24 flex items-center bg-[#050505] py-4 md:py-6 border-y border-white/5">
        <div className="animate-marquee flex text-3xl md:text-5xl font-heading font-black text-white/40 tracking-widest uppercase hover:[animation-play-state:paused]">
          <MarqueeGroup />
          <MarqueeGroup />
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-[3/4] w-full"
        >
          <div className="absolute inset-0 border-2 border-white translate-x-4 translate-y-4"></div>
          <img 
            src={artist.image} 
            alt="Artist Portrait" 
            className="w-full h-full object-cover grayscale relative z-10 hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <h3 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-white uppercase tracking-tighter mb-8">{artist.title}</h3>
          <div className="space-y-6 text-gray-400 text-sm md:text-base leading-relaxed font-sans tracking-wide">
            {artist.text1 && <p>{artist.text1}</p>}
            {artist.text2 && <p>{artist.text2}</p>}
            {artist.quote && (
              <p className="text-white font-bold italic opacity-90 border-l-4 border-white pl-4 my-6">
                {artist.quote}
              </p>
            )}
            {artist.text3 && <p>{artist.text3}</p>}
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
