import React from 'react';
import HeroSection from './HeroSection';
import AnimatedEcosystemSection from './AnimatedEcosystemSection';
import WhyValueBasedCareSection from './WhyValueBasedCareSection';
import EcosystemSection from './EcosystemSection';
import BuildPracticeSection from './BuildPracticeSection';
import BenefitsSection from './BenefitsSection';
import ActivationJourneySection from './ActivationJourneySection';
import FaqSection from './FaqSection';
import ContactSection from './ContactSection';
import { Program } from '../types';

interface LandingPageProps {
    onStartActivation: () => void;
    onOpenActivationModal: (programs: Program[]) => void;
    isAuthenticated: boolean;
    onAuthRequest: (mode: 'login' | 'signup') => void;
    currentUser: any;
}

const LandingPage: React.FC<LandingPageProps> = ({
    onStartActivation,
    onOpenActivationModal,
    isAuthenticated,
    onAuthRequest,
    currentUser
}) => {
    return (
        <>
            <HeroSection onStartActivation={onStartActivation} />
            <AnimatedEcosystemSection />
            <WhyValueBasedCareSection />
            <EcosystemSection />
            <BuildPracticeSection onStartActivation={onOpenActivationModal} />
            <BenefitsSection />
            <ActivationJourneySection />
            <FaqSection />
            <ContactSection
                isAuthenticated={isAuthenticated}
                onAuthRequest={onAuthRequest}
                currentUser={currentUser}
            />
        </>
    );
};

export default LandingPage;
