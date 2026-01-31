import React, { useState } from 'react';
import { OnboardingTask } from '../../types';
import {
    ClockIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    Filter,
    CalendarIcon,
    UserIcon,
    ShieldCheckIcon,
    StethoscopeIcon,
    BriefcaseIcon,
    BotIcon,
    InboxIcon,
    PlusIcon,
    PencilIcon
} from '../IconComponents';
import AddTaskModal from './AddTaskModal';

interface TaskInboxViewProps {
    tasks: OnboardingTask[];
    onUpdateStatus: (id: string, status: OnboardingTask['status']) => void;
    onNavigate: (view: any) => void;
    onAddTask: (task: Omit<OnboardingTask, 'id' | 'status'>) => void;
}

const getCategoryIcon = (category: OnboardingTask['category']) => {
    switch (category) {
        case 'Legal': return ShieldCheckIcon;
        case 'Clinical': return StethoscopeIcon;
        case 'Technical': return BotIcon;
        case 'Training': return BriefcaseIcon;
        default: return AlertCircleIcon;
    }
};

const getStatusColor = (status: OnboardingTask['status']) => {
    switch (status) {
        case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
        case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Delayed': return 'bg-red-100 text-red-700 border-red-200';
        case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const TaskInboxView: React.FC<TaskInboxViewProps> = ({ tasks, onUpdateStatus, onNavigate, onAddTask }) => {
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [isAddingTask, setIsAddingTask] = useState(false);

    const categories = ['All', 'Legal', 'Clinical', 'Technical', 'Training'];
    const statuses = ['All', 'Pending', 'In Progress', 'Completed', 'Delayed'];

    const filteredTasks = tasks.filter(task => {
        const catMatch = filterCategory === 'All' || task.category === filterCategory;
        const statMatch = filterStatus === 'All' || task.status === filterStatus;
        return catMatch && statMatch;
    });

    const handleStartWork = (task: OnboardingTask) => {
        onUpdateStatus(task.id, 'In Progress');

        // Map Task titles to views
        if (task.title.includes('Health System Profile')) onNavigate('provider-profile');
        else if (task.title.includes('Legal Documents')) onNavigate('document-signing');
        else if (task.title.includes('Care Team Members')) onNavigate('team');
        else if (task.title.includes('EHR Access')) onNavigate('ehr');
        else if (task.title.includes('Clinical Training')) onNavigate('training');
        else if (task.title.includes('Outreach Scripts')) onNavigate('outreach-scripts');
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full custom-scrollbar">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-itera-blue-dark">Task Inbox</h2>
                        <button
                            onClick={() => setIsAddingTask(true)}
                            className="p-1 px-3 bg-itera-blue/10 text-itera-blue rounded-lg text-xs font-bold hover:bg-itera-blue hover:text-white transition-all flex items-center gap-1"
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                            Add Custom Task
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Manage and track your onboarding milestones.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="text-xs font-bold text-gray-600 outline-none bg-transparent"
                        >
                            {categories.map(c => <option key={c} value={c}>{c} Category</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="text-xs font-bold text-gray-600 outline-none bg-transparent"
                        >
                            {statuses.map(s => <option key={s} value={s}>{s} Status</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tasks Grid/List */}
            <div className="grid grid-cols-1 gap-4 pb-12">
                {filteredTasks.map((task, idx) => {
                    const CategoryIcon = getCategoryIcon(task.category);
                    return (
                        <div
                            key={task.id}
                            className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all animate-in slide-in-from-bottom-2 duration-300"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${task.category === 'Legal' ? 'bg-purple-50 text-purple-600' :
                                    task.category === 'Clinical' ? 'bg-blue-50 text-blue-600' :
                                        task.category === 'Technical' ? 'bg-orange-50 text-orange-600' :
                                            'bg-green-50 text-green-600'
                                    }`}>
                                    <CategoryIcon className="w-6 h-6" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-3 mb-1">
                                        <h4 className="text-base font-bold text-gray-800 truncate">{task.title}</h4>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0 ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{task.description}</p>

                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            Due: {task.dueDate || 'TBD'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <UserIcon className="w-3.5 h-3.5" />
                                            Assignee: {task.assignee || 'Unassigned'}
                                        </div>

                                        <div className="ml-auto flex items-center gap-2">
                                            {task.status !== 'Completed' && task.isCompletable !== false && (
                                                <button
                                                    onClick={() => onUpdateStatus(task.id, 'Completed')}
                                                    className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-500 hover:text-white transition-all active:scale-95"
                                                >
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    Mark Done
                                                </button>
                                            )}
                                            {task.status !== 'Completed' && (
                                                <button
                                                    onClick={() => handleStartWork(task)}
                                                    className="flex items-center gap-2 px-4 py-1.5 bg-itera-blue text-white rounded-lg text-xs font-bold hover:bg-itera-blue-dark transition-all active:scale-95 shadow-md shadow-itera-blue/20"
                                                >
                                                    <ClockIcon className="w-4 h-4" />
                                                    Start
                                                </button>
                                            )}
                                            {task.status === 'Completed' && (
                                                <button
                                                    onClick={() => handleStartWork(task)}
                                                    className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-200 transition-all active:scale-95"
                                                >
                                                    <PencilIcon className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredTasks.length === 0 && (
                    <div className="py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <InboxIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700">No tasks found</h3>
                        <p className="text-gray-500 text-sm">Adjust your filters or celebrate a clear inbox!</p>
                    </div>
                )}
            </div>

            {isAddingTask && (
                <AddTaskModal
                    onClose={() => setIsAddingTask(false)}
                    onSave={onAddTask}
                />
            )}
        </div>
    );
};

export default TaskInboxView;
