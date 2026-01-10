import React from 'react';
import { BENEFITS } from '../constants';

const BenefitsSection: React.FC = () => {
  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById('contact');
    if (targetElement) {
      const headerElement = document.querySelector('header');
      const headerOffset = headerElement ? headerElement.offsetHeight : 72; // Default height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="benefits" className="py-20 bg-itera-blue-light">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-itera-blue-dark mb-12">Benefits for every role in your Practice</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center justify-center h-16 w-16 bg-itera-blue-light rounded-full mx-auto mb-6">
                <benefit.icon className="h-8 w-8 text-itera-blue-dark" />
              </div>
              <h3 className="text-2xl font-bold text-itera-blue-dark mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="text-itera-blue-dark font-semibold hover:text-itera-blue transition-colors"
          >
            See Real Practice Results &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;