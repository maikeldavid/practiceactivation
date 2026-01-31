import React, { useState } from 'react';
import { XIcon, UserIcon, PhoneCall, MailIcon, MapPinIcon, ShieldCheckIcon, ActivityIcon, PlusIcon } from '../IconComponents';
import type { MockPatient } from '../../types';
import { PROGRAM_NAMES } from '../../utils/eligibilityEngine';

interface AddPatientModalProps {
    onClose: () => void;
    onSave: (patient: Omit<MockPatient, 'id' | 'status'>) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        phone: '',
        homePhone: '',
        email: '',
        address: '',
        zipCode: '',
        insurance: '',
        eligiblePrograms: [] as string[],
        chronicConditions: [] as string[]
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const toggleProgram = (program: string) => {
        setFormData(prev => {
            const programs = prev.eligiblePrograms.includes(program)
                ? prev.eligiblePrograms.filter(p => p !== program)
                : [...prev.eligiblePrograms, program];
            return { ...prev, eligiblePrograms: programs };
        });
    };

    const toggleCondition = (condition: string) => {
        setFormData(prev => {
            const conditions = prev.chronicConditions.includes(condition)
                ? prev.chronicConditions.filter(c => c !== condition)
                : [...prev.chronicConditions, condition];
            return { ...prev, chronicConditions: conditions };
        });
    };

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.dob) newErrors.dob = 'Date of Birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.phone && !formData.email) {
            newErrors.contact = 'At least one contact method (Phone or Email) is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const handleSave = () => {
        if (formData.eligiblePrograms.length === 0) {
            setErrors({ programs: 'Select at least one eligible program' });
            return;
        }

        const newPatient: Omit<MockPatient, 'id' | 'status'> = {
            name: `${formData.firstName} ${formData.lastName}`,
            dob: formData.dob,
            gender: formData.gender as 'male' | 'female',
            phone: formData.phone,
            homePhone: formData.homePhone,
            email: formData.email,
            address: formData.address,
            zipCode: formData.zipCode,
            insurance: formData.insurance as any || 'Other',
            eligiblePrograms: formData.eligiblePrograms,
            chronicConditions: formData.chronicConditions
        };

        onSave(newPatient);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-itera-blue-dark/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 max-h-[90vh]">
                {/* Header */}
                <div className="p-6 bg-itera-blue-dark text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Register New Patient</h2>
                        <p className="text-white/70 text-sm">Step {step} of 3</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-100">
                    <div
                        className="h-full bg-itera-blue transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-itera-blue" />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-itera-blue outline-none ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                        placeholder="Jane"
                                    />
                                    {errors.firstName && <span className="text-xs text-red-500 font-medium">{errors.firstName}</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-itera-blue outline-none ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                        placeholder="Doe"
                                    />
                                    {errors.lastName && <span className="text-xs text-red-500 font-medium">{errors.lastName}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Date of Birth *</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => handleChange('dob', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-itera-blue outline-none ${errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                    />
                                    {errors.dob && <span className="text-xs text-red-500 font-medium">{errors.dob}</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Gender *</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleChange('gender', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-itera-blue outline-none ${errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && <span className="text-xs text-red-500 font-medium">{errors.gender}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-itera-blue" />
                                Contact Information
                            </h3>

                            {errors.contact && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg mb-2">
                                    {errors.contact}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Mobile Phone</label>
                                    <div className="relative">
                                        <PhoneCall className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Home Phone</label>
                                    <div className="relative">
                                        <PhoneCall className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.homePhone}
                                            onChange={(e) => handleChange('homePhone', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                                            placeholder="(555) 987-6543"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                <div className="relative">
                                    <MailIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                                        placeholder="patient@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                                    placeholder="123 Main St"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Zip Code</label>
                                    <input
                                        type="text"
                                        value={formData.zipCode}
                                        onChange={(e) => handleChange('zipCode', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                                        placeholder="12345"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <ShieldCheckIcon className="w-5 h-5 text-itera-blue" />
                                Clinical & Program Info
                            </h3>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Insurance Provider</label>
                                <select
                                    value={formData.insurance}
                                    onChange={(e) => handleChange('insurance', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                                >
                                    <option value="">Select Insurance</option>
                                    <option value="Medicare">Medicare</option>
                                    <option value="UHC">United Healthcare</option>
                                    <option value="Aetna">Aetna</option>
                                    <option value="Cigna">Cigna</option>
                                    <option value="Humana">Humana</option>
                                    <option value="BCBS">Blue Cross Blue Shield</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase">Eligible Programs *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['CCM', 'RPM'].map(prog => (
                                        <button
                                            key={prog}
                                            onClick={() => toggleProgram(prog)}
                                            className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${formData.eligiblePrograms.includes(prog)
                                                ? 'bg-itera-blue/10 border-itera-blue text-itera-blue-dark font-bold'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${formData.eligiblePrograms.includes(prog) ? 'bg-itera-blue border-transparent' : 'border-gray-300'
                                                }`}>
                                                {formData.eligiblePrograms.includes(prog) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-xs font-bold leading-tight">{PROGRAM_NAMES[prog] || prog}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">({prog})</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {errors.programs && <span className="text-xs text-red-500 font-medium">{errors.programs}</span>}
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase">Chronic Conditions</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Hypertension', 'Diabetes', 'Arthritis', 'COPD', 'Heart Failure'].map(cond => (
                                        <button
                                            key={cond}
                                            onClick={() => toggleCondition(cond)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${formData.chronicConditions.includes(cond)
                                                ? 'bg-gray-800 text-white border-gray-800'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cond}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-2.5 bg-itera-blue text-white font-bold rounded-xl shadow-lg hover:bg-itera-blue-dark transition-all flex items-center gap-2"
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="px-8 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                            Complete Registration
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
};

export default AddPatientModal;
