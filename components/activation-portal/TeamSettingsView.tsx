
import React, { useState, FormEvent } from 'react';
import { TIMELINE_STEPS } from '../../constants';
import { 
    PhoneCall, 
    ClipboardListIcon, 
    DollarSignIcon, 
    RepeatIcon, 
    CalendarIcon, 
    CheckCircleIcon 
} from '../IconComponents';

interface ContactInfo {
    name: string;
    email: string;
    phone: string;
}

// Configuration for the wizard steps
const STEPS_CONFIG = [
  {
    step: 1,
    title: 'Critical & Cautionary Response',
    roleKey: 'CriticalandCationaryResponse',
    microcopy: 'Help us identify who handles patient alerts — this ensures timely care coordination.',
    icon: PhoneCall,
  },
  {
    step: 2,
    title: 'Medication Management',
    roleKey: 'MedicationManagement',
    microcopy: 'Let’s define who manages medication refills for seamless communication.',
    icon: ClipboardListIcon,
  },
  {
    step: 3,
    title: 'Billing Contact',
    roleKey: 'BillingContact',
    microcopy: 'Who’s your billing point of contact? This helps us automate claim coordination.',
    icon: DollarSignIcon,
  },
  {
    step: 4,
    title: 'Care Plan Adjustment',
    roleKey: 'CarePlanAdjustment',
    microcopy: 'Designate the professional responsible for modifying patient care plans.',
    icon: RepeatIcon,
  },
  {
    step: 5,
    title: 'Appointment Management Contact',
    roleKey: 'AppointmentManagementContact',
    microcopy: 'Specify who will coordinate appointments for high-risk patients.',
    icon: CalendarIcon,
  },
];

const InputField: React.FC<{
  roleKey: string;
  field: 'name' | 'email' | 'phone';
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ roleKey, field, label, type, placeholder, value, onChange }) => (
     <div>
        <label htmlFor={`${roleKey}-${field}`} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={`${roleKey}-${field}`}
            name={`${roleKey}.${field}`}
            value={value}
            onChange={onChange}
            required
            placeholder={placeholder}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-itera-blue focus:border-itera-blue"
        />
    </div>
);


const TeamSettingsView: React.FC = () => {
  const step1Data = TIMELINE_STEPS[0];

  const initialFormState = step1Data.details.sections[0].points.reduce((acc, point) => {
      const key = point.replace(/\s+/g, '');
      acc[key] = { name: '', email: '', phone: '' };
      return acc;
  }, {} as Record<string, ContactInfo>);

  const [formData, setFormData] = useState(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [roleKey, field] = name.split('.');
    
    if (roleKey && field && (field === 'name' || field === 'email' || field === 'phone')) {
        setFormData(prev => ({
            ...prev,
            [roleKey]: {
                ...prev[roleKey],
                [field]: value
            }
        }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Care Team Submitted:', formData);
    setIsComplete(true);
  };
  
  const handleReset = () => {
      setIsComplete(false);
      setCurrentStep(1);
  }

  const activeStepConfig = STEPS_CONFIG.find(s => s.step === currentStep);
  if (!activeStepConfig) return null; // Should not happen

  const progressPercentage = (currentStep / STEPS_CONFIG.length) * 100;
  
  if (isComplete) {
      return (
        <div className="text-center bg-white p-12 rounded-lg border border-gray-200 animate-fade-in-up">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-itera-blue-dark mb-2">🎉 Care Team Successfully Configured</h2>
            <p className="text-gray-600 mb-6">Your collaborative care setup is ready. You can adjust any contact anytime.</p>
            <button 
                onClick={handleReset} 
                className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors"
            >
                Configure Again
            </button>
        </div>
      )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-itera-blue-dark">Care Team Setup</h2>
      
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit}>
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-itera-blue-dark">Step {currentStep} of {STEPS_CONFIG.length}</p>
                    <p className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-itera-blue h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[350px]">
                <div key={currentStep} className="animate-fade-in-up flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-itera-blue-light rounded-full flex items-center justify-center mb-4">
                        <activeStepConfig.icon className="w-8 h-8 text-itera-blue-dark" />
                    </div>
                    <h3 className="text-xl font-semibold text-itera-blue-dark mb-2">{activeStepConfig.title}</h3>
                    <p className="mb-8 text-gray-600 max-w-md">{activeStepConfig.microcopy}</p>

                     <div className="w-full max-w-sm text-left space-y-4">
                        <InputField
                            roleKey={activeStepConfig.roleKey}
                            field="name"
                            label="Full Name"
                            type="text"
                            placeholder="e.g., Dr. Jane Smith"
                            value={formData[activeStepConfig.roleKey]?.name || ''}
                            onChange={handleChange}
                        />
                        <InputField
                            roleKey={activeStepConfig.roleKey}
                            field="email"
                            label="Email Address"
                            type="email"
                            placeholder="jane.smith@practice.com"
                            value={formData[activeStepConfig.roleKey]?.email || ''}
                            onChange={handleChange}
                        />
                        <InputField
                            roleKey={activeStepConfig.roleKey}
                            field="phone"
                            label="Phone Number"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData[activeStepConfig.roleKey]?.phone || ''}
                            onChange={handleChange}
                        />
                     </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center">
                <button 
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    disabled={currentStep === 1}
                    className="text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Back
                </button>
                <p className="text-xs text-gray-400">💾 Your progress is saved automatically.</p>
                {currentStep < STEPS_CONFIG.length ? (
                    <button 
                        type="button"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors"
                    >
                        Save & Continue
                    </button>
                ) : (
                    <button 
                        type="submit" 
                        className="bg-itera-orange text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-orange-dark transition-colors"
                    >
                        Finish Setup
                    </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};

export default TeamSettingsView;