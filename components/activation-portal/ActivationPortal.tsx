
import React, { useState } from 'react';
import type { Program, MockPatient } from '../../types';
import { Logo, LogOutIcon, LayoutDashboard, ClipboardListIcon, UsersIcon, BarChart3, Settings, FolderIcon, HeadsetIcon, Bell, UserIcon, ChevronDown } from '../IconComponents';
import SettingsModal from '../SettingsModal';
import { DEFAULT_ROLES } from '../../constants';
import type { ContactInfo } from '../../types';
import DashboardView from './DashboardView';
import OnboardingStepsView from './OnboardingStepsView';
import PatientManagementView from './PatientManagementView';
import AnalyticsView from './AnalyticsView';
import TeamSettingsView from './TeamSettingsView';
import EHRAccessView from './EHRAccessView';
import TrainingSchedulingView from './TrainingSchedulingView';
import OutreachWorkspaceView from './OutreachWorkspaceView';
import DocumentsView from './DocumentsView';
import ProviderProfileView from './ProviderProfileView';
import DocumentSigningView from './DocumentSigningView';
import type { EHRConfig, TrainingMeeting } from '../../types';


type View = 'dashboard' | 'onboarding' | 'patients' | 'analytics' | 'documents' | 'team' | 'ehr' | 'training' | 'outreach' | 'provider-profile' | 'document-signing';

interface ActivationPortalProps {
  isOpen: boolean;
  onClose: () => void;
  practiceInfo: {
    name: string;
    email: string;
    practiceName: string;
    role: string;
  };
  selectedPrograms: Program[];
  patients: MockPatient[];
}

