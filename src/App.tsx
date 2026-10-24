/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeHub } from './components/HomeHub';
import { FaqSection } from './components/FaqSection';
import { IpayDownloadSection } from './components/IpayDownloadSection';
import { FlappyGameSection } from './components/FlappyGameSection';
import { SavingsCalculatorSection } from './components/SavingsCalculatorSection';
import { LoanScheduleSection } from './components/LoanScheduleSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchLocatorSection } from './components/BranchLocatorSection';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Smooth transition when switching tabs with GSAP
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
    // Scroll to top on tab switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-sky-200 selection:text-sky-900">
      {/* Header Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Top Navigation Tabs */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dynamic Content Area */}
      <main ref={contentRef} className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomeHub onSelectFeature={(featureId) => setActiveTab(featureId)} />
        )}

        {activeTab === 'faq' && (
          <FaqSection onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'ipay' && (
          <IpayDownloadSection />
        )}

        {activeTab === 'game' && (
          <FlappyGameSection onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'savings' && (
          <SavingsCalculatorSection />
        )}

        {activeTab === 'loan' && (
          <LoanScheduleSection />
        )}

        {activeTab === 'products' && (
          <FeaturedProductsSection />
        )}

        {activeTab === 'branches' && (
          <BranchLocatorSection />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
