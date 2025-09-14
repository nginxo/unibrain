import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedNotes from './components/FeaturedNotes';
import NFTShowcase from './components/NFTShowcase';
import UploadSection from './components/UploadSection';
import Stats from './components/Stats';
import Footer from './components/Footer';
import { useFarcasterContext } from './hooks/useFarcasterContext';

function App() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);
  const [pathname, setPathname] = useState<string>('');
  const { context, loading, error, hasCapability } = useFarcasterContext();

  useEffect(() => {
    // Handle URL parameters and pathname
    const url = new URL(window.location.href);
    setUrlParams(new URLSearchParams(url.search));
    setPathname(url.pathname);

    // Handle sub-paths
    if (pathname.includes('/nft')) {
      setActiveTab('nft');
    } else if (pathname.includes('/upload')) {
      setActiveTab('upload');
    } else if (pathname.includes('/marketplace')) {
      setActiveTab('marketplace');
    }

    // Handle query parameters
    const tab = url.searchParams.get('tab');
    if (tab && ['marketplace', 'nft', 'upload'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [pathname]);

  // Show loading state while Farcaster context is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading UniBrain...</p>
        </div>
      </div>
    );
  }

  // Show error state if context failed to load
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Failed to load: {error}</p>
        </div>
      </div>
    );
  }

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