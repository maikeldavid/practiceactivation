
import React from 'react';
import {
  UsersIcon,
  DoctorIcon,
  Users2,
  HomeIcon,
  ServerIcon,
  TrendingUpIcon,
  DollarSignIcon,
  BarChart3,
  BotIcon,
  Share2Icon,
  ShieldCheckIcon,
  ActivityIcon,
  ClipboardListIcon,
  Settings,
  SparklesIcon,
  HeartPulseIcon,
  UserCheckIcon,
  CheckCircleIcon,
  ThumbsUpIcon,
  DatabaseIcon,
  BriefcaseIcon,
  MessageSquareIcon,
  StethoscopeIcon,
} from './IconComponents';

// --- Data Structures ---

interface FeatureItem {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BenefitCardProps {
  title: string;
  features: FeatureItem[];
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  headerColor: string;
  iconColor: string;
}

const BENEFIT_CARDS: BenefitCardProps[] = [
  {
    title: 'Population Health Optimization',
    position: 'top-left',
    headerColor: 'bg-blue-50 text-blue-900',
    iconColor: 'text-blue-600',
    features: [
      { text: 'Risk Stratification', icon: BarChart3 },
      { text: 'Predictive Modeling', icon: SparklesIcon },
      { text: 'Care Gap Closure', icon: ClipboardListIcon },
      { text: 'SDoH & Vulnerability Insights', icon: HomeIcon },
    ],
  },
  {
    title: 'Operational Excellence & Automation',
    position: 'bottom-left',
    headerColor: 'bg-indigo-50 text-indigo-900',
    iconColor: 'text-indigo-600',
    features: [
      { text: 'Workflow Automation', icon: Settings },
      { text: 'Care Team Coordination', icon: UsersIcon },
      { text: 'Network Management', icon: Share2Icon },
      { text: 'Interoperability at Scale', icon: ServerIcon },
    ],
  },
  {
    title: 'AI-Enabled Clinical Intelligence',
    position: 'top-right',
    headerColor: 'bg-cyan-50 text-cyan-900',
    iconColor: 'text-cyan-600',
    features: [
      { text: 'Predictive Insights', icon: BotIcon },
      { text: 'Clinical Decision Support (CDS)', icon: StethoscopeIcon || ActivityIcon },
      { text: 'Pattern & Signal Detection', icon: ActivityIcon },
      { text: 'Early Risk Identification', icon: ShieldCheckIcon },
    ],
  },
  {
    title: 'Financial & Value-Based Performance',
    position: 'bottom-right',
    headerColor: 'bg-emerald-50 text-emerald-900',
    iconColor: 'text-emerald-600',
    features: [
      { text: 'Increased Revenue', icon: DollarSignIcon },
      { text: 'Value-Based Care Performance', icon: TrendingUpIcon },
      { text: 'Quality Incentives', icon: CheckCircleIcon },
      { text: 'Patient Satisfaction', icon: ThumbsUpIcon },
    ],
  },
];

// --- Components ---

const BenefitCard: React.FC<BenefitCardProps> = ({ title, features, headerColor, iconColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    <div className={`px-5 py-4 font-bold text-[15px] md:text-base border-b border-gray-100 ${headerColor}`}>
      {title}
    </div>
    <div className="p-6 space-y-5 flex-1">
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-start gap-3 group">
          <div className={`p-1.5 rounded-md bg-gray-50 group-hover:bg-white transition-colors duration-200 shrink-0`}>
            <feature.icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <span className="text-sm text-gray-600 font-medium leading-snug pt-0.5">{feature.text}</span>
        </div>
      ))}
    </div>
  </div>
);

