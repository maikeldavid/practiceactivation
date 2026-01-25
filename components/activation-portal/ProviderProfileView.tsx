import React, { useState } from 'react';
import { CheckCircleIcon, HomeIcon, MapPinIcon, MailIcon, UsersIcon, Trash2Icon, GlobeIcon, PlusIcon } from '../IconComponents';
import type { PracticeProfile, PracticeLocation, ContactInfo } from '../../types';

interface ProviderProfileViewProps {
    initialData?: Partial<PracticeProfile>;
    onSave: (data: PracticeProfile) => void;
    onCancel?: () => void;
}

const ProviderProfileView: React.FC<ProviderProfileViewProps> = ({ initialData, onSave, onCancel }) => {
    // Practice State
    const [practiceData, setPracticeData] = useState({
        name: initialData?.name || '',
        website: initialData?.website || '',
        orgNPI: initialData?.orgNPI || '',
        medicarePotential: initialData?.medicarePotential || '',
        otherPotential: initialData?.otherPotential || ''
    });

    // Locations State
    const [locations, setLocations] = useState<PracticeLocation[]>(
        initialData?.locations || [
            { id: '1', name: '', address: '', phone: '', email: '' }
        ]
    );

    // Physician State
    const [physician, setPhysician] = useState({
        name: initialData?.physician?.name || '',
        npi: initialData?.physician?.npi || '',
        email: initialData?.physician?.email || '',
        phone: initialData?.physician?.phone || '',
        officeAssignments: initialData?.physician?.officeAssignments || []
    });

    // Care Team State
    const [careTeamMembers, setCareTeamMembers] = useState<ContactInfo[]>(
        initialData?.careTeamMembers || []
    );

    const [newMember, setNewMember] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        title: '',
        officeAssignments: [] as string[]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!practiceData.name.trim()) newErrors.practiceName = 'Practice name is required';

        locations.forEach((loc, index) => {
            if (!loc.name.trim()) newErrors[`location_${index}_name`] = 'Location name is required';
            if (!loc.address.trim()) newErrors[`location_${index}_address`] = 'Address is required';
            if (!loc.phone.trim()) newErrors[`location_${index}_phone`] = 'Phone is required';
        });

        if (!physician.name.trim()) newErrors.physicianName = 'Physician name is required';
        if (!physician.npi.trim()) {
            newErrors.physicianNPI = 'Physician NPI is required';
        } else if (!/^\d{10}$/.test(physician.npi.replace(/\s/g, ''))) {
            newErrors.physicianNPI = 'NPI must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({
                ...practiceData,
                locations,
                physician,
                careTeamMembers
            });
        }
    };

    const addLocation = () => {
        const newLoc: PracticeLocation = {
            id: Date.now().toString(),
            name: '',
            address: '',
            phone: '',
            email: ''
        };
        setLocations([...locations, newLoc]);
    };

    const removeLocation = (id: string) => {
        if (locations.length > 1) {
            setLocations(locations.filter(l => l.id !== id));
            setPhysician(prev => ({
                ...prev,
                officeAssignments: prev.officeAssignments.filter(locId => locId !== id)
            }));
        }
    };

    const updateLocation = (index: number, field: keyof PracticeLocation, value: string) => {
        const newLocations = [...locations];
        newLocations[index] = { ...newLocations[index], [field]: value };
        setLocations(newLocations);
    };

    const toggleAssignment = (locationId: string) => {
        setPhysician(prev => ({
            ...prev,
            officeAssignments: prev.officeAssignments.includes(locationId)
                ? prev.officeAssignments.filter(id => id !== locationId)
                : [...prev.officeAssignments, locationId]
        }));
    };

    const handleAddMember = () => {
        if (newMember.name && newMember.role && newMember.email && newMember.phone && newMember.officeAssignments.length > 0) {
            const member: ContactInfo = {
                id: Date.now().toString(),
                ...newMember
            };
            setCareTeamMembers(prev => [...prev, member]);
            setNewMember({
                name: '',
                role: '',
                email: '',
                phone: '',
                title: '',
                officeAssignments: []
            });
        }
    };

    const toggleMemberAssignment = (locationId: string) => {
        setNewMember(prev => ({
            ...prev,
            officeAssignments: prev.officeAssignments.includes(locationId)
                ? prev.officeAssignments.filter(id => id !== locationId)
                : [...prev.officeAssignments, locationId]
        }));
    };

    const isFormValid = practiceData.name && physician.name && physician.npi && locations[0].address;

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            <div>
                <h2 className="text-3xl font-bold text-itera-blue-dark mb-2">Health System Profile</h2>
                <p className="text-gray-600">Structure your practice, locations, and providers to align with healthcare industry standards.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Practice Information */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <span className="p-2 bg-blue-50 rounded-lg"><HomeIcon className="w-5 h-5 text-itera-blue" /></span>
                        Practice Information (Organization)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Practice Name *</label>
                            <input
                                type="text"
                                value={practiceData.name}
                                onChange={(e) => setPracticeData({ ...practiceData, name: e.target.value })}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue ${errors.practiceName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                placeholder="e.g., Amavita Health Group"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Organization NPI (Type 2)</label>
                            <input
                                type="text"
                                value={practiceData.orgNPI}
                                onChange={(e) => setPracticeData({ ...practiceData, orgNPI: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue"
                                placeholder="10-digit Org NPI"
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Practice Website (Optional)</label>
                            <input
                                type="text"
                                value={practiceData.website}
                                onChange={(e) => setPracticeData({ ...practiceData, website: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue"
                                placeholder="https://www.example.com"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Medicare FFS Patients</label>
                                <input
                                    type="number"
                                    value={practiceData.medicarePotential}
                                    onChange={(e) => setPracticeData({ ...practiceData, medicarePotential: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue"
                                    placeholder="Qty"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Other Patients</label>
                                <input
                                    type="number"
                                    value={practiceData.otherPotential}
                                    onChange={(e) => setPracticeData({ ...practiceData, otherPotential: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue"
                                    placeholder="Qty"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Practice Locations */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-2 bg-blue-50 rounded-lg"><MapPinIcon className="w-5 h-5 text-itera-blue" /></span>
                            Practice Locations (Offices)
                        </h3>
                        <button
                            type="button"
                            onClick={addLocation}
                            className="flex items-center gap-2 text-itera-blue hover:text-itera-blue-dark font-bold text-sm"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Location
                        </button>
                    </div>

                    <div className="space-y-6">
                        {locations.map((loc, idx) => (
                            <div key={loc.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                                {locations.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLocation(loc.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2Icon className="w-5 h-5" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location Name *</label>
                                        <input
                                            type="text"
                                            value={loc.name}
                                            onChange={(e) => updateLocation(idx, 'name', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-itera-blue"
                                            placeholder="e.g., Downtown Office"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Office Phone *</label>
                                        <input
                                            type="tel"
                                            value={loc.phone}
                                            onChange={(e) => updateLocation(idx, 'phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-itera-blue"
                                            placeholder="(555) 000-0000"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Office Email (Optional)</label>
                                        <input
                                            type="email"
                                            value={loc.email}
                                            onChange={(e) => updateLocation(idx, 'email', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-itera-blue"
                                            placeholder="office@example.com"
                                        />
                                    </div>
                                    <div className="md:col-span-6">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Office Address *</label>
                                        <input
                                            type="text"
                                            value={loc.address}
                                            onChange={(e) => updateLocation(idx, 'address', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-itera-blue"
                                            placeholder="Street, City, State, ZIP"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Principal Physician */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <span className="p-2 bg-blue-50 rounded-lg"><UsersIcon className="w-5 h-5 text-itera-blue" /></span>
                        Principal Physician (Individual)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Physician Full Name *</label>
                            <input
                                type="text"
                                value={physician.name}
                                onChange={(e) => setPhysician({ ...physician, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue"
                                placeholder="Dr. Jane Doe"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Individual NPI (Type 1) *</label>
                            <input
                                type="text"
                                value={physician.npi}
                                onChange={(e) => setPhysician({ ...physician, npi: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue ${errors.physicianNPI ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                placeholder="10-digit Individual NPI"
                                maxLength={10}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Physician Email (Optional)</label>
                            <input
                                type="email"
                                value={physician.email}
                                onChange={(e) => setPhysician({ ...physician, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue"
                                placeholder="physician@example.com"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Physician Phone (Optional)</label>
                            <input
                                type="tel"
                                value={physician.phone}
                                onChange={(e) => setPhysician({ ...physician, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue"
                                placeholder="(555) 000-0000"
                            />
                        </div>
                    </div>

                    {/* 4. Assign Physician to Locations */}
                    <div className="pt-4">
                        <label className="block text-sm font-bold text-gray-700 mb-3 text-itera-blue">Assign Physician to Locations:</label>
                        <div className="flex flex-wrap gap-3">
                            {locations.map(loc => loc.name && (
                                <button
                                    key={loc.id}
                                    type="button"
                                    onClick={() => toggleAssignment(loc.id)}
                                    className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${physician.officeAssignments.includes(loc.id)
                                        ? 'bg-itera-blue border-itera-blue text-white shadow-md'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-itera-blue hover:text-itera-blue'
                                        }`}
                                >
                                    {loc.name}
                                    {physician.officeAssignments.includes(loc.id) && ' ✓'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Care Team Section */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-itera-blue" />
                        Care Team Members (Optional)
                    </h3>

                    {careTeamMembers.length > 0 && (
                        <div className="mb-6 space-y-3">
                            {careTeamMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-800">{member.name}</p>
                                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-itera-blue border border-blue-100 rounded-full font-medium">{member.role}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-4">
                                            <span>✉️ {member.email}</span>
                                            <span>📞 {member.phone}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {member.officeAssignments?.map(locId => {
                                                const loc = locations.find(l => l.id === locId);
                                                return loc ? (
                                                    <span key={locId} className="text-[10px] uppercase tracking-wider font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded">
                                                        {loc.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCareTeamMembers(careTeamMembers.filter(m => m.id !== member.id))}
                                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                                    >
                                        <Trash2Icon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                        <p className="text-sm font-bold text-gray-700 mb-4">Add Care Team Member</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                value={newMember.name}
                                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-itera-blue"
                                placeholder="Full Name"
                            />
                            <input
                                type="text"
                                value={newMember.role}
                                onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-itera-blue"
                                placeholder="Role (e.g., Coordinator)"
                            />
                            <input
                                type="email"
                                value={newMember.email}
                                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-itera-blue"
                                placeholder="Email"
                            />
                            <input
                                type="tel"
                                value={newMember.phone}
                                onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-itera-blue"
                                placeholder="Phone"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Work Locations *</label>
                            <div className="flex flex-wrap gap-2">
                                {locations.map(loc => loc.name && (
                                    <button
                                        key={loc.id}
                                        type="button"
                                        onClick={() => toggleMemberAssignment(loc.id)}
                                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${newMember.officeAssignments.includes(loc.id)
                                            ? 'bg-itera-blue border-itera-blue text-white'
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-itera-blue/30'
                                            }`}
                                    >
                                        {loc.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddMember}
                            disabled={!newMember.name || !newMember.role || !newMember.email || !newMember.phone || newMember.officeAssignments.length === 0}
                            className="mt-4 flex items-center gap-2 px-6 py-2 bg-itera-blue text-white font-bold rounded-lg hover:bg-itera-blue-dark transition-colors disabled:bg-gray-200"
                        >
                            + Add Member
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 sticky bottom-8 bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-white transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="px-12 py-3 bg-itera-blue text-white font-bold rounded-xl shadow-lg hover:bg-itera-blue-dark transition-all transform hover:-translate-y-0.5 disabled:bg-gray-300 disabled:transform-none"
                    >
                        Save Health System Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProviderProfileView;
