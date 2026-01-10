

import React, { useState, useMemo } from 'react';
import { TIMELINE_STEPS } from '../constants';
import { CheckCircleIcon } from './IconComponents';

const ActivationJourneySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  const activeStepData = useMemo(() => {
    return TIMELINE_STEPS.find(step => step.step === activeStep);
  }, [activeStep]);

  const StepDetails = () => (
    activeStepData && (
        <div key={activeStep} className="bg-itera-blue-light p-8 md:p-12 rounded-2xl shadow-lg min-h-[30rem] lg:min-h-[40rem] animate-fade-in-up">
            <h3 className="text-2xl md:text-3xl font-bold text-itera-blue-dark mb-2">
                Step {activeStepData.step} &mdash; {activeStepData.title}
            </h3>
            <p className="text-lg text-gray-600 mb-8">{activeStepData.details.subtitle}</p>
            
            <div className="mb-8">
                {activeStepData.step >= 1 && activeStepData.step <= 6 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column for Steps 1-6 */}
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm h-full">
                            <h4 className="font-bold text-itera-blue-dark mb-3 text-lg">{activeStepData.details.sections[0].title}</h4>
                            <ul className="space-y-3">
                                {activeStepData.details.sections[0].points.map((point, pIndex) => (
                                    <li key={pIndex} className="flex items-start text-sm">
                                        <div className="w-1.5 h-1.5 bg-itera-blue rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                        <div>
                                            <span className="font-semibold text-gray-700">{point}</span>
                                            {activeStepData.details.sections[0].subpoints?.[point] && (
                                            <p className="text-xs text-gray-500">{activeStepData.details.sections[0].subpoints[point]}</p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Right Column for Steps 1-6 */}
                        <div className="flex flex-col gap-6">
                            {[activeStepData.details.sections[1], activeStepData.details.sections[2]].map((section, index) => (
                                section && <div key={index} className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                                    <h4 className="font-bold text-itera-blue-dark mb-3 text-lg">{section.title}</h4>
                                    <ul className="space-y-3">
                                        {section.points.map((point, pIndex) => (
                                            <li key={pIndex} className="flex items-start text-sm">
                                                <div className="w-1.5 h-1.5 bg-itera-blue rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                                <div>
                                                    <span className="font-semibold text-gray-700">{point}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {activeStepData.details.sections.map((section, index) => (
                            <div key={index} className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                                <h4 className="font-bold text-itera-blue-dark mb-3 text-lg">{section.title}</h4>
                                <ul className="space-y-3">
                                    {section.points.map((point, pIndex) => (
                                        <li key={pIndex} className="flex items-start text-sm">
                                            <div className="w-1.5 h-1.5 bg-itera-blue rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                            <div>
                                                <span className="font-semibold text-gray-700">{point}</span>
                                                {section.subpoints?.[point] && (
                                                <p className="text-xs text-gray-500">{section.subpoints[point]}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h4 className="font-bold text-itera-blue-dark mb-4 text-lg">Checklist</h4>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                    <ul className={
                        activeStepData.step >= 1 && activeStepData.step <= 6
                        ? "flex flex-wrap justify-center items-center gap-x-8 gap-y-4"
                        : "grid grid-cols-1 md:grid-cols-2 gap-4"
                    }>
                    {activeStepData.details.checklist.map((item, cIndex) => (
                      <li key={cIndex} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-itera-blue mr-2 flex-shrink-0" />
                        <span className="text-gray-800 font-medium text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
        </div>
    )
  );

  return (
    <section id="journey" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-itera-blue-dark mb-4">Your 6-step onboarding journey</h2>
          <p className="text-lg text-gray-600 mb-16">
            A simple, streamlined process from enrollment to payment.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Stepper Column */}
          <div className="lg:col-span-4">
            {/* Vertical Stepper for Desktop */}
            <div className="hidden lg:block">
              {TIMELINE_STEPS.map((step, index) => (
                <div key={step.step} className="relative flex items-start pb-12 last:pb-0">
                  {/* Connecting Line */}
                  {index < TIMELINE_STEPS.length - 1 && (
                    <div className="absolute left-6 top-6 -ml-px h-full w-0.5 bg-gray-200"></div>
                  )}
                  {/* Step Icon */}
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${activeStep === step.step ? 'bg-itera-blue border-itera-blue' : 'bg-white border-gray-300'}`}>
                    <step.icon className={`w-6 h-6 transition-colors duration-300 ${activeStep === step.step ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  {/* Content */}
                  <button onClick={() => setActiveStep(step.step)} className="ml-6 text-left group">
                    <div className="flex items-center mb-1">
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mr-3 transition-colors duration-300 ${activeStep === step.step ? 'bg-itera-blue text-white' : 'bg-itera-blue-light text-itera-blue-dark'}`}>
                        Step {step.step}
                      </span>
                      <h3 className={`font-bold transition-colors duration-300 ${activeStep === step.step ? 'text-itera-blue-dark' : 'text-gray-700 group-hover:text-itera-blue-dark'}`}>{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{step.shortDescription}</p>
                  </button>
                </div>
              ))}
            </div>

            {/* Horizontal Stepper for Mobile/Tablet */}
            <div className="lg:hidden flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-8 md:space-y-0 md:space-x-4">
              {TIMELINE_STEPS.map((step, index) => (
                <React.Fragment key={step.step}>
                  <div 
                    className="flex-1 text-center cursor-pointer group"
                    onClick={() => setActiveStep(step.step)}
                  >
                    <div className="flex items-center md:flex-col">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${activeStep === step.step ? 'bg-itera-blue border-itera-blue' : 'bg-white border-gray-300 group-hover:border-itera-blue'}`}>
                        <step.icon className={`w-6 h-6 transition-colors duration-300 ${activeStep === step.step ? 'text-white' : 'text-gray-500 group-hover:text-itera-blue'}`} />
                      </div>
                      <div className="md:mt-4 text-left md:text-center ml-4 md:ml-0">
                        <div className="flex items-center md:justify-center">
                          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mr-2 transition-colors duration-300 ${activeStep === step.step ? 'bg-itera-blue text-white' : 'bg-itera-blue-light text-itera-blue-dark'}`}>
                            Step {step.step}
                          </span>
                          <h3 className={`font-bold transition-colors duration-300 ${activeStep === step.step ? 'text-itera-blue-dark' : 'text-gray-700'}`}>{step.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < TIMELINE_STEPS.length - 1 && (
                    <div className="hidden md:block flex-shrink-0 w-16 h-px bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-8">
            <StepDetails />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivationJourneySection;
