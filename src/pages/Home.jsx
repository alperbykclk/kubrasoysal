import HeroSection from '../components/sections/HeroSection';
import SetsSection from '../components/sections/SetsSection';
import SpotifySection from '../components/SpotifySection';
import MusicSection from '../components/sections/MusicSection';
import TourSection from '../components/sections/TourSection';
import MediaSection from '../components/sections/MediaSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';

export default function Home() {
  return (
    <div className="bg-black w-full overflow-hidden">
      <HeroSection />
      <SetsSection />
      <SpotifySection />
      <MusicSection />
      <TourSection />
      <MediaSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
