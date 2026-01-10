
import type { Program, FaqItem, Benefit, TimelineStep } from './types';
import {
  HeartPulseIcon,
  UsersIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  ClipboardListIcon,
  FileTextIcon,
  UserCheckIcon,
  ActivityIcon,
  BriefcaseIcon,
  Users2,
  PhoneCall,
  Laptop,
  DatabaseIcon,
  PresentationIcon,
  UserPlusIcon,
  RepeatIcon,
  DollarSignIcon,
  DoctorIcon,
} from './components/IconComponents';

export const PROGRAMS: Program[] = [
  {
    id: 'apcm',
    name: 'APCM',
    title: 'Advanced Primary Care Management',
    description: 'Comprehensive primary care coordination and quality gap closure.',
    benefits: 'Enhances patient outcomes through proactive care models.',
    implementationTime: '2-4 weeks',
    icon: StethoscopeIcon,
    managedByItera: [
      "Centralized & shared care plans",
      "Automated tasks & reminders",
      "Quality gap monitoring & closure",
      "EHR/FHIR integration for billing"
    ],
    eligibility: [
        "Patients attributed to a value-based care contract.",
        "Requires completion of an Annual Wellness Visit (AWV).",
        "Proactive identification of care gaps."
    ],
    billing: [
        "Aligns with MIPS/APM reporting requirements.",
        "Primarily billed through established E&M codes.",
        "Focus on quality measure performance for incentives."
    ],
    connectedTo: ["CCM", "RPM", "TCM"]
  },
  {
    id: 'ccm',
    name: 'CCM',
    title: 'Chronic Care Management',
    description: 'Continuous non-face-to-face care for patients with multiple chronic conditions.',
    benefits: 'Improves patient adherence and reduces hospital readmissions.',
    implementationTime: '3-5 weeks',
    icon: HeartPulseIcon,
    managedByItera: [
      "Monthly time tracking & reporting",
      "24/7 patient access to care team",
      "Systematic assessment of patient needs",
      "Comprehensive care plan management"
    ],
    eligibility: [
        "Patient has two or more chronic conditions.",
        "Conditions expected to last at least 12 months.",
        "Patient provides documented consent."
    ],
    billing: [
        "CPT® 99490 for 20 minutes of clinical staff time per month.",
        "CPT® 99439 for each additional 20 minutes.",
        "Requires a comprehensive care plan."
    ],
    connectedTo: ["RPM", "PCM", "APCM"]
  },
  {
    id: 'rpm',
    name: 'RPM',
    title: 'Remote Physiologic Monitoring',
    description: 'Monitor patient vitals like blood pressure and glucose levels outside the clinic.',
    benefits: 'Provides real-time data for timely interventions.',
    implementationTime: '4-6 weeks',
    icon: ActivityIcon,
    managedByItera: [
      "Device setup & patient education",
      "Daily monitoring of physiologic data",
      "Alert triage & escalation protocols",
      "Automated billing report generation"
    ],
    eligibility: [
        "Patient has at least one chronic condition.",
        "Monitoring must be ordered by a physician.",
        "Data must be collected for at least 16 days a month."
    ],
    billing: [
        "CPT® 99453 for device setup and patient education.",
        "CPT® 99454 for device supply with daily recordings.",
        "CPT® 99457 for the first 20 minutes of monitoring."
    ],
    connectedTo: ["CCM", "TCM", "RTM"]
  },
  {
    id: 'rtm',
    name: 'RTM',
    title: 'Remote Therapeutic Monitoring',
    description: 'Track medication adherence, response, and therapy goals.',
    benefits: 'Optimizes treatment plans based on patient-reported data.',
    implementationTime: '4-6 weeks',
    icon: Users2,
    managedByItera: [
      "Musculoskeletal & respiratory system monitoring",
      "Patient-reported data collection via app",
      "Adherence tracking and intervention",
      "Performance and progress analysis"
    ],
    eligibility: [
        "Patient has a musculoskeletal or respiratory condition.",
        "Requires patient-reported data on therapy/medication.",
        "Applicable for non-physiologic data."
    ],
    billing: [
        "CPT® 98975 for initial setup and patient education.",
        "CPT® 98977 for device supply with daily recordings.",
        "CPT® 98980 for the first 20 minutes of treatment management."
    ],
    connectedTo: ["RPM", "PCM"]
  },
  {
    id: 'pcm',
    name: 'PCM',
    title: 'Principal Care Management',
    description: 'Focused care for patients with one complex chronic condition.',
    benefits: 'Delivers specialized attention for high-risk patients.',
    implementationTime: '3-5 weeks',
    icon: UserCheckIcon,
    managedByItera: [
      "Disease-specific assessment & planning",
      "Coordination with specialist providers",
      "Intensive monitoring for a single condition",
      "Detailed progress note documentation"
    ],
    eligibility: [
        "Patient has one complex chronic condition.",
        "Condition is expected to last at least 3 months.",
        "Condition places patient at significant risk."
    ],
    billing: [
        "CPT® 99424 for the first 30 minutes by a physician.",
        "CPT® 99426 for the first 30 minutes by clinical staff.",
        "Additional time codes are available."
    ],
    connectedTo: ["CCM", "RTM"]
  },
  {
    id: 'tcm',
    name: 'TCM',
    title: 'Transitional Care Management',
    description: 'Support for patients post-discharge from hospital or skilled nursing facility.',
    benefits: 'Ensures a safe transition, reducing preventable readmissions.',
    implementationTime: '2-4 weeks',
    icon: BriefcaseIcon,
    managedByItera: [
      "Post-discharge patient outreach within 48 hours",
      "Medication reconciliation support",
      "Scheduling of timely follow-up visits",
      "Coordination of community resources"
    ],
    eligibility: [
        "Patient discharged from an inpatient setting.",
        "Communication must be made within 2 business days.",
        "Face-to-face visit within 7 or 14 days."
    ],
    billing: [
        "CPT® 99495 for moderate complexity decisions.",
        "CPT® 99496 for high complexity decisions.",
        "Billing is determined by visit timing and complexity."
    ],
    connectedTo: ["APCM", "RPM"]
  },
];

