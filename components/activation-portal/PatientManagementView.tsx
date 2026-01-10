
import React, { useState, useMemo } from 'react';
import type { MockPatient, PatientStatus } from '../../types';
import { Filter, UserCheckIcon, UsersIcon } from '../IconComponents';

type SubView = 'eligibility' | 'tracking';

const getStatusColor = (status: PatientStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
        case 'Approved': return 'bg-blue-100 text-blue-800';
        case 'Not Enrolled': return 'bg-red-100 text-red-800';
        case 'Consent Sent':
        case 'Device Shipped':
             return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const PatientTable: React.FC<{ patients: MockPatient[], onApprove: (ids: number[]) => void }> = ({ patients, onApprove }) => {
    const [selected, setSelected] = useState<Set<number>>(new Set());
    
    const handleSelect = (id: number) => {
        setSelected(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const pendingIds = patients.filter(p => p.status === 'Pending Approval').map(p => p.id);
            setSelected(new Set(pendingIds));
        } else {
            setSelected(new Set());
        }
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <button 
                    disabled={selected.size === 0}
                    onClick={() => {
                        onApprove(Array.from(selected));
                        setSelected(new Set());
                    }}
                    className="bg-itera-blue text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <UserCheckIcon className="w-5 h-5"/>
                    Approve ({selected.size}) for Outreach
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg border">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="p-4">
                                <input type="checkbox" onChange={handleSelectAll} />
                            </th>
                            <th scope="col" className="px-6 py-3">Patient Name</th>
                            <th scope="col" className="px-6 py-3">Eligible Programs</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(p => (
                            <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="w-4 p-4">
                                    {p.status === 'Pending Approval' && <input type="checkbox" checked={selected.has(p.id)} onChange={() => handleSelect(p.id)} />}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.name} <span className="text-gray-500 font-normal"> (DOB: {p.dob})</span></td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {p.eligiblePrograms.map(prog => <span key={prog} className="text-xs font-semibold bg-itera-blue-light text-itera-blue-dark px-2 py-0.5 rounded-full">{prog}</span>)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(p.status)}`}>{p.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const TrackingDashboard: React.FC<{ patients: MockPatient[] }> = ({ patients }) => {
    const activePatients = patients.filter(p => p.status !== 'Pending Approval');
    return (
        <div className="overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Patient Name</th>
                        <th scope="col" className="px-6 py-3">Enrolling In</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {activePatients.map(p => (
                        <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                            <td className="px-6 py-4">
                               <div className="flex flex-wrap gap-1">
                                    {p.eligiblePrograms.map(prog => <span key={prog} className="text-xs font-semibold bg-itera-blue-light text-itera-blue-dark px-2 py-0.5 rounded-full">{prog}</span>)}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(p.status)}`}>{p.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PatientManagementView: React.FC<{ patients: MockPatient[] }> = ({ patients: initialPatients }) => {
  const [activeView, setActiveView] = useState<SubView>('eligibility');
  const [patientList, setPatientList] = useState(initialPatients);

  const handleApprove = (ids: number[]) => {
      setPatientList(prev => prev.map(p => ids.includes(p.id) ? {...p, status: 'Approved'} : p));
  };
    
  return (
    <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-itera-blue-dark">Patient Management</h2>
             <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                <button onClick={() => setActiveView('eligibility')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${activeView === 'eligibility' ? 'bg-white shadow' : 'text-gray-600'}`}>Eligibility Review</button>
                <button onClick={() => setActiveView('tracking')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${activeView === 'tracking' ? 'bg-white shadow' : 'text-gray-600'}`}>Activation Tracking</button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-semibold text-itera-blue-dark">{activeView === 'eligibility' ? 'Patient Eligibility List' : 'Patient Activation Status'}</h3>
                    <p className="text-sm text-gray-500">
                        {activeView === 'eligibility' ? 'Review and approve patients for program outreach.' : 'Monitor the progress of approved patients.'}
                    </p>
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 border px-3 py-1.5 rounded-lg hover:bg-gray-100">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>
            
            {activeView === 'eligibility' ? <PatientTable patients={patientList} onApprove={handleApprove} /> : <TrackingDashboard patients={patientList} />}
        </div>
    </div>
  );
};

export default PatientManagementView;
