
import React from 'react';
import { WHY_VBC_ITEMS } from '../constants';

const WhyValueBasedCareSection: React.FC = () => {
  return (
    <section className="py-20 bg-itera-blue-light">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-itera-blue-dark mb-4">
            Transforming Fee-for-Service into Value-Driven Outcomes
            </h2>
            <p className="text-lg text-gray-600 mb-12">
            Connecting patients, providers, and payers through proactive, data-driven care.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_VBC_ITEMS.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center justify-center h-12 w-12 bg-itera-blue-light rounded-full mx-auto mb-4">
                <item.icon className="h-6 w-6 text-itera-blue-dark" />
              </div>
              <h3 className="text-xl font-bold text-itera-blue-dark mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyValueBasedCareSection;
