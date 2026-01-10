import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { PROGRAMS } from '../constants';
import { PlayIcon, ChevronDown, LayersIcon, CheckedCheckboxIcon } from './IconComponents';
import type { Program } from '../types';

/** Icono de capas 100% centrado (solo para el hub) */
const CenteredLayersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

interface InfoCardProps {
  program: Program;
  isPinned: boolean;
  titleRef: React.RefObject<HTMLHeadingElement>;
  isMeasuring?: boolean;
}

/* ============ Eligibility & Billing ============ */
const EligibilityAndBilling: React.FC<{ program: Program }> = ({ program }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const toggleAccordion = (title: string) => setOpenAccordion(openAccordion === title ? null : title);

  const AccordionItem: React.FC<{ title: string; items: string[]; icon: React.ComponentType<{ className?: string }> }> = ({
    title,
    items,
    icon: Icon,
  }) => {
    const isOpen = openAccordion === title;
    return (
      <div className="border-b border-gray-200 last:border-b-0 py-3">
        <button
          onClick={() => toggleAccordion(title)}
          className="w-full flex justify-between items-center text-left"
          aria-expanded={isOpen}
        >
          <span className="font-semibold text-itera-blue-dark">{title}</span>
          <ChevronDown
            className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} w-5 h-5 text-gray-500`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-screen mt-2' : 'max-h-0'
          }`}
        >
          <ul className="space-y-2 pt-2">
            {items.map((point, index) => (
              <li key={index} className="flex items-start text-sm">
                <Icon className="w-4 h-4 text-itera-blue mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-itera-blue-dark mb-1 lg:mb-3">
        Eligibility & Billing Requirements
      </h4>

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-x-6">
        <div>
          <h5 className="font-semibold text-gray-700 text-sm mb-2">Eligibility</h5>
          <ul className="space-y-1.5">
            {program.eligibility.map((point, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckedCheckboxIcon className="w-4 h-4 text-itera-blue mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-gray-700 text-sm mb-2">Billing Requirements</h5>
          <ul className="space-y-1.5">
            {program.billing.map((point, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckedCheckboxIcon className="w-4 h-4 text-itera-blue mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden border-t border-gray-200 mt-2">
        <AccordionItem title="Eligibility" items={program.eligibility} icon={CheckedCheckboxIcon} />
        <AccordionItem title="Billing Requirements" items={program.billing} icon={CheckedCheckboxIcon} />
      </div>
    </div>
  );
};

/* ============ Info Card ============ */
const InfoCard: React.FC<InfoCardProps> = ({
  program,
  isPinned,
  titleRef,
  isMeasuring = false,
}) => {
  return (
    <div
      className="relative w-full h-full bg-white border border-gray-200 rounded-2xl shadow-xl p-6 lg:p-8"
      role="region"
      aria-live="polite"
    >
      <div>
        <div key={program.id} className={!isMeasuring ? 'animate-fade-in-up' : ''}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-itera-blue-light rounded-lg flex items-center justify-center mr-4">
                <program.icon className="w-7 h-7 text-itera-blue-dark" />
              </div>
              <div>
                <p className="font-bold text-itera-blue text-sm">{program.name}</p>
                <h3
                  ref={titleRef}
                  tabIndex={-1}
                  className="text-xl font-bold text-itera-blue-dark focus:outline-none"
                >
                  {program.title}
                </h3>
              </div>
            </div>
            {isPinned && (
              <span className="bg-itera-blue-dark text-white text-xs font-bold px-3 py-1 rounded-full">
                Selected
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {program.description}
          </p>

          <h4 className="font-semibold text-itera-blue-dark mb-3">
            Managed by ITERA HEALTH Platform:
          </h4>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
            {program.managedByItera.map((point, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckedCheckboxIcon className="w-4 h-4 text-itera-blue mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>

          <EligibilityAndBilling program={program} />

          {program.connectedTo.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-itera-blue-dark mb-2 text-sm">
                Connected to:
              </h4>
              <div className="flex flex-wrap gap-2">
                {program.connectedTo.map((progName) => (
                  <span
                    key={progName}
                    className="bg-itera-blue-light text-itera-blue-dark text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {progName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============ Ecosystem Section ============ */
const EcosystemSection: React.FC = () => {
  const [activeProgramId, setActiveProgramId] = useState<string>(PROGRAMS[0].id);
  const [isPaused, setIsPaused] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const infoCardWrapperRef = useRef<HTMLDivElement>(null);
  const measurementWrapperRef = useRef<HTMLDivElement>(null);

  const [orbitRadius, setOrbitRadius] = useState(200);
  const [maxCardHeight, setMaxCardHeight] = useState<number | null>(null);

  /* Radio de la órbita: usa SIEMPRE la dimensión limitante para evitar deformación */
  useLayoutEffect(() => {
    const calculateRadius = () => {
      if (!infoCardWrapperRef.current || !animationContainerRef.current) return;

      const isStacked = window.innerWidth < 1024;
      const availableHeight = isStacked
        ? animationContainerRef.current.offsetHeight
        : infoCardWrapperRef.current.offsetHeight;
      const availableWidth = animationContainerRef.current.offsetWidth;

      const limitingDimension = Math.min(availableHeight, availableWidth);
      const buffer = 40;
      const newRadius = limitingDimension / 2 - buffer;

      // Mantenemos un mínimo razonable para que no se deforme en xs
      setOrbitRadius(Math.max(140, newRadius));
    };

    calculateRadius();

    const ro = new ResizeObserver(calculateRadius);
    if (infoCardWrapperRef.current) ro.observe(infoCardWrapperRef.current);
    if (animationContainerRef.current) ro.observe(animationContainerRef.current);
    window.addEventListener('resize', calculateRadius);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calculateRadius);
    };
  }, []);

  /* Altura máxima de la tarjeta (columna derecha) */
  useLayoutEffect(() => {
    const calculateMaxHeight = () => {
      if (window.innerWidth < 1024) {
        setMaxCardHeight(null);
        return;
      }
      if (!measurementWrapperRef.current || !infoCardWrapperRef.current) return;

      let maxHeight = 0;
      const measurementNodes = Array.from(measurementWrapperRef.current.children);
      measurementNodes.forEach((node) => {
        const wrapper = node as HTMLDivElement;
        wrapper.style.width = `${infoCardWrapperRef.current!.offsetWidth}px`;
        maxHeight = Math.max(maxHeight, wrapper.offsetHeight);
      });
      if (maxHeight > 0) setMaxCardHeight(maxHeight);
    };

    calculateMaxHeight();
    const ro = new ResizeObserver(calculateMaxHeight);
    if (infoCardWrapperRef.current) ro.observe(infoCardWrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const activeProgram = useMemo(
    () => PROGRAMS.find((p) => p.id === activeProgramId) || PROGRAMS[0],
    [activeProgramId]
  );
  const programsCount = PROGRAMS.length;

  const programPositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    PROGRAMS.forEach((program, index) => {
      const angle = (index / programsCount) * 2 * Math.PI;
      const x = orbitRadius + orbitRadius * Math.cos(angle);
      const y = orbitRadius + orbitRadius * Math.sin(angle);
      positions.set(program.id, { x, y });
    });
    return positions;
  }, [orbitRadius, programsCount]);

  const activeProgramPosition = programPositions.get(activeProgram.id);

  /* Autoplay */
  useEffect(() => {
    if (isPaused || isPinned) return;
    const autoplay = setInterval(() => {
      setActiveProgramId((currentId) => {
        const i = PROGRAMS.findIndex((p) => p.id === currentId);
        return PROGRAMS[(i + 1) % PROGRAMS.length].id;
      });
    }, 5000);
    return () => clearInterval(autoplay);
  }, [isPaused, isPinned]);

  /* Auto-resume */
  useEffect(() => {
    if (!isPinned) return;
    const t = setTimeout(() => {
      setIsPaused(false);
      setIsPinned(false);
    }, 6000);
    return () => clearTimeout(t);
  }, [isPinned]);

  const handleProgramClick = (id: string) => {
    setActiveProgramId(id);
    setIsPaused(true);
    setIsPinned(true);
    setTimeout(() => titleRef.current?.focus(), 150);
  };
  const handleResume = () => {
    setIsPaused(false);
    setIsPinned(false);
  };

  return (
    <>
      {/* medidor invisible para la altura de la tarjeta */}
      <div
        ref={measurementWrapperRef}
        style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden', pointerEvents: 'none', zIndex: -1 }}
        aria-hidden="true"
      >
        {PROGRAMS.map((program) => (
          <div key={program.id}>
            <InfoCard program={program} isPinned={false} titleRef={{ current: null }} isMeasuring />
          </div>
        ))}
      </div>

      <section id="ecosystem" className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-itera-blue-dark mb-4">
              One Platform. Every Program. Connected.
            </h2>
            <p className="text-lg text-gray-600">
              Whether you focus on primary care, chronic disease management, or transitional care, the ITERA HEALTH
              ecosystem connects all programs into one seamless digital infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center lg:items-stretch">
            {/* Left: Orbit */}
            <div
              ref={animationContainerRef}
              className="min-h-[420px] md:min-h-[520px] lg:min-h-0 flex items-center justify-center"
            >
              <div
                className="relative grid place-items-center"
                style={{
                  width: `${orbitRadius * 2}px`,
                  height: `${orbitRadius * 2}px`,
                }}
                onMouseEnter={() => !isPinned && setIsPaused(true)}
                onMouseLeave={() => !isPinned && setIsPaused(false)}
              >
                {/* Hub: círculo perfecto con icono centrado y texto abajo */}
                <div
                  className="
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
                    aspect-square w-[14rem] md:w-[18rem]
                    bg-white rounded-full
                    shadow-[0_30px_80px_-25px_rgba(0,123,255,0.35)]
                    border-8 border-itera-blue-light
                    overflow-hidden
                  "
                  aria-label="ITERA Platform hub"
                >
                  {/* anillo interior */}
                  <div className="absolute inset-4 rounded-full border-2 border-itera-blue/10 pointer-events-none" />

                  {/* Botón de reanudar */}
                  {isPinned && (
                    <button
                      onClick={handleResume}
                      className="absolute z-30 top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-itera-blue text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform animate-fade-in-up"
                      aria-label="Resume animation"
                    >
                      <PlayIcon className="w-7 h-7" />
                    </button>
                  )}

                  {/* icono centrado matemáticamente */}
                  <CenteredLayersIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 text-itera-blue pointer-events-none" />

                  {/* texto pegado al borde inferior, no afecta al icono */}
                  <h3 className="absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-7 font-extrabold text-base md:text-lg tracking-wide text-itera-blue-dark leading-none text-center select-none">
                    ITERA Platform
                  </h3>
                </div>

                {/* Conexiones cuando está fijo */}
                <svg className="absolute top-0 left-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%">
                      <stop offset="0%" stopColor="#007BFF" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#E6F2FB" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <g key={activeProgram.id}>
                    {isPinned &&
                      activeProgramPosition &&
                      activeProgram.connectedTo.map((connectedName) => {
                        const connectedProgram = PROGRAMS.find((p) => p.name === connectedName);
                        if (!connectedProgram) return null;
                        const connectedPosition = programPositions.get(connectedProgram.id);
                        if (!connectedPosition) return null;
                        return (
                          <path
                            key={`${activeProgram.id}-${connectedProgram.id}`}
                            d={`M ${activeProgramPosition.x} ${activeProgramPosition.y} Q ${orbitRadius} ${orbitRadius} ${connectedPosition.x} ${connectedPosition.y}`}
                            stroke="url(#lineGradient)"
                            strokeWidth="2.5"
                            fill="none"
                            className="connection-line"
                          />
                        );
                      })}
                  </g>
                </svg>

                {/* Ítems en órbita – el tamaño concuerda con los offsets para quedar centrados */}
                <div className={`w-full h-full orbiting-container ${isPaused ? 'paused' : ''}`}>
                  {PROGRAMS.map((program, index) => {
                    const angle = (index / programsCount) * 2 * Math.PI;
                    const isActive = activeProgramId === program.id;
                    const isRelated = isPinned && (isActive || activeProgram.connectedTo.includes(program.name));
                    const itemClass = isPinned && !isRelated ? 'unconnected-dimmed' : '';

                    return (
                      <div
                        key={program.id}
                        className={`absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12 ${
                          isActive && !isPinned ? 'active' : ''
                        } ${itemClass}`}
                        style={{
                          transform: `translate(calc(cos(${angle}rad) * ${orbitRadius}px), calc(sin(${angle}rad) * ${orbitRadius}px))`,
                        }}
                      >
                        <button
                          onClick={() => handleProgramClick(program.id)}
                          className={`w-full h-full rounded-full flex flex-col items-center justify-center text-center group counter-rotating-content ${isPaused ? 'paused' : ''}`}
                        >
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md border-2 transition-all duration-300 ${
                              isActive && isPinned
                                ? 'bg-itera-blue border-white scale-110'
                                : 'bg-white border-itera-blue-light group-hover:bg-itera-blue-light group-hover:scale-105'
                            }`}
                          >
                            <program.icon
                              className={`w-8 h-8 transition-colors duration-300 ${
                                isActive && isPinned ? 'text-white' : 'text-itera-blue-dark'
                              }`}
                            />
                          </div>
                          <span
                            className={`mt-2 text-xs font-semibold transition-colors duration-300 ${
                              isActive && isPinned ? 'text-itera-blue-dark' : 'text-gray-500'
                            }`}
                          >
                            {program.name}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Info Card */}
            <div
              ref={infoCardWrapperRef}
              className="w-full"
              style={{ minHeight: maxCardHeight ? `${maxCardHeight}px` : 'auto' }}
            >
              <InfoCard program={activeProgram} isPinned={isPinned} titleRef={titleRef} />
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="#activation"
              className="bg-itera-blue text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors duration-300"
            >
              Select the Programs You Want to Activate
            </a>
          </div>
        </div>
      </section>

      {/* estilos locales mínimos */}
      <style>{`
        @keyframes orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes counter-orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }
        .orbiting-container {
            animation: orbit 40s linear infinite;
        }
        .counter-rotating-content {
            animation: counter-orbit 40s linear infinite;
        }
        .paused {
            animation-play-state: paused !important;
        }
        .unconnected-dimmed {
            opacity: 0.5;
            filter: grayscale(80%);
            transition: opacity 0.3s, filter 0.3s;
        }
        @keyframes fade-in-up {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up .35s ease-out both; }
        .connection-line { opacity: .8 }
      `}</style>
    </>
  );
};

export default EcosystemSection;