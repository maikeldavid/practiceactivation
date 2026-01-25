import React, { useState } from 'react';
import { BENEFITS } from '../constants';
import RevenueCalculator from './RevenueCalculator';

const BenefitsSection: React.FC = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  const handleToggleCalculator = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowCalculator(!showCalculator);
  };

  return (
    <section id="benefits" className="py-20 bg-itera-blue-light scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-itera-blue-dark mb-12">Benefits for every role in your Practice</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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

        <div className="text-center mb-12">
          <button
            onClick={handleToggleCalculator}
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${showCalculator
                ? 'bg-itera-blue-dark text-white shadow-xl'
                : 'bg-white text-itera-blue-dark shadow-lg hover:shadow-xl hover:-translate-y-1'
              }`}
          >
            {showCalculator ? 'Hide Estimates' : 'See Real Practice Results'}
            <span className={`transition-transform duration-300 ${showCalculator ? 'rotate-180' : 'group-hover:translate-x-2'}`}>
              {showCalculator ? '↑' : '→'}
            </span>
          </button>
        </div>

        {showCalculator && (
          <div className="max-w-5xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <RevenueCalculator />
            <p className="text-center text-gray-400 text-xs mt-8 px-4">
              *Estimations are based on Medicare national averages and may vary by region and patient complexity.
              Calculations assume standard compliance and documentation managed by Itera Health.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BenefitsSection;