import React, { useState, useMemo } from 'react';
import { PROGRAMS } from '../constants';
import type { Program } from '../types';
import { ArrowRightIcon } from './IconComponents';

interface ProgramCardProps {
    program: Program;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, isSelected, onSelect }) => {
    const textColor = isSelected ? 'text-itera-blue-light/90' : 'text-gray-600';
    const titleColor = isSelected ? 'text-white' : 'text-itera-blue-dark';
    const benefitsTextColor = isSelected ? 'text-white' : 'text-itera-blue-dark';

    return (
        <div
            onClick={() => onSelect(program.id)}
            // Enhanced styling for selected state with dark background and scaling
            className={`cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 ease-in-out ${isSelected ? 'bg-itera-blue-dark border-itera-blue-dark shadow-xl scale-105' : 'border-gray-200 bg-white hover:border-itera-blue/50 hover:scale-[1.02] hover:shadow-lg'}`}
        >
            <div className="flex items-center mb-3">
                <div className={`flex items-center justify-center h-10 w-10 rounded-full mr-4 transition-colors duration-300 ${isSelected ? 'bg-white/20' : 'bg-itera-blue-light'}`}>
                    <program.icon className={`h-6 w-6 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-itera-blue'}`} />
                </div>
                <h3 className={`text-xl font-bold ${titleColor} transition-colors duration-300`}>{program.name}</h3>
            </div>
            <p className={`${textColor} mb-4 transition-colors duration-300`}>{program.title}</p>
            
            {/* Added smooth animation for the details dropdown */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSelected ? 'max-h-48 pt-4 mt-4 border-t' : 'max-h-0'}`}
                 style={{ borderColor: isSelected ? 'rgba(255, 255, 255, 0.3)' : 'transparent' }}>
                <div className={`text-sm ${benefitsTextColor}`}>
                    <p><strong className="font-semibold">Benefits:</strong> {program.benefits}</p>
                    <p className="mt-2"><strong className="font-semibold">Est. Implementation:</strong> {program.implementationTime}</p>
                </div>
            </div>
        </div>
    );
};

interface BuildPracticeSectionProps {
  onStartActivation: (programs: Program[]) => void;
}

const BuildPracticeSection: React.FC<BuildPracticeSectionProps> = ({ onStartActivation }) => {
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(new Set());

  const handleSelectProgram = (id: string) => {
    setSelectedPrograms(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };
  
  const selectedProgramDetails = useMemo(() => {
    return PROGRAMS.filter(p => selectedPrograms.has(p.id));
  }, [selectedPrograms]);

  const hasSelection = selectedPrograms.size > 0;

  return (
    <>
      <section id="activation" className="py-20 bg-white" style={{ paddingBottom: hasSelection ? '10rem' : '5rem' }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-itera-blue-dark mb-4">Choose the Programs That Fit Your Practice</h2>
            <p className="text-lg text-gray-600 mb-12">
              Select one or multiple programs to start building your connected ecosystem. Our team will guide your onboarding step by step.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROGRAMS.map(program => (
              <ProgramCard 
                  key={program.id} 
                  program={program}
                  isSelected={selectedPrograms.has(program.id)}
                  onSelect={handleSelectProgram}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Floating Selection Bar */}
      {hasSelection && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-30 animate-slide-in-up shadow-[0_-5px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left side: Selection summary */}
                <div className="text-center sm:text-left">
                    <p className="text-lg font-bold text-itera-blue-dark">
                        <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-itera-blue-light text-itera-blue-dark rounded-full">
                            {selectedPrograms.size}
                        </span>
                        Program{selectedPrograms.size > 1 ? 's' : ''} Selected
                    </p>
                    <p className="text-sm text-gray-500 mt-1 hidden md:block max-w-lg truncate">
                        {selectedProgramDetails.map(p => p.name).join(', ')}
                    </p>
                </div>

                {/* Right side: Action button */}
                <button
                    onClick={() => onStartActivation(selectedProgramDetails)}
                    className="flex items-center justify-center gap-2 bg-itera-blue text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-itera-blue-dark transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-lg"
                >
                    <span>Continue to Activation</span>
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}
    </>
  );
};

export default BuildPracticeSection;