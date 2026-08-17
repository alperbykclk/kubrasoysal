import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CMSProvider } from './context/CMSContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';

// Placeholder for other pages to satisfy routing
const Placeholder = ({ title }) => (
  <div className="h-screen flex items-center justify-center">
    <h1 className="text-4xl font-heading uppercase text-accent">{title} - Coming Soon</h1>
  </div>
);

function App() {
  return (
    <CMSProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="music" element={<Placeholder title="Music" />} />
              <Route path="tour" element={<Placeholder title="Tour" />} />
              <Route path="media" element={<Placeholder title="Media" />} />
              <Route path="about" element={<Placeholder title="About" />} />
              <Route path="contact" element={<Placeholder title="Contact" />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </CMSProvider>
  );
}

export default App;
