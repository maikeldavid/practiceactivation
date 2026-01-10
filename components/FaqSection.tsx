import React, { useState } from 'react';
import { FAQ_ITEMS } from '../constants';
import type { FaqItem } from '../types';
import { ChevronDown } from './IconComponents';

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="text-lg font-semibold text-itera-blue-dark">{item.question}</span>
        <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen mt-2' : 'max-h-0'}`}>
        <p className="text-gray-600 pt-2">{item.answer}</p>
      </div>
    </div>
  );
};

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-itera-blue-light">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-itera-blue-dark mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
        <div className="text-center mt-12">
            <a
                href="#contact"
                className="bg-itera-blue text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors duration-300"
            >
                Talk to Our Activation Team
            </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;