
import React, { useState, useMemo } from 'react';
import { TIMELINE_STEPS } from '../../constants';
import { CheckCircleIcon, Settings, DatabaseIcon, CalendarClockIcon, MessageSquareIcon } from '../IconComponents';
import { ContactInfo, TrainingMeeting, PracticeProfile } from '../../types';

interface OnboardingStepsViewProps {
  roles: ContactInfo[];
  trainingMeeting: TrainingMeeting | null;
  completedSteps: Set<number>;
  setCompletedSteps: React.Dispatch<React.SetStateAction<Set<number>>>;
  onNavigate: (view: any) => void;
  providerProfile: PracticeProfile | null;
  documentsSignedStatus: boolean;
}

const OnboardingStepsView: React.FC<OnboardingStepsViewProps> = ({ roles, trainingMeeting, completedSteps, setCompletedSteps, onNavigate, providerProfile, documentsSignedStatus }) => {
  const [activeStep, setActiveStep] = useState(1);

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => /^[\d\s\-\(\)\+]{7,20}$/.test(phone);

  const isRoleConfigured = (role: ContactInfo) => {
    return !!(role.name && role.email && role.phone && isEmailValid(role.email) && isPhoneValid(role.phone));
  };

  const isTeamConfigured = roles.every(isRoleConfigured);
  const isProviderProfileComplete = !!(
    providerProfile?.name &&
    providerProfile?.physician.name &&
    providerProfile?.physician.npi &&
    providerProfile?.locations.length > 0 &&
    providerProfile?.locations[0].address
  );

  const activeStepData = useMemo(() => {
    return TIMELINE_STEPS.find(step => step.step === activeStep);
  }, [activeStep]);

  const handleCompleteStep = () => {
    if (activeStep === 1 && !isTeamConfigured) return;
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

            <div className={`mb-8 ${activeStepData.details.sections.length === 3 ? 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start' : 'space-y-4'}`}>
              {activeStepData.details.sections.length === 3 ? (
                <>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
                    <h4 className="font-bold text-lg text-itera-blue-dark mb-4 border-b border-itera-blue/10 pb-2">
                      {activeStepData.details.sections[0].title}
                    </h4>
                    <ul className="space-y-3">
                      {activeStepData.details.sections[0].points.map((point, pIndex) => (
                        <li key={pIndex} className="flex items-start text-sm text-gray-700">
                          <CheckCircleIcon className="w-5 h-5 text-itera-blue mr-3 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    {activeStepData.details.sections.slice(1).map((section, index) => (
                      <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-lg text-itera-blue-dark mb-4 border-b border-itera-blue-light/30 pb-2">
                          {section.title}
                        </h4>
                        <ul className="space-y-3">
                          {section.points.map((point, pIndex) => (
                            <li key={pIndex} className="flex items-start text-sm text-gray-700">
                              <CheckCircleIcon className="w-5 h-5 text-itera-blue mr-3 mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                activeStepData.details.sections.map((section, index) => (
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
                ))
              )}
            </div>

            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                {activeStep === 3 && (
                  <button
                    onClick={() => onNavigate('team')}
                    className="flex items-center gap-2 bg-white text-itera-blue-dark border border-itera-blue/20 font-bold py-2.5 px-5 rounded-xl shadow-sm hover:bg-itera-blue-light/30 transition-all group"
                  >
                    <Settings className="w-5 h-5 text-itera-blue group-hover:rotate-45 transition-transform" />
                    Collaborative Team Setup
                  </button>
                )}
                {activeStep === 4 && (
                  <button
                    onClick={() => onNavigate('ehr')}
                    className="flex items-center gap-2 bg-white text-itera-blue-dark border border-itera-blue/20 font-bold py-2.5 px-5 rounded-xl shadow-sm hover:bg-itera-blue-light/30 transition-all group"
                  >
                    <DatabaseIcon className="w-5 h-5 text-itera-blue group-hover:scale-110 transition-transform" />
                    EHR Access Setup
                  </button>
                )}
                {activeStep === 5 && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onNavigate('training')}
                      className="flex items-center gap-2 bg-white text-itera-blue-dark border border-itera-blue/20 font-bold py-2.5 px-5 rounded-xl shadow-sm hover:bg-itera-blue-light/30 transition-all group"
                    >
                      <CalendarClockIcon className="w-5 h-5 text-itera-blue group-hover:rotate-12 transition-transform" />
                      {trainingMeeting ? 'Reschedule Training Meeting' : 'Schedule Training Meeting'}
                    </button>
                    {trainingMeeting && (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <CheckCircleIcon className="w-4 h-4" />
                        Scheduled for {trainingMeeting.date} at {trainingMeeting.time}
                      </p>
                    )}
                  </div>
                )}
                {activeStep === 6 && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onNavigate('outreach-scripts')}
                      className="flex items-center gap-2 bg-white text-itera-blue-dark border border-itera-blue/20 font-bold py-2.5 px-5 rounded-xl shadow-sm hover:bg-itera-blue-light/30 transition-all group"
                    >
                      <MessageSquareIcon className="w-5 h-5 text-itera-blue group-hover:scale-110 transition-transform" />
                      Review & Approve Outreach Scripts
                    </button>
                    {completedSteps.has(6) && (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <CheckCircleIcon className="w-4 h-4" />
                        Scripts Approved
                      </p>
                    )}
                  </div>
                )}
                {activeStep === 3 && !isTeamConfigured && (
                  <p className="text-xs text-itera-orange font-medium flex items-center gap-1.5 bg-itera-orange/10 px-3 py-1.5 rounded-lg border border-itera-orange/20">
                    <span className="w-1.5 h-1.5 bg-itera-orange rounded-full animate-pulse"></span>
                    Finish team configuration to proceed
                  </p>
                )}
                {activeStep === 1 && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onNavigate('provider-profile')}
                      className="flex items-center gap-2 bg-white text-itera-blue-dark border border-itera-blue/20 font-bold py-2.5 px-5 rounded-xl shadow-sm hover:bg-itera-blue-light/30 transition-all group"
                    >
                      <Settings className="w-5 h-5 text-itera-blue group-hover:rotate-45 transition-transform" />
                      {isProviderProfileComplete ? 'Update Health System Profile' : 'Complete Health System Profile'}
                    </button>
                    {isProviderProfileComplete && (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <CheckCircleIcon className="w-4 h-4" />
                        Profile completed for {providerProfile?.physician.name}
                      </p>
                    )}
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onNavigate('document-signing')}
                      className="flex items-center gap-2 bg-white text-itera-blue-dark border border-itera-blue/20 font-bold py-2.5 px-5 rounded-xl shadow-sm hover:bg-itera-blue-light/30 transition-all group"
                    >
                      <DatabaseIcon className="w-5 h-5 text-itera-blue group-hover:scale-110 transition-transform" />
                      {documentsSignedStatus ? 'View Signed Documents' : 'Sign Legal Documents'}
                    </button>
                    {documentsSignedStatus && (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <CheckCircleIcon className="w-4 h-4" />
                        All documents signed
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                {((activeStep === 3 && isTeamConfigured) || (activeStep !== 3)) && (
                  <button
                    onClick={handleCompleteStep}
                    disabled={completedSteps.has(activeStep)}
                    className="bg-itera-blue text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {completedSteps.has(activeStep) ? 'Completed' : `Mark Step ${activeStep} as Complete`}
                  </button>
                )}
              </div>
            </div>

          </div>
        )
        }
      </div >

    </div >
  );
};

export default OnboardingStepsView;
