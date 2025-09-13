import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedNotes from './components/FeaturedNotes';
import NFTShowcase from './components/NFTShowcase';
import UploadSection from './components/UploadSection';
import Stats from './components/Stats';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('marketplace');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'marketplace' && (
        <>
          <Hero />
          <Stats />
          <FeaturedNotes />
        </>
      )}
      
      {activeTab === 'nft' && (
        <NFTShowcase />
      )}
      
      {activeTab === 'upload' && (
        <UploadSection />
      )}
      
      <Footer />
    </div>
  );
}

export default App;