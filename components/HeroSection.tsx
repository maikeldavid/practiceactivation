
import React, { useMemo } from 'react';

const BackgroundAnimation = () => {
    const elements = useMemo(() => {
        const nodes = Array.from({ length: 30 }, (_, i) => ({
            id: `n${i}`,
            cx: `${Math.random() * 100}%`,
            cy: `${Math.random() * 100}%`,
            r: `${Math.random() * 0.15 + 0.1}`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * -20}s`,
        }));

        const lines = Array.from({ length: 20 }, (_, i) => {
            const node1 = nodes[Math.floor(Math.random() * nodes.length)];
            const node2 = nodes[Math.floor(Math.random() * nodes.length)];
            return {
                id: `l${i}`,
                x1: node1.cx,
                y1: node1.cy,
                x2: node2.cx,
                y2: node2.cy,
            };
        });
        return { nodes, lines };
    }, []);

    return (
        <svg width="100%" height="100%" className="absolute inset-0 z-0">
            <g>
                {elements.lines.map(line => (
                    <line key={line.id} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="rgba(0, 75, 141, 0.1)" strokeWidth="0.5" />
                ))}
            </g>
            <g>
                {elements.nodes.map(node => (
                    <circle
                        key={node.id}
                        cx={node.cx}
                        cy={node.cy}
                        r={`${node.r}vw`}
                        fill="rgba(0, 75, 141, 0.2)"
                        style={{
                            animation: `float ${node.animationDuration} ease-in-out infinite`,
                            animationDelay: node.animationDelay,
                        }}
                    />
                ))}
            </g>
        </svg>
    );
};

interface HeroSectionProps {
  onStartActivation: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartActivation }) => {
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        const headerElement = document.querySelector('header');
        const headerOffset = headerElement ? headerElement.offsetHeight : 72;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
        window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
        });
    }
  };

  return (
    <section className="relative bg-itera-blue-light py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <BackgroundAnimation />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-itera-blue-light via-itera-blue-light/90 to-itera-blue-light/70"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-itera-blue-dark leading-tight mb-6 max-w-4xl mx-auto">
                A Connected Ecosystem for Value-Based Care
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-itera-blue-dark/90 max-w-3xl mx-auto mb-6">
                Your Practice Activation Journey Begins Here
            </h2>
            <p className="text-lg md:text-xl text-itera-blue-dark max-w-3xl mx-auto mb-10">
                ITERA HEALTH empowers medical practices with integrated digital care programs—connecting patients, physicians, and care teams to drive value-based outcomes.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
            <button
                id="startActivationBtn"
                onClick={onStartActivation}
                className="bg-itera-blue text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-itera-blue-dark transform hover:-translate-y-1 transition-all duration-300"
            >
                Start Your Activation
            </button>
            <a
                href="#how-it-works"
                onClick={(e) => handleScrollClick(e, '#how-it-works')}
                className="bg-white text-itera-blue font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 border border-itera-blue"
            >
                See How It Works
            </a>
            </div>
      </div>
    </section>
  );
};

export default HeroSection;