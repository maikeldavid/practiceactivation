import React, { useState } from 'react';
import { XIcon, PlusIcon, ClipboardListIcon, UserIcon, CalendarIcon, ShieldCheckIcon, StethoscopeIcon, BotIcon, BriefcaseIcon } from '../IconComponents';
import { OnboardingTask } from '../../types';

interface AddTaskModalProps {
    onClose: () => void;
    onSave: (task: Omit<OnboardingTask, 'id' | 'status'>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Clinical' as OnboardingTask['category'],
        dueDate: '',
        assignee: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-itera-blue-dark/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>

            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl z-10 overflow-hidden relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-itera-blue hover:bg-itera-blue-light/20 rounded-full transition-all"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-itera-blue/10 rounded-2xl flex items-center justify-center border border-itera-blue/20">
                            <PlusIcon className="w-6 h-6 text-itera-blue" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-itera-blue-dark">New Custom Task</h2>
                            <p className="text-gray-500 text-sm">Add a specific milestone or to-do item.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Task Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Set up practice email signatures"
                                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Provide more details about what needs to be done..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all"
                                >
                                    <option value="Clinical">Clinical</option>
                                    <option value="Legal">Legal</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Training">Training</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Due Date</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Assignee</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.assignee}
                                    onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                                    placeholder="Assign to a team member..."
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] py-4 bg-itera-blue text-white rounded-2xl font-bold shadow-lg shadow-itera-blue/30 hover:bg-itera-blue-dark active:scale-[0.98] transition-all"
                            >
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