const ActivationPortal: React.FC<ActivationPortalProps> = ({ isOpen, onClose, practiceInfo, selectedPrograms, patients }) => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [roles, setRoles] = useState<ContactInfo[]>(DEFAULT_ROLES);
  const [ehrConfig, setEhrConfig] = useState<EHRConfig | null>(null);
  const [trainingMeeting, setTrainingMeeting] = useState<TrainingMeeting | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [patientList, setPatientList] = useState(patients);
  const [providerProfile, setProviderProfile] = useState<{
    providerName: string;
    providerAddress: string;
    providerPhone: string;
    providerEmail: string;
    providerNPI: string;
    careTeamMembers: { id: string; name: string; role: string; email: string }[];
  } | null>(null);
  const [documentsSignedStatus, setDocumentsSignedStatus] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: '1', message: 'New patient enrollment pending approval', time: '5 min ago', read: false },
    { id: '2', message: 'Team member John Doe added to care team', time: '1 hour ago', read: false },
    { id: '3', message: 'Monthly CCM report ready for review', time: '2 hours ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!isOpen) return null;

  const syncWithZoho = async (extraData: any = {}) => {
    try {
      const providerEmail = providerProfile?.providerEmail || practiceInfo.email;
      const providerName = providerProfile?.providerName || practiceInfo.name;

      const response = await fetch('/api/zoho/sync-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceName: practiceInfo.practiceName,
          providerName: providerName,
          providerEmail: providerEmail,
          phone: providerProfile?.providerPhone,
          address: providerProfile?.providerAddress,
          npi: providerProfile?.providerNPI,
          internalId: practiceInfo.email, // Using email as internal identifier
          status: completedSteps.size > 0 ? `Step ${Math.max(...Array.from(completedSteps) as number[])} Completed` : 'Initiated',
          ...extraData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Zoho Sync Error:', errorData);
        // Show alert to user so they can report the error EXACTLY
        alert(`Zoho Sync Error: ${errorData.message || errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to sync with Zoho:', error);
      alert(`Critical Connection Error: ${error instanceof Error ? error.message : 'The server could not be reached'}`);
    }
  };

  // If provider profile is not complete, redirect to provider profile view
  React.useEffect(() => {
    if (isOpen && !providerProfile && activeView !== 'provider-profile') {
      setActiveView('provider-profile');
    }

    if (isOpen) {
      syncWithZoho();
    }
  }, [isOpen, providerProfile, activeView]);

  const handleApprove = (ids: number[]) => {
    setPatientList(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'Approved' } : p));
  };

  const handleReject = (id: number) => {
    setPatientList(prev => prev.map(p => p.id === id ? { ...p, status: 'Not Approved' } : p));
  };

  const handleReset = (id: number) => {
    setPatientList(prev => prev.map(p => p.id === id ? { ...p, status: 'Pending Approval' } : p));
  };

  const handleSaveLogCall = (id: number, outcome: string, notes: string, nextAction?: { type: 'appointment' | 'followup', date: string, time: string }) => {
    setPatientList(prev => prev.map(p => {
      if (p.id !== id) return p;

      let status = p.status;
      let appointmentDate = p.appointmentDate;
      let nextCallDate = p.nextCallDate;

      if (status === 'Approved') status = 'Outreach - 1st Attempt';
      else if (status === 'Outreach - 1st Attempt') status = 'Outreach - 2nd Attempt';

      if (nextAction?.type === 'appointment') {
        status = 'Consent Sent';
        appointmentDate = `${nextAction.date}T${nextAction.time}:00Z`;
      } else if (nextAction?.type === 'followup') {
        nextCallDate = `${nextAction.date}T${nextAction.time}:00Z`;
      }

      return {
        ...p,
        status,
        appointmentDate,
        nextCallDate,
        lastCallOutcome: outcome,
        lastCallNotes: notes,
        callAttemptDate: new Date().toISOString(),
        careManager: nextAction?.type === 'appointment' ? (p.careManager || 'John Doe') : p.careManager
      };
    }));
  };

  const handleSchedule = (id: number, date: string, time: string) => {
    setPatientList(prev => prev.map(p => p.id === id ? {
      ...p,
      status: 'Consent Sent',
      appointmentDate: `${date}T${time}:00Z`,
      careManager: p.careManager || 'John Doe'
    } : p));
  };

  const NavItem: React.FC<{
    view: View;
    icon: React.ComponentType<{ className?: string }>;
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
        return <DashboardView patients={patientList} />;
      case 'onboarding':
        return (
          <OnboardingStepsView
            roles={roles}
            trainingMeeting={trainingMeeting}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
            onNavigate={setActiveView}
            providerProfile={providerProfile}
            documentsSignedStatus={documentsSignedStatus}
          />
        );
      case 'patients':
        return (
          <PatientManagementView
            patients={patientList}
            onApprove={handleApprove}
            onReject={handleReject}
            onReset={handleReset}
            onSaveLogCall={handleSaveLogCall}
            onSchedule={handleSchedule}
          />
        );
      case 'analytics':
        return <AnalyticsView patients={patientList} />;
      case 'documents':
        return <DocumentsView />;
      case 'team':
        return (
          <TeamSettingsView
            roles={roles}
            setRoles={(newRoles) => {
              setRoles(newRoles);
              setCompletedSteps(prev => {
                const next = new Set(prev).add(3);
                syncWithZoho({ status: 'Step 3 Completed (Care Team Setup)' });
                return next;
              });
            }}
            onCancel={() => setActiveView('onboarding')}
          />
        );
      case 'ehr':
        return (
          <EHRAccessView
            config={ehrConfig}
            onSave={(config) => {
              setEhrConfig(config);
              setCompletedSteps(prev => {
                const next = new Set(prev).add(4);
                syncWithZoho({ status: 'Step 4 Completed (EHR Access)' });
                return next;
              });
              setActiveView('onboarding');
            }}
            onCancel={() => setActiveView('onboarding')}
          />
        );
      case 'training':
        return (
          <TrainingSchedulingView
            meeting={trainingMeeting}
            onSave={(meeting) => {
              setTrainingMeeting(meeting);
              setCompletedSteps(prev => {
                const next = new Set(prev).add(5);
                syncWithZoho({ status: 'Step 5 Completed (Training Scheduled)' });
                return next;
              });
              setActiveView('onboarding');
            }}
            onCancel={() => setActiveView('onboarding')}
          />
        );
      case 'outreach':
        return (
          <OutreachWorkspaceView
            patients={patientList}
            onSaveLogCall={handleSaveLogCall}
          />
        );
      case 'provider-profile':
        return (
          <ProviderProfileView
            initialData={providerProfile || undefined}
            onSave={(data) => {
              setProviderProfile(data);
              setCompletedSteps(prev => {
                const next = new Set(prev).add(1);
                syncWithZoho({
                  status: 'Step 1 Completed (Provider Profile)',
                  phone: data.providerPhone,
                  address: data.providerAddress,
                  npi: data.providerNPI,
                  showError: true
                });
                return next;
              });
              // Redirect to onboarding to continue with next steps
              setActiveView('onboarding');
            }}
            onCancel={providerProfile ? () => setActiveView('onboarding') : undefined}
          />
        );
      case 'document-signing':
        return (
          <DocumentSigningView
            userEmail={practiceInfo.email}
            providerName={providerProfile?.providerName || practiceInfo.practiceName}
            onDocumentsSigned={() => {
              setDocumentsSignedStatus(true);
              setCompletedSteps(prev => {
                const next = new Set(prev).add(2);
                syncWithZoho({ status: 'Step 2 Completed (Legal Documents Signed)', contractStatus: 'Signed' });
                return next;
              });
              setActiveView('onboarding');
            }}
          />
        );
      default:
        return <DashboardView patients={patientList} />;
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
            <NavItem view="outreach" icon={HeadsetIcon} label="Daily Outreach Plan" />
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
                <h1 className="text-lg font-semibold text-gray-800">Welcome, {providerProfile?.providerName || practiceInfo.practiceName}</h1>
                <p className="text-sm text-gray-500">{practiceInfo.email}</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Settings Button (Admin only) */}
                {practiceInfo.role === 'Admin' && (
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-6 h-6" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                            >
                              <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">No new notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-itera-blue/10 border border-itera-blue/20 flex items-center justify-center text-itera-blue font-bold text-sm">
                      {practiceInfo.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-semibold text-gray-800">{practiceInfo.name}</p>
                      <p className="text-xs text-gray-500">{practiceInfo.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* User Menu Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <button
                        onClick={() => {
                          setActiveView('provider-profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={onClose}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOutIcon className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
            {renderContent()}
          </main>
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUser={{ name: practiceInfo.name, email: practiceInfo.email, practiceName: practiceInfo.practiceName }}
      />
    </div>
  );
};

export default ActivationPortal;