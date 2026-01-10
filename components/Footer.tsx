import React, { useState } from 'react';
import InfoModal from './InfoModal';
import { Logo, LinkedInIcon, InstagramIcon, FacebookIcon } from './IconComponents';

const PrivacyPolicyContent = () => (
    <>
        <p className="mb-4"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        <p>Our commitment to protecting your privacy and handling your data is paramount. This policy outlines how we collect, use, and safeguard your personal and health information in compliance with HIPAA and other regulations.</p>
        <p className="mt-2">We utilize industry-standard security measures to ensure the confidentiality and integrity of all data processed through the ITERA HEALTH platform. For a detailed explanation of our data practices, please contact our compliance officer.</p>
    </>
);
const TermsOfUseContent = () => (
    <>
        <p className="mb-4"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        <p>Welcome to ITERA HEALTH. By accessing or using our platform and services, you agree to be bound by these Terms of Use. These terms govern your access to our ecosystem, outline your responsibilities as a user, and detail the scope of the services we provide.</p>
        <p className="mt-2">Use of our platform is intended for authorized healthcare professionals. Unauthorized access or use is strictly prohibited. Please review these terms carefully before proceeding.</p>
    </>
);
const AboutContent = () => (
    <>
        <p>ITERA HEALTH was founded with a clear mission: to empower medical practices to thrive in the world of value-based care. We believe that by connecting patients, physicians, and care teams through a seamless digital infrastructure, we can drive better health outcomes and improve practice efficiency.</p>
        <p className="mt-2">Our platform is more than just software; it's a comprehensive ecosystem designed to support every aspect of modern digital care, from remote monitoring to chronic care management.</p>
    </>
);


const SocialLink: React.FC<{ href: string; 'aria-label': string; children: React.ReactNode }> = ({ href, 'aria-label': ariaLabel, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="text-itera-blue hover:text-itera-blue-dark transition-colors">
        {children}
    </a>
);

const FooterLinkItem: React.FC<{ href?: string; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; children: React.ReactNode }> = ({ href, onClick, children }) => (
    <li>
        {href ? (
            <a href={href} className="text-gray-600 hover:text-itera-blue-dark transition-colors text-sm">
                {children}
            </a>
        ) : (
            <button onClick={onClick} className="text-gray-600 hover:text-itera-blue-dark transition-colors text-sm text-left">
                {children}
            </button>
        )}
    </li>
);

const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement>, title: string, content: React.ReactNode) => {
    e.preventDefault();
    setModalContent({ title, content });
  };
  
  return (
    <>
        <footer className="bg-white py-12 border-t border-gray-200">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Column 1: Logo and Social */}
                    <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
                        <Logo className="h-10" />

                        <p className="text-sm text-gray-500 max-w-xs">
                            Reimagining Healthcare Through Technology.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <SocialLink href="https://www.linkedin.com/" aria-label="LinkedIn">
                                <LinkedInIcon className="w-6 h-6" />
                            </SocialLink>
                            <SocialLink href="https://www.instagram.com/" aria-label="Instagram">
                                <InstagramIcon className="w-6 h-6" />
                            </SocialLink>
                            <SocialLink href="https://www.facebook.com/" aria-label="Facebook">
                                <FacebookIcon className="w-6 h-6" />
                            </SocialLink>
                        </div>
                    </div>

                    {/* Column 2: Company */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
                        <ul className="space-y-3">
                            <FooterLinkItem href="#">For Providers</FooterLinkItem>
                            <FooterLinkItem href="#">For Patients & Families</FooterLinkItem>
                            <FooterLinkItem href="#">Health Plans & Employers</FooterLinkItem>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <FooterLinkItem href="#">Documentation</FooterLinkItem>
                            <FooterLinkItem href="#">CPT Codes</FooterLinkItem>
                            <FooterLinkItem href="#">Blog</FooterLinkItem>
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <FooterLinkItem onClick={(e) => handleLinkClick(e, 'About ITERA HEALTH', <AboutContent />)}>About Us</FooterLinkItem>
                            <FooterLinkItem onClick={(e) => handleLinkClick(e, 'Privacy Policy', <PrivacyPolicyContent />)}>Privacy Policy</FooterLinkItem>
                            <FooterLinkItem onClick={(e) => handleLinkClick(e, 'Terms of Use', <TermsOfUseContent />)}>Terms and Conditions</FooterLinkItem>
                        </ul>
                    </div>
                </div>
                
                <hr className="my-8 border-gray-200" />

                <div className="text-center text-sm text-gray-500">
                    &copy; 2025 Itera Health. All rights reserved.
                </div>
            </div>
        </footer>
        <InfoModal 
            isOpen={!!modalContent}
            onClose={() => setModalContent(null)}
            title={modalContent?.title || ''}
        >
            {modalContent?.content}
        </InfoModal>
    </>
  );
};

export default Footer;