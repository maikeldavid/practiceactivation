
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import CPTCodesPage from './components/CPTCodesPage';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PracticeActivationModal from './components/PracticeActivationModal';
import ActivationPortal from './components/activation-portal/ActivationPortal';
import AuthModal from './components/AuthModal';
import ProgramDocumentationPage from './components/ProgramDocumentationPage';
import type { Program } from './types';
import { MOCK_PATIENTS } from './mockData';

interface AuthUser {
  name: string;
  email: string;
  practiceName: string;
  role: string;
  documentsToSign?: boolean; // Flag to indicate if user needs to sign documents
  baaStatus?: 'pending' | 'sent' | 'signed';
  contractStatus?: 'pending' | 'sent' | 'signed';
}

const App: React.FC = () => {
  const [isActivationModalOpen, setActivationModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [selectedProgramsForModal, setSelectedProgramsForModal] = useState<Program[]>([]);
  const [isPortalOpen, setPortalOpen] = useState(false);
  const [practiceInfo, setPracticeInfo] = useState<{ name: string; email: string; practiceName: string; role: string; } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData: AuthUser) => {
    setAuthUser(userData);
    setAuthModalOpen(false);
    // If we just signed up or logged in, we set the practice info as well
    setPracticeInfo({
      name: userData.name,
      email: userData.email,
      practiceName: userData.practiceName,
      role: userData.role
    });

    // For new signups, simulate pending documents (in production, backend would set this)
    if (authMode === 'signup' && !userData.documentsToSign) {
      const updatedUser = {
        ...userData,
        documentsToSign: true,
        baaStatus: 'sent' as const,
        contractStatus: 'sent' as const
      };
      setAuthUser(updatedUser);
    }

    // Automatically open the portal after successful login
    setPortalOpen(true);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setPracticeInfo(null);
    setPortalOpen(false);
  };

  const handleOpenActivationModal = (programs: Program[]) => {
    setSelectedProgramsForModal(programs);
    if (!authUser) {
      handleOpenAuth('signup');
    } else {
      setActivationModalOpen(true);
    }
  };

  const handleCloseActivationModal = () => {
    setActivationModalOpen(false);
  };

  const handleActivationSuccess = (data: { name: string; email: string; practiceName: string; }) => {
    setPracticeInfo({
      ...data,
      role: authUser?.role || 'Practice Staff' // Default to Practice Staff if no role
    });
    setActivationModalOpen(false);
    setPortalOpen(true);
  };

  const handleClosePortal = () => {
    setPortalOpen(false);
  }

  const handleOpenPortal = () => {
    if (authUser) {
      if (!practiceInfo) {
        setPracticeInfo({
          name: authUser.name,
          email: authUser.email,
          practiceName: authUser.practiceName,
          role: authUser.role
        });
      }
      setPortalOpen(true);
    }
  };

  const handleScrollToActivation = () => {
    const targetElement = document.getElementById('activation');
    if (targetElement) {
      const headerElement = document.querySelector('header');
      const headerOffset = headerElement ? headerElement.offsetHeight : 72;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white text-gray-800">
      <Header
        onStartActivation={handleScrollToActivation}
        onAuth={handleOpenAuth}
        authUser={authUser}
        onOpenPortal={handleOpenPortal}
        onLogout={handleLogout}
      />
      <main>
        <Routes>
          <Route path="/" element={
            <LandingPage
              onStartActivation={handleScrollToActivation}
              onOpenActivationModal={handleOpenActivationModal}
              isAuthenticated={!!authUser}
              onAuthRequest={handleOpenAuth}
              currentUser={authUser}
            />
          } />
          <Route path="/cpt-codes" element={<CPTCodesPage />} />
          <Route path="/program-documentation" element={<ProgramDocumentationPage />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
      <PracticeActivationModal
        isOpen={isActivationModalOpen}
        onClose={handleCloseActivationModal}
        selectedPrograms={selectedProgramsForModal}
        onSuccess={handleActivationSuccess}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
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
