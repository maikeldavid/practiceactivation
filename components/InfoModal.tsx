
import React from 'react';
import { XIcon } from './IconComponents';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 sm:pt-20" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-itera-blue-dark">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="prose max-w-none text-gray-600 max-h-[70vh] overflow-y-auto pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
