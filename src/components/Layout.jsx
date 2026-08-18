import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SpotifyWidget from './SpotifyWidget';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <SpotifyWidget />
    </div>
  );
}
