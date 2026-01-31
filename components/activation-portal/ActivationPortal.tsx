
import React, { useState } from 'react';
import type { Program, MockPatient, Role } from '../../types';
import { Logo, LogOutIcon, LayoutDashboard, ClipboardListIcon, UsersIcon, BarChart3, Settings, FolderIcon, HeadsetIcon, Bell, UserIcon, ChevronDown, ShieldCheckIcon } from '../IconComponents';
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
import UserProfileView from './UserProfileView';
import ResponsibilityMatrixView from './ResponsibilityMatrixView';
import OutreachScriptReviewView from './OutreachScriptReviewView';
import type { EHRConfig, TrainingMeeting, ZohoAssignmentRule, PracticeProfile, RegisteredProvider, OnboardingTask } from '../../types';
import AddProviderModal from './AddProviderModal';
import ProviderManagementView from './ProviderManagementView';
import TaskInboxView from './TaskInboxView';
import CampaignManagementView from './CampaignManagementView';
import { StethoscopeIcon, InboxIcon, MegaphoneIcon } from '../IconComponents';

type View = 'dashboard' | 'onboarding' | 'patients' | 'analytics' | 'documents' | 'team' | 'ehr' | 'training' | 'outreach' | 'provider-profile' | 'document-signing' | 'user-profile' | 'responsibility-matrix' | 'outreach-scripts' | 'providers' | 'task-inbox' | 'campaigns';

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
  const [teamMembers, setTeamMembers] = useState<ContactInfo[]>(DEFAULT_ROLES);
  const [ehrConfig, setEhrConfig] = useState<EHRConfig | null>(null);
  const [trainingMeeting, setTrainingMeeting] = useState<TrainingMeeting | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [patientList, setPatientList] = useState(patients);
  const [providerProfile, setProviderProfile] = useState<PracticeProfile | null>(null);
  const [documentsSignedStatus, setDocumentsSignedStatus] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: practiceInfo.name,
    email: practiceInfo.email,
    role: practiceInfo.role,
    phone: '',
    address: ''
  });
  const [notifications] = useState([
    { id: '1', message: 'New patient enrollment pending approval', time: '5 min ago', read: false },
    { id: '2', message: 'Team member John Doe added to care team', time: '1 hour ago', read: false },
    { id: '3', message: 'Monthly Chronic Care Management report ready for review', time: '2 hours ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [assignmentRules, setAssignmentRules] = useState<ZohoAssignmentRule[]>([
    { id: '1', field: 'Always', operator: 'equals', value: '*', assignTo: 'Maikel (Default)' },
    { id: '2', field: 'Zip Code', operator: 'starts with', value: '33', assignTo: 'Florida Sales Team' }
  ]);
  const [enableCustomRules, setEnableCustomRules] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [zohoIds, setZohoIds] = useState<{ accountId?: string; contactId?: string; dealId?: string }>({});
  const [providerList, setProviderList] = useState<RegisteredProvider[]>([
    {
      id: '1',
      name: 'Dr. Michael Smith',
      email: 'm.smith@valleyhealth.com',
      practiceName: 'Valley Health Partners',
      npi: '1234567890',
      status: 'Active',
      registrationDate: '2023-11-15',
      location: 'Miami, FL',
      programs: ['CCM', 'RPM']
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.j@oakmedical.com',
      practiceName: 'Oak Medical Group',
      npi: '0987654321',
      status: 'Pending',
      registrationDate: '2024-01-10',
      location: 'Orlando, FL',
      programs: ['CCM']
    }
  ]);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [customTasks, setCustomTasks] = useState<OnboardingTask[]>([]);
  const [portalUsers, setPortalUsers] = useState<any[]>([
    { id: '1', name: 'Admin User', email: 'admin@itera.health', role: 'Admin', status: 'active' },
    { id: '2', name: 'Call Center Agent', email: 'callcenter@itera.health', role: 'Call Center', status: 'active' },
    { id: '3', name: 'Practice Staff', email: 'practice@itera.health', role: 'Practice Staff', status: 'active' },
    {
      id: '4', name: 'John Doe', email: 'john.doe@itera.health', role: 'Care Manager', status: 'active',
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Friday', startTime: '09:00', endTime: '15:00' }
      ]
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'Admin', permissions: ['All Access', 'Manage Users', 'Manage Settings'], userCount: 1 },
    { id: '2', name: 'Call Center', permissions: ['View Patients', 'Enroll Patients', 'Schedule Appointments', 'Log Calls'], userCount: 1 },
    { id: '3', name: 'Practice Staff', permissions: ['View Patients', 'View Reports', 'Approve Enrollments'], userCount: 1 },
    { id: '4', name: 'Physician', permissions: ['View Patients', 'Edit Care Plans', 'View Reports'], userCount: 0 },
    { id: '5', name: 'Care Coordinator', permissions: ['View Patients', 'Edit Care Plans'], userCount: 0 },
    { id: '6', name: 'Care Manager', permissions: ['View Patients', 'Log Calls', 'Schedule Appointments', 'Daily Monitoring'], userCount: 0 }
  ]);

  const getTaskStatus = (id: string): OnboardingTask['status'] => {
    const stepNum = parseInt(id);
    if (completedSteps.has(stepNum)) return 'Completed';

    // Specific logic for 'In Progress' states
    if (id === '2' && documentsSignedStatus) return 'Completed';
    if (id === '2' && !documentsSignedStatus && completedSteps.has(1)) return 'In Progress';
    if (id === '5' && trainingMeeting) return 'Completed';
    if (id === '5' && !trainingMeeting && completedSteps.has(4)) return 'In Progress';

    // Auto-progress logic: if previous step is done, current is 'In Progress'
    if (stepNum > 1 && completedSteps.has(stepNum - 1)) return 'In Progress';
    if (stepNum === 1 && !completedSteps.has(1)) return 'In Progress';

    return 'Pending';
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => /^[\d\s\-\(\)\+]{7,20}$/.test(phone);
  const isRoleConfigured = (role: ContactInfo) => !!(role.name && role.email && role.phone && isEmailValid(role.email) && isPhoneValid(role.phone));
  const isTeamConfigured = teamMembers.length > 0 && teamMembers.every(isRoleConfigured);
  const isProviderProfileComplete = !!(
    providerProfile?.name &&
    providerProfile?.physician.name &&
    providerProfile?.physician.npi &&
    providerProfile?.locations.length > 0 &&
    providerProfile?.locations[0].address
  );

  const baseOnboardingTasks: OnboardingTask[] = [
    {
      id: '1',
      title: 'Complete Health System Profile',
      description: 'Provide basic information about your practice, locations, and principal physician.',
      status: getTaskStatus('1'),
      category: 'Clinical',
      dueDate: '2024-01-15',
      assignee: 'Dr. Michael Smith',
      isCompletable: isProviderProfileComplete
    },
    {
      id: '2',
      title: 'Sign Legal Documents',
      description: 'Review and sign the Physician Services Agreement and Business Associate Agreement.',
      status: getTaskStatus('2'),
      category: 'Legal',
      dueDate: '2024-02-01',
      assignee: 'Legal Team',
      isCompletable: documentsSignedStatus
    },
    {
      id: '3',
      title: 'Identify Care Team Members',
      description: 'Define the roles and contact information for your Chronic Care team.',
      status: getTaskStatus('3'),
      category: 'Clinical',
      dueDate: '2024-02-10',
      assignee: 'Dr. Michael Smith',
      isCompletable: isTeamConfigured
    },
    {
      id: '4',
      title: 'Setup EHR Access',
      description: 'Provide credentials or API access for the Itera platform to sync patient data.',
      status: getTaskStatus('4'),
      category: 'Technical',
      dueDate: '2024-02-15',
      assignee: 'IT Dept',
      isCompletable: !!ehrConfig
    },
    {
      id: '5',
      title: 'Schedule Clinical Training',
      description: 'Book a session for the care team to learn the Itera activation workflow.',
      status: getTaskStatus('5'),
      category: 'Training',
      dueDate: '2024-02-20',
      assignee: 'Ana Smith',
      isCompletable: !!trainingMeeting
    },
    {
      id: '6',
      title: 'Review Outreach Scripts',
      description: 'Review and approve the automated call scripts for patient enrollment.',
      status: getTaskStatus('6'),
      category: 'Training',
      dueDate: '2024-02-25',
      assignee: 'Dr. Michael Smith',
      isCompletable: !!trainingMeeting // Requires training to be scheduled (Step 5)
    }
  ];

  const onboardingTasks = [...baseOnboardingTasks, ...customTasks];

  const handleAddCustomTask = (task: Omit<OnboardingTask, 'id' | 'status'>) => {
    const newTask: OnboardingTask = {
      ...task,
      id: `custom-${Date.now()}`,
      status: 'Pending'
    };
    setCustomTasks(prev => [...prev, newTask]);
  };

  if (!isOpen) return null;

  const syncWithZoho = async (extraData: any = {}, profileOverride?: PracticeProfile, userProfileOverride?: typeof userProfile) => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);
      const activeProfile = profileOverride || providerProfile;
      const activeUserProfile = userProfileOverride || userProfile;

      // Identity Resolution: Prioritize clinical profile email, then personal profile, then signup email
      const physicianEmail = activeProfile?.physician.email || activeUserProfile.email || practiceInfo.email;
      const physicianName = activeProfile?.physician.name || activeUserProfile.name || practiceInfo.name;

      const currentStep = completedSteps.size > 0 ? Math.max(...Array.from(completedSteps) as number[]) : 0;
      const statusText = currentStep > 0 ? `Step ${currentStep} Completed` : 'Initiated';

      // Security Check: If identity changed, clear the stale contactId
      // We store the last synced email AND name to compare
      const effectiveZohoIds = { ...zohoIds };
      const hasIdentityChange =
        ((zohoIds as any).lastSyncedEmail && (zohoIds as any).lastSyncedEmail !== physicianEmail) ||
        ((zohoIds as any).lastSyncedName && (zohoIds as any).lastSyncedName !== physicianName);

      if (zohoIds.contactId && hasIdentityChange) {
        console.warn('Identity change detected (Name or Email). Clearing stale Zoho Contact ID.');
        delete effectiveZohoIds.contactId;
      }

      console.log('--- Starting Zoho Sync ---');
      const response = await fetch('/api/zoho/sync-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceName: activeProfile?.name || practiceInfo.practiceName,
          providerName: physicianName,
          providerEmail: physicianEmail,
          phone: activeProfile?.physician.phone || activeUserProfile.phone || activeProfile?.locations[0]?.phone,
          address: activeProfile?.locations[0]?.address || activeUserProfile.address,
          npi: activeProfile?.physician.npi,
          website: activeProfile?.website,
          medicarePotential: activeProfile?.medicarePotential,
          otherPotential: activeProfile?.otherPotential,
          internalId: practiceInfo.email,
          status: statusText,
          assignmentRules: enableCustomRules ? assignmentRules : [],
          // Add nested metadata for future backend use
          ...effectiveZohoIds, // Pass sanitized IDs
          healthcareData: activeProfile,
          ...extraData
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Zoho Sync Error:', responseData);
      } else {
        console.log('Zoho Sync Successful', responseData);
        // Store IDs for future updates
        if (responseData.details) {
          setZohoIds(prev => ({
            ...prev,
            ...responseData.details,
            lastSyncedEmail: physicianEmail,
            lastSyncedName: physicianName
          }));
        }
      }
    } catch (error) {
      console.error('Critical Connection Error:', error);
    } finally {
      setIsSyncing(false);
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

  const handleSaveLogCall = (id: number, outcome: string, notes: string, nextAction?: { type: 'appointment' | 'followup', date: string, time: string, careManagerId?: string }) => {
    setPatientList(prev => prev.map(p => {
      if (p.id !== id) return p;

      let status = p.status;
      let appointmentDate = p.appointmentDate;
      let nextCallDate = p.nextCallDate;

      if (status === 'Approved') status = 'Outreach - 1st Attempt';
      else if (status === 'Outreach - 1st Attempt') status = 'Outreach - 2nd Attempt';

      if (nextAction?.type === 'appointment') {
        status = 'Scheduled with CM';
        const [year, month, day] = nextAction.date.split('-').map(Number);
        const [hours, minutes] = nextAction.time.split(':').map(Number);
        appointmentDate = new Date(year, month - 1, day, hours, minutes).toISOString();
      } else if (nextAction?.type === 'followup') {
        const [year, month, day] = nextAction.date.split('-').map(Number);
        const [hours, minutes] = nextAction.time.split(':').map(Number);
        nextCallDate = new Date(year, month - 1, day, hours, minutes).toISOString();
      }

      const newLogCalls = [
        ...(p.callLogs || []),
        {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          outcome,
          notes,
          nextAction: nextAction ? `${nextAction.type} on ${nextAction.date} at ${nextAction.time}` : undefined,
          performedBy: 'Current User' // Placeholder, ideally from user context
        }
      ];

      return {
        ...p,
        status,
        appointmentDate,
        nextCallDate,
        lastCallOutcome: outcome,
        lastCallNotes: notes,
        callAttemptDate: new Date().toISOString(),
        careManager: nextAction?.type === 'appointment'
          ? (nextAction.careManagerId ? (portalUsers.find(u => u.id === nextAction.careManagerId)?.name || roles.find(r => r.id === nextAction.careManagerId)?.name || p.careManager) : (p.careManager || 'John Doe'))
          : p.careManager,
        callLogs: newLogCalls
      };
    }));
  };

  const handleSuggestPatient = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Find absolute best candidate
    const bestCandidate = patientList.find(p => {
      const isEligible = p.status === 'Approved' || p.status === 'Active';
      const isScheduledToday = p.nextCallDate?.startsWith(todayStr) || p.appointmentDate?.startsWith(todayStr);
      const wasCalledToday = p.callAttemptDate?.startsWith(todayStr);

      // We want eligible patients NOT already in today's plan
      return isEligible && !isScheduledToday && !wasCalledToday;
    });

    if (bestCandidate) {
      // Move this patient to "Today's Plan" by setting nextCallDate to today
      setPatientList(prev => prev.map(p =>
        p.id === bestCandidate.id
          ? { ...p, nextCallDate: new Date().toISOString() }
          : p
      ));
    }
  };

  const handleSchedule = (id: number, date: string, time: string) => {
    setPatientList(prev => prev.map(p => p.id === id ? {
      ...p,
      status: 'Consent Sent',
      appointmentDate: `${date}T${time}:00Z`,
      careManager: p.careManager || 'John Doe'
    } : p));
  };

  const handleAddPatient = (patient: Omit<MockPatient, 'id' | 'status'>) => {
    const newId = Math.max(...patientList.map(p => p.id), 0) + 1;
    const newPatient: MockPatient = {
      ...patient,
      id: newId,
      status: 'Pending Approval'
    };
    setPatientList(prev => [newPatient, ...prev]);
  };

  const handleAssignCareManager = (id: number, manager: string) => {
    setPatientList(prev => prev.map(p => p.id === id ? { ...p, careManager: manager } : p));
  };

  const handleAddRegisteredProvider = (provider: Omit<RegisteredProvider, 'id'>) => {
    const newId = (Math.max(...providerList.map(p => parseInt(p.id)), 0) + 1).toString();
    const newProvider: RegisteredProvider = {
      ...provider,
      id: newId
    };
    setProviderList(prev => [newProvider, ...prev]);
  };

  const handleUpdateTaskStatus = (id: string, status: OnboardingTask['status']) => {
    if (status === 'Completed') {
      const stepNum = parseInt(id);
      if (!isNaN(stepNum)) {
        setCompletedSteps(prev => new Set(prev).add(stepNum));
        if (id === '2') setDocumentsSignedStatus(true);
      } else {
        // Handle custom tasks
        setCustomTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      }
    } else {
      // Handle status updates for custom tasks (like In Progress)
      if (id.startsWith('custom-')) {
        setCustomTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      }
    }
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
            roles={teamMembers}
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
            careManagers={portalUsers.filter(u => u.role === 'Care Manager').map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone || '', // Map or fallback
              title: u.role,
              isCareManager: true,
              availability: u.availability
            }))}
            onApprove={handleApprove}
            onReject={handleReject}
            onReset={handleReset}
            onSaveLogCall={handleSaveLogCall}
            onSchedule={handleSchedule}
            onAddPatient={handleAddPatient}
            onAssignCareManager={handleAssignCareManager}
          />
        );
      case 'analytics':
        return <AnalyticsView patients={patientList} />;
      case 'documents':
        return <DocumentsView />;
      case 'team':
        return (
          <TeamSettingsView
            roles={teamMembers}
            setRoles={(newRoles) => {
              setTeamMembers(newRoles);
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
            careManagers={portalUsers.filter(u => u.role === 'Care Manager').map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone || '',
              title: u.role,
              isCareManager: true,
              availability: u.availability
            }))}
            onSaveLogCall={handleSaveLogCall}
            onSuggestPatient={handleSuggestPatient}
          />
        );
      case 'provider-profile':
        return (
          <ProviderProfileView
            initialData={providerProfile || { name: practiceInfo.practiceName }}
            onSave={(data, isFinal = true) => {
              setProviderProfile(data);
              if (isFinal) {
                setCompletedSteps(prev => {
                  const next = new Set(prev).add(1);
                  syncWithZoho({
                    status: 'Step 1 Completed (Health System Profile)'
                  }, data);
                  return next;
                });
                setActiveView('onboarding');
              } else {
                syncWithZoho({
                  status: 'Updating Health System Profile'
                }, data);
              }
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
      case 'user-profile':
        return (
          <UserProfileView
            initialData={userProfile}
            onSave={(data) => {
              const updatedProfile = { ...userProfile, ...data };
              setUserProfile(updatedProfile);
              syncWithZoho({ status: 'Updating User Personal Profile' }, undefined, updatedProfile);
              setActiveView('onboarding');
            }}
            onCancel={() => setActiveView('onboarding')}
          />
        );
      case 'responsibility-matrix':
        return <ResponsibilityMatrixView />;
      case 'outreach-scripts':
        return (
          <OutreachScriptReviewView
            onApprove={(scripts) => {
              syncWithZoho({ status: 'Step 6 Script Approved', scripts });
              handleUpdateTaskStatus('6', 'Completed');
              setActiveView('onboarding');
            }}
            onCancel={() => setActiveView('onboarding')}
            physicianName={providerProfile?.physician.name}
          />
        );
      case 'providers':
        return (
          <ProviderManagementView
            providers={providerList}
            onAddProvider={() => setIsAddingProvider(true)}
          />
        );
      case 'task-inbox':
        return (
          <TaskInboxView
            tasks={onboardingTasks}
            onUpdateStatus={handleUpdateTaskStatus}
            onNavigate={setActiveView}
            onAddTask={handleAddCustomTask}
          />
        );
      case 'campaigns':
        return <CampaignManagementView />;
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
            <NavItem view="task-inbox" icon={InboxIcon} label="Task Inbox" />
            <NavItem view="outreach" icon={HeadsetIcon} label="Daily Outreach Plan" />
            <NavItem view="patients" icon={UsersIcon} label="Patient Management" />
            <NavItem view="campaigns" icon={MegaphoneIcon} label="Campaigns" />
            <NavItem view="analytics" icon={BarChart3} label="Enrollment Analytics" />
            <NavItem view="responsibility-matrix" icon={ShieldCheckIcon} label="Responsibility Matrix" />
            <NavItem view="documents" icon={FolderIcon} label="Document Library" />
            {practiceInfo.role === 'Admin' && (
              <NavItem view="providers" icon={StethoscopeIcon} label="Registered Providers" />
            )}
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
                      <p className="text-sm font-semibold text-gray-800">{userProfile.name}</p>
                      <p className="text-xs text-gray-500">{practiceInfo.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* User Menu Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <button
                        onClick={() => {
                          setActiveView('user-profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setActiveView('provider-profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Health System Profile
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
        assignmentRules={assignmentRules}
        onRulesChange={setAssignmentRules}
        enableCustomRules={enableCustomRules}
        onEnableRulesChange={setEnableCustomRules}
        users={portalUsers}
        onUsersChange={setPortalUsers}
        roles={roles}
        onRolesChange={setRoles}
      />
      {isAddingProvider && (
        <AddProviderModal
          onClose={() => setIsAddingProvider(false)}
          onSave={handleAddRegisteredProvider}
        />
      )}
    </div>
  );
};

export default ActivationPortal;