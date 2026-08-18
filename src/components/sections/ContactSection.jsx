import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

export default function ContactSection() {
  const { data } = useCMS();
  const defaultContact = {
    title: "Bookings & Press",
    subtitle: "For worldwide bookings, press inquiries, and collaborations.",
    emailLabel: "Booking & Press Email",
    bookingEmail: "kubrasoysal9@gmail.com",
    telephoneLabel: "Contact Person",
    telephone: "+90 553 687 8313",
    basedInLabel: "Based In",
    basedIn: "TURKIYE / ISTANBUL",
    socialsLabel: "Socials",
    socials: [
      { name: "Instagram", url: "https://instagram.com/kubrasoysal" },
      { name: "SoundCloud", url: "https://soundcloud.com/kubrasoysal" }
    ],
    epkTitle: "Electronic Press Kit",
    epkText: "Access the official Tech Rider, stage plot, and comprehensive list of past venues and residencies for promoters and booking agents.",
    epkButton: "View EPK & Tech Rider",
    techRiderImage: "",
    gigs: [
      "KLEIN PHONIX / ISTANBUL", "HEMINGWAY'S / BOSNIA", "MAMA SHELTER / SERBIA", "SPASS BELGRADE / SERBIA",
      "DARLING BELGRADE / SERBIA", "THE MONKEY / MARDIN", "FILINTA / MARDIN", "DIJIN / DIYARBAKIR",
      "KARMA FESTIVAL / ANTALYA", "INTERRAIL / KOCAELI", "KLEIN HARBIYE / ISTANBUL", "BARBOAT / ISTANBUL",
      "KASTEL / ISTANBUL", "KASTELTERAS / ISTANBUL", "EMAAR SKYVIEW / ISTANBUL", "KAFES&MILO BEACH / ISTANBUL",
      "JOANNA / ISTANBUL", "360 ROOF / ISTANBUL", "FIRIN / ISTANBUL", "9 ROOF / ISTANBUL", "SKETCH / ISTANBUL",
      "NACHT / ISTANBUL", "BEAT / ISTANBUL", "BOOZ / ISTANBUL", "GIAN / ISTANBUL", "UNDER / ISTANBUL",
      "BEYOND / ISTANBUL", "THE END / ISTANBUL", "KIKI / ISTANBUL", "KAMPWAY / ISTANBUL"
    ]
  };

  const contact = { ...defaultContact, ...data.contact };
  const socials = Array.isArray(contact.socials) ? contact.socials : defaultContact.socials;
  const [isEpkOpen, setIsEpkOpen] = useState(false);

  // Scroll lock when EPK modal is open
  useEffect(() => {
    if (isEpkOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isEpkOpen]);

  return (
    <>
      <section id="contact" className="relative py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight mb-4">{contact.title}</h3>
            <p className="text-gray-400">{contact.subtitle}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
            
            {/* Contact Details */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center space-y-8"
            >
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{contact.emailLabel}</p>
                <a href={`mailto:${contact.bookingEmail}`} className="text-lg md:text-xl text-white hover:text-gray-300 transition-colors font-heading tracking-wide uppercase">{contact.bookingEmail}</a>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{contact.telephoneLabel}</p>
                <a href={`tel:${contact.telephone.replace(/[^0-9+]/g, '')}`} className="text-lg md:text-xl text-white hover:text-gray-300 transition-colors font-heading tracking-wide">{contact.telephone}</a>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{contact.basedInLabel}</p>
                <p className="text-lg md:text-xl text-white font-heading tracking-wide uppercase">{contact.basedIn}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{contact.socialsLabel}</p>
                <div className="flex flex-wrap gap-6 mt-2">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-white hover:text-gray-400 transition-colors uppercase tracking-widest text-sm font-bold">{s.name}</a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* EPK Action */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start justify-center p-8 border border-white/10 bg-black/30 backdrop-blur-sm"
            >
              <h4 className="text-2xl font-heading font-black text-white tracking-tight uppercase mb-4">{contact.epkTitle}</h4>
              <p className="text-gray-400 text-sm mb-8 text-center md:text-left">
                {contact.epkText}
              </p>
              <button 
                onClick={() => setIsEpkOpen(true)}
                className="px-8 py-4 bg-white text-black font-heading font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors w-full mb-4"
              >
                {contact.epkButton}
              </button>
              
              {contact.presskitUrl && (
                <a 
                  href={(() => {
                    const url = contact.presskitUrl;
                    try {
                      const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
                      const match = url.match(driveRegex);
                      if (match && match[1]) {
                        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
                      }
                      return url;
                    } catch (e) {
                      return url;
                    }
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border border-white/20 text-white font-heading font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors w-full text-center flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download Presskit
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* EPK MODAL */}
      <AnimatePresence>
        {isEpkOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto custom-scrollbar"
          >
            <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-12 sticky top-4 z-10">
                <h2 className="text-2xl md:text-4xl font-heading font-black tracking-tighter text-white">TECH RIDER & PRESS</h2>
                <button 
                  onClick={() => setIsEpkOpen(false)}
                  className="w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Tech Rider Image */}
                <div>
                  <h3 className="text-xl font-heading font-bold text-gray-400 uppercase tracking-widest mb-6">Equipment & Stage Plot</h3>
                  <div className="border border-white/10 p-2 bg-black/50">
                    {contact.techRiderImage ? (
                      <img src={contact.techRiderImage} alt="Tech Rider" className="w-full h-auto" />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest">
                        Tech Rider image not uploaded yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Gigs List */}
                <div>
                  <h3 className="text-xl font-heading font-bold text-gray-400 uppercase tracking-widest mb-6">Past Gigs & Residencies</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    {(contact.gigs || []).map((gig, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (index * 0.02) }}
                        key={index}
                        className="text-white font-heading text-sm tracking-wide border-b border-white/5 pb-2"
                      >
                        {gig}
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

