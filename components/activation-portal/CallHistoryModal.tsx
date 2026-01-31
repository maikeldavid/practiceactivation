
import React from 'react';
import { XIcon, PhoneCall, CalendarIcon, UserIcon, ClockIcon } from '../IconComponents';
import type { MockPatient, CallLog } from '../../types';

interface CallHistoryModalProps {
    patient: MockPatient;
    onClose: () => void;
}

const CallHistoryModal: React.FC<CallHistoryModalProps> = ({ patient, onClose }) => {
    const logs = [...(patient.callLogs || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 backdrop-blur-sm animate-fade-in pt-12 md:pt-20">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col m-4 animate-scale-in">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Call History</h3>
                        <p className="text-sm text-gray-500">Interaction log for <span className="font-semibold text-itera-blue-dark">{patient.name}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {logs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No call history recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {logs.map((log) => (
                                <div key={log.id} className="relative pl-8 before:absolute before:left-3 before:top-8 before:bottom-[-24px] before:w-0.5 before:bg-gray-200 last:before:hidden">
                                    <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-itera-blue rounded-full z-10"></div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative top-[-4px]">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">{log.outcome}</p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarIcon className="w-3 h-3" />
                                                        {new Date(log.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ClockIcon className="w-3 h-3" />
                                                        {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                                                {log.performedBy || 'System'}
                                            </span>
                                        </div>
                                        {log.notes && (
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2 italic border border-gray-100/50">
                                                "{log.notes}"
                                            </p>
                                        )}
                                        {log.nextAction && (
                                            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-itera-blue bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                                                <ClockIcon className="w-3.5 h-3.5" />
                                                Next Action: {log.nextAction}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallHistoryModal;
