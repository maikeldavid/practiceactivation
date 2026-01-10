
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import WhyValueBasedCareSection from './components/WhyValueBasedCareSection';
import AnimatedEcosystemSection from './components/AnimatedEcosystemSection';
import EcosystemSection from './components/EcosystemSection';
import BuildPracticeSection from './components/BuildPracticeSection';
import BenefitsSection from './components/BenefitsSection';
import ActivationJourneySection from './components/ActivationJourneySection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PracticeActivationModal from './components/PracticeActivationModal';
import ActivationPortal from './components/activation-portal/ActivationPortal';
import type { Program } from './types';
import { MOCK_PATIENTS } from './mockData';

const App: React.FC = () => {
  const [isActivationModalOpen, setActivationModalOpen] = useState(false);
  const [selectedProgramsForModal, setSelectedProgramsForModal] = useState<Program[]>([]);
  const [isPortalOpen, setPortalOpen] = useState(false);
  const [practiceInfo, setPracticeInfo] = useState<{ name: string; email: string; practiceName: string; } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenActivationModal = (programs: Program[]) => {
    setSelectedProgramsForModal(programs);
    setActivationModalOpen(true);
  };

  const handleCloseActivationModal = () => {
    setActivationModalOpen(false);
  };
  
  const handleActivationSuccess = (data: { name: string; email: string; practiceName: string; }) => {
      setPracticeInfo(data);
      setActivationModalOpen(false);
      setPortalOpen(true);
  };
  
  const handleClosePortal = () => {
    setPortalOpen(false);
    // Reset practiceInfo after a delay for the animation to complete
    setTimeout(() => {
        setPracticeInfo(null);
        setSelectedProgramsForModal([]);
    }, 300);
  }


  return (
    <div className="bg-white text-gray-800">
      <Header onStartActivation={() => handleOpenActivationModal([])} />
      <main>
        <HeroSection onStartActivation={() => handleOpenActivationModal([])} />
        <AnimatedEcosystemSection />
        <WhyValueBasedCareSection />
        <EcosystemSection />
        <BuildPracticeSection onStartActivation={handleOpenActivationModal} />
        <BenefitsSection />
        <ActivationJourneySection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <Chatbot />
      <PracticeActivationModal
        isOpen={isActivationModalOpen}
        onClose={handleCloseActivationModal}
        selectedPrograms={selectedProgramsForModal}
        onSuccess={handleActivationSuccess}
      />
      {practiceInfo && (
        <ActivationPortal
            isOpen={isPortalOpen}
            onClose={handleClosePortal}
            practiceInfo={practiceInfo}
            selectedPrograms={selectedProgramsForModal}
            patients={MOCK_PATIENTS}
        />
      )}
    </div>
  );
};

export default App;
// Vercel Trigger: 01/10/2026 18:23:47
