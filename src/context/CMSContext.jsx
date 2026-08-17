import { createContext, useContext, useState, useEffect } from 'react';

const CMSContext = createContext();

const defaultData = {
  artist: {
    title: "The Artist",
    text1: "Kübra Soysal has rapidly established herself as a dynamic force within the global electronic music scene. Known for her captivating sets that seamlessly blend the driving energy of Tech House, the emotional depth of Melodic Techno and Indie Dance, and the hypnotic rhythms of Afro House, she delivers a rich, immersive sound that resonates across borders.",
    text2: "Her international journey has already taken her through the vibrant dance floors of Bosnia and Serbia, with upcoming performances set to introduce her signature sound to Australia. Having headined premier Istanbul venues like Klein Phönix, Kastel, Kafes x Milo, and Barboat, she continues to expand her footprint by captivating crowds across Turkey, including Diyarbakır, Mardin, and Antalya.",
    quote: "\"Music is not just sound; it's a language everybody can speak and communicate with each other,\"",
    text3: "With an uncompromising dedication to her craft and an evolving global presence, Kübra Soysal continues to push the boundaries of modern dance music.",
    image: "/images/dj_portrait_ref_v2_1786953487371.jpg"
  },
  contact: {
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
    gigs: [
      "KLEIN PHONIX / ISTANBUL", "HEMINGWAY'S / BOSNIA", "MAMA SHELTER / SERBIA", "SPASS BELGRADE / SERBIA",
      "DARLING BELGRADE / SERBIA", "THE MONKEY / MARDIN", "FILINTA / MARDIN", "DIJIN / DIYARBAKIR",
      "KARMA FESTIVAL / ANTALYA", "INTERRAIL / KOCAELI", "KLEIN HARBIYE / ISTANBUL", "BARBOAT / ISTANBUL",
      "KASTEL / ISTANBUL", "KASTELTERAS / ISTANBUL", "EMAAR SKYVIEW / ISTANBUL", "KAFES&MILO BEACH / ISTANBUL",
      "JOANNA / ISTANBUL", "360 ROOF / ISTANBUL", "FIRIN / ISTANBUL", "9 ROOF / ISTANBUL", "SKETCH / ISTANBUL",
      "NACHT / ISTANBUL", "BEAT / ISTANBUL", "BOOZ / ISTANBUL", "GIAN / ISTANBUL", "UNDER / ISTANBUL",
      "BEYOND / ISTANBUL", "THE END / ISTANBUL", "KIKI / ISTANBUL", "KAMPWAY / ISTANBUL"
    ]
  },
  sets: [
    {
      id: "1",
      title: "KLEIN PHÖNIX",
      subtitle: "LIVE SET",
      description: "Minimal & Tech House Mix",
      dateInfo: "10.07.2026 | KÜBRA SOYSAL B2B BATUHAN ÖZDEMİR",
      videoId: "hCFLjiEOywk"
    }
  ],
  music: [
    { 
      id: "1",
      title: "Tech House of Munich", 
      type: "Original Mix", 
      image: "/images/track_cover_1.jpg",
      link: "https://soundcloud.com/kubrasoysal/tech-house-of-munich"
    },
    { 
      id: "2",
      title: "Techno of Mesopotamia", 
      type: "Original Mix", 
      image: "/images/track_cover_2.jpg",
      link: "https://soundcloud.com/kubrasoysal/afro-house-of-mesopotamia"
    },
    { 
      id: "3",
      title: "Afro House of Italy", 
      type: "Original Mix", 
      image: "/images/track_cover_3.jpg",
      link: "https://soundcloud.com/kubrasoysal/afro-house-of-italy-wav"
    },
    { 
      id: "4",
      title: "Afro House of Budapest", 
      type: "Original Mix", 
      image: "/images/track_cover_4.jpg",
      link: "https://soundcloud.com/kubrasoysal/01-afro-house-budapest-wav"
    }
  ],
  tour: [
    { id: "1", date: "17.07.2026", venue: "Klein Phönix", location: "Istanbul", isPast: true },
    { id: "2", date: "18.07.2026", venue: "Barboat", location: "Istanbul", isPast: true },
    { id: "3", date: "08.08.2026", venue: "Kafes & Milo Beach", location: "Istanbul", isPast: true },
    { id: "4", date: "05.09.2026", venue: "Kafes", location: "Istanbul", isPast: false },
    { id: "5", date: "10.10.2026", venue: "Australia / Canberra", location: "Canberra", isPast: false }
  ],
  media: [
    {
      id: "1",
      title: "Klein Phönix 2026",
      coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2000&auto=format&fit=crop",
        "/images/dj_media_ref_v2_1786953564860.jpg"
      ]
    },
    {
      id: "2",
      title: "Studio Sessions",
      coverImage: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520483601560-389dff434fdf?q=80&w=2000&auto=format&fit=crop"
      ]
    }
  ]
};

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  // Load from Firestore on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, 'cms', 'site');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          setData({ ...defaultData, ...firestoreData });
        }
      } catch (err) {
        console.warn('Firebase load failed, using defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const updateSection = async (section, newData) => {
    const updated = { ...data, [section]: newData };
    setData(updated);
    try {
      const { db } = await import('../lib/firebase.js');
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'cms', 'site'), updated);
    } catch (err) {
      console.error('Firebase save failed:', err);
    }
  };


  return (
    <CMSContext.Provider value={{ data, updateSection }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);
