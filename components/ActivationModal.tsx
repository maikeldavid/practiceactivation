import React, { useState } from 'react';
import type { Program } from '../types';
import { XIcon, CheckCircleIcon } from './IconComponents';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrograms: Program[];
}

const ActivationModal: React.FC<ActivationModalProps> = ({ isOpen, onClose, selectedPrograms }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 sm:pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-fade-in-up">
        {isSubmitted ? (
          <div className="p-8 text-center">
            <CheckCircleIcon className="w-16 h-16 text-itera-blue mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-itera-blue-dark mb-2">Request Sent!</h2>
            <p className="text-gray-600 mb-6">Thank you for your interest. Our activation team will contact you shortly to begin the onboarding process.</p>
            <button
              onClick={onClose}
              className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors duration-300"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <XIcon className="w-6 h-6" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-itera-blue-dark mb-2">Begin Your Activation</h2>
              <p className="text-gray-600 mb-6">Please confirm your selected programs and provide your contact information. Our team will reach out to begin the onboarding process.</p>

              <div className="mb-6">
                <h3 className="font-semibold text-itera-blue-dark mb-3">Selected Programs:</h3>
                {selectedPrograms.length > 0 ? (
                  <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {selectedPrograms.map(p => (
                      <li key={p.id} className="bg-itera-blue-light p-3 rounded-lg text-itera-blue-dark font-medium">{p.title}</li>
                    ))}
                  </ul>
                ) : <p className="text-gray-500">No programs selected.</p>}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-itera-blue focus:border-itera-blue" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-itera-blue focus:border-itera-blue" />
                  </div>
                  <div>
                    <label htmlFor="practice" className="block text-sm font-medium text-gray-700">Practice Name</label>
                    <input type="text" id="practice" name="practice" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-itera-blue focus:border-itera-blue" />
                  </div>
                </div>
                <div className="mt-8 text-right">
                  <button type="submit" className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors duration-300">
                    Submit Activation Request
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivationModal;