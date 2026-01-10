
import React, { useState, useMemo } from 'react';
import { TIMELINE_STEPS } from '../../constants';
import { CheckCircleIcon } from '../IconComponents';

const OnboardingStepsView: React.FC = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const activeStepData = useMemo(() => {
        return TIMELINE_STEPS.find(step => step.step === activeStep);
    }, [activeStep]);
    
    const handleCompleteStep = () => {
        setCompletedSteps(prev => new Set(prev).add(activeStep));
        if (activeStep < TIMELINE_STEPS.length) {
            setActiveStep(activeStep + 1);
        }
    };
    
    return (
        <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-itera-blue-dark">Practice Onboarding Journey</h2>
            
            {/* Stepper */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg border border-gray-200 space-y-4 md:space-y-0 md:space-x-2">
              {TIMELINE_STEPS.map((step, index) => (
                <React.Fragment key={step.step}>
                  <div 
                    className="flex-1 text-center cursor-pointer group w-full"
                    onClick={() => setActiveStep(step.step)}
                  >
                    <div className="flex items-center md:flex-col">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${activeStep === step.step ? 'bg-itera-blue border-itera-blue' : completedSteps.has(step.step) ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300 group-hover:border-itera-blue'}`}>
                        {completedSteps.has(step.step) ?
                            <CheckCircleIcon className="w-6 h-6 text-white" /> :
                            <step.icon className={`w-5 h-5 transition-all duration-300 ${activeStep === step.step ? 'text-white' : 'text-gray-500 group-hover:text-itera-blue'}`} />
                        }
                      </div>
                      <div className="md:mt-3 text-left md:text-center ml-4 md:ml-0">
                        <h3 className={`font-semibold text-sm transition-colors duration-300 ${activeStep === step.step ? 'text-itera-blue-dark' : 'text-gray-700'}`}>{step.title}</h3>
                      </div>
                    </div>
                  </div>
                  {index < TIMELINE_STEPS.length - 1 && (
                    <div className="hidden md:block flex-shrink-0 w-16 h-px bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Details */}
             <div className="bg-white p-8 rounded-lg border border-gray-200 min-h-[24rem]">
                {activeStepData && (
                    <div key={activeStep} className="animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-itera-blue-dark mb-2">
                           Step {activeStepData.step} &mdash; {activeStepData.title}
                        </h3>
                        <p className="text-gray-600 mb-6">{activeStepData.details.subtitle}</p>
                        
                         <div className="space-y-4 mb-8">
                            {activeStepData.details.sections.map((section, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-itera-blue-dark mb-2">{section.title}</h4>
                                <ul className="space-y-2">
                                  {section.points.map((point, pIndex) => (
                                    <li key={pIndex} className="flex items-start text-sm text-gray-700">
                                      <CheckCircleIcon className="w-4 h-4 text-itera-blue mr-2 mt-0.5 flex-shrink-0" />
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-end">
                             <button onClick={handleCompleteStep} disabled={completedSteps.has(activeStep)} className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                               {completedSteps.has(activeStep) ? 'Completed' : `Mark Step ${activeStep} as Complete`}
                            </button>
                        </div>

                    </div>
                )}
            </div>

        </div>
    );
};

export default OnboardingStepsView;
