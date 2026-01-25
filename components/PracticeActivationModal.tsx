
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import type { Program } from '../types';
import { XIcon } from './IconComponents';

interface PracticeActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrograms: Program[];
  onSuccess: (data: { name: string; email: string; practiceName: string; }) => void;
}

const PracticeActivationModal: React.FC<PracticeActivationModalProps> = ({ isOpen, onClose, selectedPrograms, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    practiceName: '',
  });

  // Reset form when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', email: '', practiceName: '' });
    }
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 sm:pt-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg relative transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-95 scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-itera-blue-dark mb-2">Begin Your Activation</h2>
          <p className="text-gray-600 mb-6">Confirm your selected programs and provide your contact info. Our team will reach out to begin onboarding.</p>

          <div className="mb-6">
            <h3 className="font-semibold text-itera-blue-dark mb-3">Selected Programs:</h3>
            {selectedPrograms.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2 bg-gray-50 p-3 rounded-lg border">
                {selectedPrograms.map(p => (
                  <p key={p.id} className="text-itera-blue-dark font-medium text-sm">{p.title}</p>
                ))}
              </div>
            ) : <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg border">No programs selected. You can add them from the "Choose Programs" section.</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-itera-blue focus:border-itera-blue" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-itera-blue focus:border-itera-blue" />
              </div>
              <div>
                <label htmlFor="practiceName" className="block text-sm font-medium text-gray-700">Practice Name</label>
                <input type="text" id="practiceName" name="practiceName" value={formData.practiceName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-itera-blue focus:border-itera-blue" />
              </div>
            </div>
            <div className="mt-8 text-right">
              <button type="submit" className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors duration-300">
                Submit Activation Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PracticeActivationModal;