export const WHY_VBC_ITEMS = [
    { title: 'The Cost of Waiting', description: 'Delayed interventions cost outcomes and revenue.', icon: TrendingUpIcon },
    { title: 'Capturing Opportunity', description: 'Real-time data turns risks into measurable outcomes.', icon: Laptop },
    { title: 'Attracting Patients & Payers', description: 'Digital care creates trust and visibility.', icon: UsersIcon },
    { title: 'The Competitive Advantage', description: 'Adopt early, perform better, and lead in value-based care.', icon: ShieldCheckIcon },
];

export const BENEFITS: Benefit[] = [
  {
    title: 'Physicians',
    description: 'Focus on care, not paperwork.',
    icon: DoctorIcon,
  },
  {
    title: 'Care Managers',
    description: 'Guided workflows and patient engagement tools.',
    icon: ClipboardListIcon,
  },
  {
    title: 'Administrators',
    description: 'Clear visibility on billing, KPIs, and compliance.',
    icon: FileTextIcon,
  },
  {
    title: 'Patients',
    description: 'Continuous, connected, and personalized care.',
    icon: HeartPulseIcon,
  },
];

export const TIMELINE_STEPS: TimelineStep[] = [
  { 
    step: 1, 
    title: 'Collaborative Team Setup',
    shortDescription: "Coordinate workflows efficiently to enhance patient care and monitoring.",
    icon: UsersIcon,
    details: {
      subtitle: "Establish clear roles to coordinate patient care and monitoring.",
      sections: [
        {
          title: 'Key Responsibilities to Define',
          points: ['Critical and Cationary Response', 'Care Plan Adjustment', 'Medication Management', 'Appointment Management Contact', 'Billing Contact'],
          subpoints: {
            'Critical and Cationary Response': 'Addressing critical readings and providing instructions to the Care Manager',
            'Care Plan Adjustment': 'Making changes to the physician’s prescribed care plan',
            'Medication Management': 'Receiving and processing medication and refill requests',
            'Appointment Management Contact': 'Confirming appointment availability for high-risk patients and managing other critical requests',
            'Billing Contact': 'Assigning a point of contact for managing billing and claims'
          }
        },
        {
          title: 'Clinical Staff (Medical Practice)',
          points: ['Oversee care plans and adjust care as needed', 'Respond to Care Manager alerts and medication updates']
        },
        {
          title: 'Care Managers (ITERA HEALTH)',
          points: ['Monitor patients remotely, manage alerts, and document interactions', 'Coordinate with clinical staff on progress and adjustments']
        }
      ],
      checklist: ["Roles confirmed and submitted to ITERA", "Practice Champion assigned", "Communication channel defined"]
    }
  },
  { 
    step: 2, 
    title: 'EHR Access & Patient Eligibility',
    shortDescription: "Secure EHR access, validate patient data, and identify eligible patients.",
    icon: DatabaseIcon,
    details: {
      subtitle: "Integrate with your existing systems to create a unified patient view.",
      sections: [
        {
          title: 'Key Actions',
          points: ['EHR Access Setup', 'Data Validation', 'Eligibility Screening', 'Eligibility List Review'],
          subpoints: {
            'EHR Access Setup': 'Secure access for authorized users following privacy and HIPAA policies.',
            'Data Validation': 'Review and verify patient demographic and clinical data.',
            'Eligibility Screening': 'Identify patients qualified for Digital Care Management Services.',
            'Eligibility List Review': 'Review the list of eligible patients.'
          }
        },
        {
          title: 'Medical Practice Team',
          points: ['Grant authorized access to EHR system users.', 'Confirm the accuracy of patient data and eligibility information.']
        },
        {
          title: 'ITERA HEALTH Support Team',
          points: ['Validate system connections and troubleshoot data access issues.', 'Run the automated eligibility verification algorithm for all patients.']
        }
      ],
      checklist: ["EHR users confirmed", "Access verified", "Eligibility verified", "Eligible data validated"]
    }
  },
  { 
    step: 3, 
    title: 'Staff Platform Training',
    shortDescription: "Comprehensive training for your team on our platform and processes.",
    icon: PresentationIcon,
    details: {
      subtitle: "Empower your team with the knowledge and skills to use the ITERA HEALTH platform effectively.",
      sections: [
        {
          title: 'Key Modules',
          points: ['System Navigation', 'Care Plan Management', 'Alerts & Tasks', 'Reporting Basics', 'Documentation Standards'],
          subpoints: {
            'System Navigation': 'Learn the interface, menus, and quick actions.',
            'Care Plan Management': 'Create, edit, and update patient care plans.',
            'Alerts & Tasks': 'Manage clinical alerts and workflow tasks efficiently.',
            'Reporting Basics': 'Access patient and performance reports securely.',
            'Documentation Standards': 'Follow clinical documentation best practices.'
          }
        },
        {
            title: 'Medical Practice Team',
            points: ['Complete assigned platform training modules.', 'Ensure all clinical and administrative users are familiar with workflows.']
        },
        {
            title: 'ITERA HEALTH Training Support',
            points: ['Provide onboarding sessions and assist with user setup.', 'Track training progress and validate completion for all users.']
        }
      ],
      checklist: ["Platform access granted", "Training modules completed", "User setup verified"]
    }
  },
  { 
    step: 4, 
    title: 'Enroll Patient & Activation',
    shortDescription: "Complete consent, app setup, and personalized care plan activation.",
    icon: UserPlusIcon,
    details: {
      subtitle: "Seamlessly onboard patients to begin their connected care journey.",
      sections: [
        {
          title: 'Key Tasks',
          points: ['Develop Campaign and Schedule Appointments', 'Obtain Patient Consent', 'Create & Approve Care Plan', 'Device Delivery', 'Documentation'],
          subpoints: {
            'Develop Campaign and Schedule Appointments': 'ITERA Call Center contacts eligible patients and schedules Care Manager appointments.',
            'Obtain Patient Consent': 'Care Managers contact patients to explain the program and obtain consent.',
            'Create & Approve Care Plan': 'Develop individualized care plans based on patient needs and obtain physician approval before activation.',
            'Device Delivery': 'Deliver the patient’s monitoring device to their home if required.',
            'Documentation': 'Record enrollment details and link them to the patient encounter.'
          }
        },
        {
          title: 'Medical Practice Team',
          points: ['Validate patient eligibility and clinical appropriateness before activation.', 'Review and approve care plans.']
        },
        {
            title: 'ITERA HEALTH Team',
            points: ['Manage patient communication, consent process, and documentation.', 'Coordinate the delivery of the patient’s monitoring device to their home.']
        }
      ],
      checklist: ["Campaign and scheduling completed", "Patient consent obtained", "Care plan approved"]
    }
  },
  { 
    step: 5, 
    title: 'Ongoing Management',
    shortDescription: "Coordinate care, monitor vitals, and update care plans to improve outcomes.",
    icon: RepeatIcon,
    details: {
      subtitle: "Proactively manage patient care through continuous monitoring and engagement.",
      sections: [
        {
          title: 'Key Actions',
          points: [
            'Regular Patient Check-ins and Communication',
            'Care Coordination',
            'Vitals Monitoring',
            'Alert Resolution',
            'Care Plan Updates',
            'Patient Engagement'
          ],
          subpoints: {
            'Regular Patient Check-ins and Communication': 'Maintain ongoing communication with patients to support continuity of care and identify needs proactively.',
            'Care Coordination': 'Communicate regularly with patients and clinical teams.',
            'Vitals Monitoring': 'Track remote measurements and review trends.',
            'Alert Resolution': 'Respond to alerts promptly to ensure patient safety.',
            'Care Plan Updates': 'Modify goals and actions as patient conditions evolve.',
            'Patient Engagement': 'Encourage adherence through education and motivation.'
          }
        },
        {
          title: 'ITERA HEALTH Care Managers',
          points: [
            'Conduct regular follow-ups and monitor patient progress.',
            'Manage alerts and escalate clinical concerns.',
            'Support patient engagement through education and motivation.'
          ]
        },
        {
          title: 'Medical Practice Team',
          points: [
            'Review critical clinical alerts and approve care plan adjustments.',
            'Authorize patients’ medication refill and appointment requests.',
            'Collaborate with the Care Manager to ensure continuity and quality of care.'
          ]
        }
      ],
      checklist: [
        "Regular patient follow-ups",
        "Alerts reviewed and adjustments approved",
        "Care plans updated and documented",
      ]
    }
  },
  { 
    step: 6, 
    title: 'Reporting & Billing',
    shortDescription: "Performance and billing management to ensure accuracy and compliance.",
    icon: DollarSignIcon,
    details: {
      subtitle: "Ensure financial success and demonstrate value through transparent reporting.",
      sections: [
        {
          title: 'Key Processes',
          points: [
            'Performance Reporting',
            'Claims Preparation',
            'Billing Submission',
            'Reconciliation & Follow-up',
            'Compliance Documentation'
          ],
          subpoints: {
            'Performance Reporting': 'Generate monthly summaries of care, engagement, and program performance metrics.',
            'Claims Preparation': 'Review and validate time tracking, vitals, encounter notes, and patient eligibility.',
            'Billing Submission': 'Submit accurate claims to payers in compliance with CMS requirements.',
            'Reconciliation & Follow-up': 'Verify payments, address rejections, and resolve discrepancies promptly.',
            'Compliance Documentation': 'Maintain organized records to meet audit and regulatory standards.'
          }
        },
        {
          title: 'ITERA HEALTH Team',
          points: [
            'Prepare and submit validated claims.',
            'Manage payments and reconciliation.',
            'Maintain CMS and payer compliance documentation.'
          ]
        },
        {
          title: 'Medical Practice Team',
          points: [
            'Review and confirm encounter notes before submission.',
            'Provide billing support documentation as required.',
            'Collaborate with ITERA HEALTH for claim accuracy.'
          ]
        }
      ],
      checklist: [
        "Claims prepared and validated",
        "Claims submitted and payments reconciled.",
        "Compliance documentation completed"
      ]
    }
  },
];


export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How long does activation take?',
    answer:
      'Activation times vary depending on the selected programs and EHR integration complexity, but typically range from 2 to 6 weeks. Our onboarding team provides a detailed timeline after the initial assessment.',
  },
  {
    question: 'Can I start with one program and add more later?',
    answer:
      'Absolutely. Our ecosystem is designed for flexibility. You can start with the programs that best fit your current needs and easily scale by adding more services as your practice grows.',
  },
  {
    question: 'How does ITERA HEALTH integrate with my EHR?',
    answer:
      'We use industry-standard protocols like FHIR to ensure secure and seamless integration with most major EHR systems. Our technical team handles the entire connection process, minimizing disruption to your workflow.',
  },
  {
    question: 'What are the billing requirements for CCM and RPM?',
    answer:
      'We provide comprehensive guidance on CMS billing codes and documentation requirements for all our programs. Our platform includes tools to track time and activities automatically, simplifying the billing process and ensuring compliance.',
  },
  {
    question: 'Is the platform HIPAA compliant?',
    answer:
      'Yes, protecting patient data is our top priority. The ITERA HEALTH platform is fully HIPAA compliant and SOC 2 certified, employing robust security measures to safeguard all protected health information (PHI).',
  },
];
