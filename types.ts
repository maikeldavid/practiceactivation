
import type { ComponentType } from 'react';

export interface Program {
  id: string;
  name: string;
  title: string;
  description: string;
  benefits: string;
  implementationTime: string;
  icon: ComponentType<{ className?: string }>;
  managedByItera: string[];
  eligibility: string[];
  billing: string[];
  connectedTo: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export interface TimelineStepDetail {
  subtitle: string;
  sections: Array<{
    title: string;
    points: string[];
    subpoints?: { [key: string]: string };
  }>;
  checklist: string[];
}

export interface TimelineStep {
  step: number;
  title: string;
  shortDescription: string;
  icon: ComponentType<{ className?: string }>;
  details: TimelineStepDetail;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  feedback?: 'like' | 'dislike' | null;
}

export type PatientStatus = 'Pending Approval' | 'Approved' | 'Outreach - 1st Attempt' | 'Outreach - 2nd Attempt' | 'Consent Sent' | 'Scheduled with CM' | 'Device Shipped' | 'Active' | 'Not Approved';

export interface MockPatient {
  id: number;
  mrn?: string; // New field for import
  providerNpi?: string; // New field for import
  lastVisitDate?: string; // ISO string or YYYY-MM-DD
  name: string;
  dob: string;
  gender?: 'male' | 'female';
  zipCode?: string;
  email?: string;
  phone?: string; // Mobile
  homePhone?: string;
  address?: string;
  medications?: string[];
  eligiblePrograms: string[];
  status: PatientStatus;
  // New operational fields for the dashboard
  insurance?: 'UHC' | 'Aetna' | 'Cigna' | 'Humana' | 'Other';
  chronicConditions?: string[];
  careManager?: 'Ana Smith' | 'John Doe' | 'Emily White' | 'Michael Brown';
  callAttemptDate?: string; // ISO string
  contactedDate?: string; // ISO string
  appointmentDate?: string; // ISO string
  enrollmentDate?: string; // ISO string
  enrolledPrograms?: ('CCM' | 'RPM')[];
  lastCallOutcome?: string;
  lastCallNotes?: string;
  nextCallDate?: string; // ISO string
  eligibilityAnalysis?: any; // To store detailed engine results
  callLogs?: CallLog[];
}

export interface CallLog {
  id: string;
  date: string; // ISO string
  outcome: string;
  notes: string;
  nextAction?: string;
  performedBy?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'file';
  fileType: 'pdf' | 'docx' | 'png' | 'txt';
  size: string;
  lastModified: string;
}

export interface Folder {
  id: string;
  name: string;
  type: 'folder';
  children: DocumentItem[];
  lastModified: string;
}

export type DocumentItem = Document | Folder;

export interface CareManagerSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface ContactInfo {
  id: string;
  title: string;
  description?: string;
  name: string;
  email: string;
  phone: string;
  isCustom?: boolean;
  officeAssignments?: string[]; // IDs of PracticeLocations
  isCareManager?: boolean;
  availability?: CareManagerSlot[];
}
export interface EHRConfig {
  ehrSystem: string;
  username: string;
  password?: string;
  loginUrl?: string;
  lastConnected?: string;
}

export interface TrainingMeeting {
  date: string;
  time: string;
  link?: string;
  status: 'scheduled' | 'pending';
}
export interface ZohoAssignmentRule {
  id: string;
  field: 'NPI' | 'Practice Name' | 'Zip Code' | 'Always';
  operator: 'equals' | 'contains' | 'starts with';
  value: string;
  assignTo: string;
}

export interface PracticeLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
}

export interface PrincipalPhysician {
  name: string;
  npi: string;
  email?: string;
  phone?: string;
  officeAssignments: string[]; // IDs of PracticeLocations
}

export interface PracticeProfile {
  name: string;
  website?: string;
  orgNPI?: string; // Type 2 NPI
  medicarePotential?: string;
  otherPotential?: string;
  locations: PracticeLocation[];
  physician: PrincipalPhysician;
  careTeamMembers: ContactInfo[];
}

export interface RegisteredProvider {
  id: string;
  name: string;
  email: string;
  practiceName: string;
  npi?: string;
  status: 'Active' | 'Pending' | 'Inactive';
  registrationDate: string;
  location?: string;
  programs?: string[];
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  category: 'Legal' | 'Clinical' | 'Technical' | 'Training';
  dueDate?: string;
  assignee?: string;
  assignedBy?: string;
  checklist?: string[];
  isCompletable?: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'call' | 'email';
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetAudience: {
    statusFilter?: PatientStatus[];
    ageRange?: { min: number; max: number };
    programFilter?: string[];
  };
  schedule?: {
    startDate: string;
    endDate?: string;
  };
  stats: {
    totalTargets: number;
    contacted: number;
    converted: number;
  };
  createdAt: string;
  createdBy: string;
}
