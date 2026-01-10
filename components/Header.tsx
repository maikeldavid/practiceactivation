
import React from 'react';
import { Logo } from './IconComponents';

interface HeaderProps {
  onStartActivation: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartActivation }) => {
  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Programs', href: '#ecosystem' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact Us', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        const headerElement = document.querySelector('header');
        const headerOffset = headerElement ? headerElement.offsetHeight : 72; // Fallback height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
        window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
        });
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center" aria-label="ITERA HEALTH Home">
          <Logo className="h-10" />
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-gray-600 font-medium hover:text-itera-blue transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={onStartActivation}
            className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transform hover:-translate-y-px transition-all duration-200"
          >
            Start Activation
          </button>
        </nav>
        <div className="md:hidden">
            <button
                onClick={onStartActivation}
                className="bg-itera-blue text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors"
            >
                Activate
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;