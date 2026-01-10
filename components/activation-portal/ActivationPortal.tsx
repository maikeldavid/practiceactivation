
import React, { useState } from 'react';
import type { Program, MockPatient } from '../../types';
import { Logo, LogOutIcon, LayoutDashboard, ClipboardListIcon, UsersIcon, BarChart3, Settings, FolderIcon } from '../IconComponents';
import DashboardView from './DashboardView';
import OnboardingStepsView from './OnboardingStepsView';
import PatientManagementView from './PatientManagementView';
import AnalyticsView from './AnalyticsView';
import TeamSettingsView from './TeamSettingsView';
import DocumentsView from './DocumentsView';


type View = 'dashboard' | 'onboarding' | 'patients' | 'analytics' | 'team' | 'documents';

interface ActivationPortalProps {
  isOpen: boolean;
  onClose: () => void;
  practiceInfo: {
    name: string;
    email: string;
    practiceName: string;
  };
  selectedPrograms: Program[];
  patients: MockPatient[];
}

const ActivationPortal: React.FC<ActivationPortalProps> = ({ isOpen, onClose, practiceInfo, selectedPrograms, patients }) => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  if (!isOpen) return null;
  
  const NavItem: React.FC<{
    view: View;
    icon: React.ComponentType<{className?: string}>;
    label: string;
  }> = ({ view, icon: Icon, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === view ? 'bg-itera-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeView) {
        case 'dashboard':
            return <DashboardView patients={patients} />;
        case 'onboarding':
            return <OnboardingStepsView />;
        case 'patients':
            return <PatientManagementView patients={patients} />;
        case 'analytics':
            return <AnalyticsView patients={patients} />;
        case 'documents':
            return <DocumentsView />;
        case 'team':
            return <TeamSettingsView />;
        default:
            return <DashboardView patients={patients} />;
    }
  };


  return (
    <div className={`fixed inset-0 bg-gray-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} animate-fade-in-up`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
                <Logo className="h-10" />
            </div>
            <nav className="flex-grow p-4 space-y-2">
                <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem view="onboarding" icon={ClipboardListIcon} label="Onboarding Steps" />
                <NavItem view="patients" icon={UsersIcon} label="Patient Management" />
                <NavItem view="analytics" icon={BarChart3} label="Enrollment Analytics" />
                <NavItem view="documents" icon={FolderIcon} label="Document Library" />
                <NavItem view="team" icon={Settings} label="Care Team Setup" />
            </nav>
            <div className="p-4 border-t border-gray-200">
                <button onClick={onClose} className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    <span>Exit Portal</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-gray-200">
                <div className="px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">Welcome, {practiceInfo.practiceName}</h1>
                        <p className="text-sm text-gray-500">{practiceInfo.email}</p>
                    </div>
                    {/* Could add user profile icon here */}
                </div>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
                 {renderContent()}
            </main>
        </div>
      </div>
    </div>
  );
};

export default ActivationPortal;