const CentralHub: React.FC = () => {
  // Inner Ring Items (8) - Unified Icon Color
  const innerItems = [
    { label: 'Shared Careplan Engine', icon: Share2Icon },
    { label: 'AI Super Agent (Intelligent Care Orchestration)', icon: BotIcon },
    { label: 'Workflow Automation & Tasks Orchestration', icon: Settings },
    { label: 'Remote Monitoring & PGHD', icon: ActivityIcon },
    { label: 'Quality & Value-Based Care Analytics', icon: BarChart3 },
    { label: 'FHIR-First Data & Interoperability Layer', icon: DatabaseIcon },
    { label: 'Secure Communication', icon: MessageSquareIcon },
    { label: 'Identity, Access & Permissions Layer', icon: ShieldCheckIcon },
  ];

  // Outer Ring Items (5) - Neutral Icon Color
  const outerItems = [
    { label: 'Patients', icon: UserCheckIcon },
    { label: 'Physicians', icon: DoctorIcon },
    { label: 'Care Teams', icon: Users2 },
    { label: 'Family / Caregivers', icon: HomeIcon },
    { label: 'Health Plans', icon: BriefcaseIcon },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center my-12 lg:my-0">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-50/50 rounded-full opacity-60 blur-3xl"></div>

      {/* --- Outer Ring --- */}
      <div className="absolute inset-[2%] rounded-full border-2 border-gray-100"></div>

      {outerItems.map((item, idx) => {
        const angle = (idx * 360) / outerItems.length - 90;
        const radius = 48; // %
        const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
        const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

        return (
          <div
            key={idx}
            className="absolute flex flex-col items-center justify-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-[200px] h-[68px] bg-[#F5F7FB] rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-1 z-20 hover:scale-105 transition-transform duration-300 text-center px-2">
              <item.icon className="w-5 h-5 text-gray-500 shrink-0" />
              <span className="text-xs font-bold text-gray-600 leading-tight whitespace-nowrap">{item.label}</span>
            </div>

          </div>
        );
      })}

      {/* --- Inner Ring --- */}
      <div className="absolute inset-[26%] rounded-full border-2 border-blue-100 bg-white/20 backdrop-blur-sm shadow-inner"></div>

      {innerItems.map((item, idx) => {
        const angle = (idx * 360) / innerItems.length - 90;

        // Icon Position: Just OUTSIDE the ring
        // Ring is at 26% inset, meaning it's at 24% radius from center (50 - 26 = 24).
        // To sit ON TOP (outside), we place it slightly further out.
        const iconRadius = 28;
        const iconX = 50 + iconRadius * Math.cos((angle * Math.PI) / 180);
        const iconY = 50 + iconRadius * Math.sin((angle * Math.PI) / 180);

        // Text Position: Further OUTSIDE the ring, but not too far to hit outer cards
        const textRadius = 38;
        const textX = 50 + textRadius * Math.cos((angle * Math.PI) / 180);
        const textY = 50 + textRadius * Math.sin((angle * Math.PI) / 180);

        return (
          <React.Fragment key={idx}>
            {/* Icon Circle */}
            <div
              className="absolute w-10 h-10 bg-white rounded-full border border-blue-100 shadow-sm flex items-center justify-center z-10 hover:border-blue-300 transition-colors duration-200 shrink-0"
              style={{ left: `${iconX}%`, top: `${iconY}%`, transform: 'translate(-50%, -50%)' }}
            >
              <item.icon className="w-5 h-5 text-blue-600" />
            </div>

            {/* Text Label */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: `${textX}%`, top: `${textY}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="text-[10px] font-semibold text-gray-700 leading-tight text-center max-w-[110px]">
                {item.label}
              </span>
            </div>
          </React.Fragment>
        )
      })}

      {/* --- Center Hub --- */}
      <div className="absolute inset-[36%] rounded-full bg-gradient-to-br from-blue-600 to-blue-500 shadow-xl flex flex-col items-center justify-center text-white text-center p-6 z-30 border-4 border-white ring-4 ring-blue-50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full"></div>
        <h3 className="font-bold text-base md:text-lg relative z-10 tracking-tight leading-tight">
          ITERA HEALTH
          <br />
          <span className="font-light opacity-90 text-xs md:text-sm block mt-1">Ecosystem</span>
        </h3>
      </div>

      {/* Pulse Animation */}
      {/* Pulse Animation - Multiple Waves */}
      {/* Wave 1 */}
      <div className="absolute inset-[34%] bg-blue-400/20 rounded-full animate-ping-slow pointer-events-none" style={{ animationDelay: '0s' }}></div>
      {/* Wave 2 */}
      <div className="absolute inset-[34%] bg-blue-400/20 rounded-full animate-ping-slow pointer-events-none" style={{ animationDelay: '1s' }}></div>
      {/* Wave 3 */}
      <div className="absolute inset-[34%] bg-blue-400/20 rounded-full animate-ping-slow pointer-events-none" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

const AnimatedEcosystemSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A3D91] mb-4 tracking-tight">
            How the Connected Ecosystem Drives Outcomes
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            A unified platform connecting patients, providers, and payers to deliver value-based care at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Cards */}
          <div className="lg:col-span-3 space-y-8 flex flex-col justify-center order-2 lg:order-1 h-full py-4">
            <BenefitCard {...BENEFIT_CARDS[0]} /> {/* Population Health */}
            <BenefitCard {...BENEFIT_CARDS[1]} /> {/* Operational Excellence */}
          </div>

          {/* Center Hub */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
            <CentralHub />
          </div>

          {/* Right Column Cards */}
          <div className="lg:col-span-3 space-y-8 flex flex-col justify-center order-3 lg:order-3 h-full py-4">
            <BenefitCard {...BENEFIT_CARDS[2]} /> {/* AI Intelligence */}
            <BenefitCard {...BENEFIT_CARDS[3]} /> {/* Financial Performance */}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(3); /* Increased scale to reach outer cards */
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default AnimatedEcosystemSection;