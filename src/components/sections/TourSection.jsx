import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

export default function TourSection() {
  const { data } = useCMS();
  const gigs = data.tour;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section id="tour" ref={ref} className="relative py-16 md:py-20 bg-black overflow-hidden flex items-center border-t border-white/5">
      {/* Background Image / Texture */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 w-full h-[150%] -top-[25%] z-0"
      >
        <div className="absolute inset-0 bg-black/90 z-10"></div>
        <img 
          src="/images/dj_crowd_1786953192644.jpg" 
          alt="Crowd" 
          className="w-full h-full object-cover opacity-30 grayscale"
        />
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter mb-3 leading-none">Tour Dates</h2>
          <p className="text-gray-400 font-sans tracking-widest uppercase text-xs md:text-sm">Upcoming & Past Shows</p>
        </motion.div>

        <div className="flex flex-col border-t border-white/20">
          {gigs.map((gig, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-white/10 transition-colors px-2 group ${
                gig.isPast ? "opacity-50 hover:opacity-70" : "hover:bg-white/5"
              }`}
            >
              
              <div className="flex-1 mb-3 md:mb-0">
                <p className={`font-heading font-black text-xl md:text-2xl tracking-tighter ${gig.isPast ? "text-gray-500 line-through decoration-gray-500" : "text-white"}`}>
                  {gig.date}
                </p>
              </div>

              <div className="flex-[2] mb-4 md:mb-0">
                <h3 className={`font-heading font-bold text-2xl md:text-3xl uppercase tracking-tighter leading-none ${gig.isPast ? "text-gray-500 line-through decoration-gray-500" : "text-white group-hover:text-gray-300 transition-colors"}`}>
                  {gig.venue}
                </h3>
                <p className={`uppercase tracking-widest text-[10px] md:text-xs mt-1.5 ${gig.isPast ? "text-gray-600 line-through" : "text-gray-400"}`}>
                  {gig.location}
                </p>
              </div>

              <div className="flex-1 flex justify-start md:justify-end">
                {gig.isPast ? (
                  <span className="font-heading font-bold tracking-widest uppercase text-xs text-gray-500 border border-gray-600/30 px-4 py-1.5">
                    COMPLETED
                  </span>
                ) : (
                  <button className="px-6 py-2.5 border border-white text-white bg-transparent font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-300">
                    TICKETS
                  </button>
                )}
              </div>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
