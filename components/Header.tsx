
import React from 'react';
import { Logo } from './IconComponents';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onStartActivation: () => void;
  onAuth: (mode: 'login' | 'signup') => void;
  authUser: { name: string; email: string; documentsToSign?: boolean } | null;
  onOpenPortal: () => void;
  onLogout: () => void;
  onOpenDocSigning?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartActivation, onAuth, authUser, onOpenPortal, onLogout, onOpenDocSigning }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'How It Works', href: '/#how-it-works', type: 'hash' },
    { name: 'Programs', href: '/#ecosystem', type: 'hash' },
    { name: 'Benefits', href: '/#benefits', type: 'hash' },
    { name: 'Documentation', href: '/program-documentation', type: 'route' },
    { name: 'FAQ', href: '/#faq', type: 'hash' },
    { name: 'Contact Us', href: '/#contact', type: 'hash' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { href: string; type: string }) => {
    if (link.type === 'route') {
      // Allow default behavior for route links (handled by Link component if we used it, but here we can just let it navigate or use navigate)
      return;
    }

    e.preventDefault();

    // Check if we are on the homepage
    if (location.pathname !== '/') {
      navigate(link.href);
      return;
    }

    const targetId = link.href.split('#')[1];
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
            link.type === 'route' ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 font-medium hover:text-itera-blue transition-colors"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-gray-600 font-medium hover:text-itera-blue transition-colors"
              >
                {link.name}
              </a>
            )
          ))}

          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          {authUser ? (
            <div className="flex items-center gap-4">
              {authUser.documentsToSign && onOpenDocSigning && (
                <button
                  onClick={onOpenDocSigning}
                  className="relative text-orange-600 font-bold text-sm hover:text-orange-700 transition-colors flex items-center gap-2"
                >
                  Sign Documents
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                </button>
              )}
              <button
                onClick={onOpenPortal}
                className="text-itera-blue font-bold text-sm hover:underline"
              >
                My Portal
              </button>
              <button
                onClick={onLogout}
                className="text-gray-500 font-bold text-sm hover:text-red-500 transition-colors"
              >
                Logout
              </button>
              <div className="w-8 h-8 rounded-full bg-itera-blue/10 border border-itera-blue/20 flex items-center justify-center text-itera-blue font-bold text-xs">
                {authUser.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onAuth('login')}
                className="text-gray-600 font-bold text-sm hover:text-itera-blue transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onAuth('signup')}
                className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transform hover:-translate-y-px transition-all duration-200"
              >
                Start Activation
              </button>
            </div>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-3">
          {authUser ? (
            <button
              onClick={onOpenPortal}
              className="bg-itera-blue text-white font-semibold py-2 px-4 rounded-lg shadow-md text-xs"
            >
              Portal
            </button>
          ) : (
            <button
              onClick={() => onAuth('signup')}
              className="bg-itera-blue text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors text-xs"
            >
              Activate
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;