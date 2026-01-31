
import React, { useState, useMemo } from 'react';
import type { MockPatient } from '../../types';
import {
    DatabaseIcon,
    PhoneCall,
    UserCheckIcon,
    CalendarIcon,
    UserPlusIcon,
    TrendingUpIcon,
    UsersIcon,
    CheckCircleIcon
} from '../IconComponents';

interface DashboardViewProps {
    patients: MockPatient[];
}

// --- HELPER FUNCTIONS ---
const getWeekOfMonth = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const day = start.getDay();
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + (day === 0 ? 6 : day - 1)) / 7);
};

const getWeeksInMonth = (year: number, month: number) => {
    const lastDay = new Date(year, month, 0).getDate();
    return Math.ceil(lastDay / 7);
}

// --- SUB-COMPONENTS ---

const KpiCard: React.FC<{ title: string; value: string | number; description: string; icon: React.ComponentType<{ className?: string }> }> = ({ title, value, description, icon: Icon }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-itera-blue-dark mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-2">{description}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-itera-blue-light flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-itera-blue-dark" />
        </div>
    </div>
);

const FilterControls: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [week, setWeek] = useState(0); // 0 for all weeks

    const handleFilter = (newYear, newMonth, newWeek) => {
        setYear(newYear);
        setMonth(newMonth);
        setWeek(newWeek);
        onFilterChange({ year: newYear, month: newMonth, week: newWeek });
    };

    return (
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
            <select value={year} onChange={e => handleFilter(Number(e.target.value), month, week)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-itera-blue focus:border-itera-blue block w-full p-2">
                <option value={currentYear}>{currentYear}</option>
                <option value={currentYear - 1}>{currentYear - 1}</option>
            </select>
            <select value={month} onChange={e => handleFilter(year, Number(e.target.value), 0)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-itera-blue focus:border-itera-blue block w-full p-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>)}
            </select>
            <select value={week} onChange={e => handleFilter(year, month, Number(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-itera-blue focus:border-itera-blue block w-full p-2">
                <option value={0}>All Weeks</option>
                {Array.from({ length: getWeeksInMonth(year, month) }, (_, i) => i + 1).map(w => <option key={w} value={w}>Week {w}</option>)}
            </select>
        </div>
    );
};

const TrendChart: React.FC<{ data: any[] }> = ({ data }) => {
    // A simplified line chart component
    const width = 500, height = 200, padding = 30;
    const maxVal = Math.max(...data.flatMap(d => [d.contacted, d.scheduled])) || 10;

    const toPath = (points, color, strokeDasharray = "") => {
        if (points.length === 0) return { path: "", dots: [] };
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const dots = points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />);
        return { path, dots };
    };

    const pointsContacted = data.map((d, i) => ({
        x: padding + i * ((width - 2 * padding) / (data.length - 1 || 1)),
        y: height - padding - (d.contacted / maxVal) * (height - 2 * padding)
    }));
    const pointsScheduled = data.map((d, i) => ({
        x: padding + i * ((width - 2 * padding) / (data.length - 1 || 1)),
        y: height - padding - (d.scheduled / maxVal) * (height - 2 * padding)
    }));

    const { path: pathContacted, dots: dotsContacted } = toPath(pointsContacted, 'var(--itera-blue-default)');
    const { path: pathScheduled, dots: dotsScheduled } = toPath(pointsScheduled, 'var(--itera-orange-default)');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Y Axis */}
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e0e0e0" />
            {[...Array(5)].map((_, i) => (
                <g key={i}>
                    <line x1={padding} y1={height - padding - (i * (height - 2 * padding) / 4)} x2={width - padding} y2={height - padding - (i * (height - 2 * padding) / 4)} stroke="#f0f0f0" />
                    <text x={padding - 10} y={height - padding - (i * (height - 2 * padding) / 4) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                        {Math.round(i * maxVal / 4)}
                    </text>
                </g>
            ))}
            {/* X Axis */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e0e0e0" />
            {data.map((d, i) => (
                <text key={i} x={pointsContacted[i]?.x} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#9ca3af">
                    Wk {d.week}
                </text>
            ))}
            {/* Paths */}
            <path d={pathContacted} stroke="var(--itera-blue-default)" fill="none" strokeWidth="2" />
            <path d={pathScheduled} stroke="var(--itera-orange-default)" fill="none" strokeWidth="2" />
            {dotsContacted}
            {dotsScheduled}
        </svg>
    );
};

const PieChart: React.FC<{ data: { name: string, value: number, color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-4">
            <svg viewBox="0 0 100 100" className="w-40 h-40">
                {data.map(item => {
                    const angle = (item.value / total) * 360;
                    const endAngle = startAngle + angle;
                    const path = describeArc(50, 50, 40, startAngle, endAngle);
                    startAngle = endAngle;
                    return <path key={item.name} d={path} stroke={item.color} strokeWidth="20" fill="none" />;
                })}
            </svg>
            <div className="flex-1">
                {data.map(item => (
                    <div key={item.name} className="flex items-center justify-between py-1 text-sm">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{item.value} ({(item.value / total * 100).toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HorizontalBarChart: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.value)) || 1;
    return (
        <div className="space-y-3">
            {data.map(item => (
                <div key={item.name} className="text-sm">
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-semibold text-gray-800">{item.value} Patients</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-itera-blue h-2.5 rounded-full" style={{ width: `${(item.value / maxVal) * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---

const DashboardView: React.FC<DashboardViewProps> = ({ patients }) => {
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        week: 0,
    });

    const filteredPatients = useMemo(() => {
        return patients.filter(p => {
            const date = p.callAttemptDate ? new Date(p.callAttemptDate) : null;
            if (!date) return false;
            const yearMatch = date.getFullYear() === filters.year;
            const monthMatch = date.getMonth() + 1 === filters.month;
            const weekMatch = filters.week === 0 || getWeekOfMonth(date) === filters.week;
            return yearMatch && monthMatch && weekMatch;
        });
    }, [patients, filters]);

    const kpis = useMemo(() => {
        const totalDatabase = filteredPatients.length;
        const patientsCalled = filteredPatients.filter(p => p.callAttemptDate).length;
        const contactedPatients = filteredPatients.filter(p => p.contactedDate).length;
        const schApptWithCM = filteredPatients.filter(p => p.appointmentDate).length;
        const enrolledPatients = filteredPatients.filter(p => p.enrollmentDate).length;

        return {
            totalDatabase,
            patientsCalled,
            percentPatientsCalled: totalDatabase > 0 ? `${((patientsCalled / totalDatabase) * 100).toFixed(0)}%` : '0%',
            contactedPatients,
            percentContacted: patientsCalled > 0 ? `${((contactedPatients / patientsCalled) * 100).toFixed(0)}%` : '0%',
            schApptWithCM,
            percentSchPatients: contactedPatients > 0 ? `${((schApptWithCM / contactedPatients) * 100).toFixed(0)}%` : '0%',
            enrolledPatients,
            percentEnrolled: totalDatabase > 0 ? `${((enrolledPatients / totalDatabase) * 100).toFixed(0)}%` : '0%',
        }
    }, [filteredPatients]);

    const programDistribution = useMemo(() => {
        const enrolled = filteredPatients.filter(p => p.enrollmentDate && p.enrolledPrograms && p.enrolledPrograms.length > 0);
        return {
            ccm: enrolled.filter(p => p.enrolledPrograms.length === 1 && p.enrolledPrograms[0] === 'CCM').length,
            rpm: enrolled.filter(p => p.enrolledPrograms.length === 1 && p.enrolledPrograms[0] === 'RPM').length,
            ccmAndRpm: enrolled.filter(p => p.enrolledPrograms.length === 2).length,
        };
    }, [filteredPatients]);

    const trendChartData = useMemo(() => {
        const numWeeks = getWeeksInMonth(filters.year, filters.month);
        return Array.from({ length: numWeeks }, (_, i) => i + 1).map(week => {
            const weekPatients = filteredPatients.filter(p => p.callAttemptDate && getWeekOfMonth(new Date(p.callAttemptDate)) === week);
            return {
                week,
                contacted: weekPatients.filter(p => p.contactedDate).length,
                scheduled: weekPatients.filter(p => p.appointmentDate).length,
            };
        });
    }, [filteredPatients, filters.year, filters.month]);

    const insuranceChartData = useMemo(() => {
        const counts = filteredPatients.reduce((acc, p) => {
            if (p.insurance) acc[p.insurance] = (acc[p.insurance] || 0) + 1;
            return acc;
        }, {});
        const colors = { UHC: '#004B8D', Aetna: '#007BFF', Cigna: '#F97316', Humana: '#60A5FA', Other: '#9CA3AF' };
        return Object.entries(counts).map(([name, value]) => ({ name, value: value as number, color: colors[name] || '#ccc' }));
    }, [filteredPatients]);

    const careManagerChartData = useMemo(() => {
        const counts = filteredPatients.reduce((acc, p) => {
            if (p.careManager) acc[p.careManager] = (acc[p.careManager] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value: value as number })).sort((a, b) => b.value - a.value);
    }, [filteredPatients]);


    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-itera-blue-dark">Enrollment Dashboard</h2>
                <FilterControls onFilterChange={setFilters} />
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <KpiCard title="Total Database" value={kpis.totalDatabase} description="Total patients in period" icon={DatabaseIcon} />
                <KpiCard title="Patients Called" value={kpis.patientsCalled} description={`${kpis.percentPatientsCalled} of total`} icon={PhoneCall} />
                <KpiCard title="Contacted Patients" value={kpis.contactedPatients} description={`${kpis.percentContacted} of called`} icon={UserCheckIcon} />
                <KpiCard title="Sch Appt with CM" value={kpis.schApptWithCM} description={`${kpis.percentSchPatients} of contacted`} icon={CalendarIcon} />
                <KpiCard title="Enrolled Patients" value={kpis.enrolledPatients} description={`${kpis.percentEnrolled} of total`} icon={UserPlusIcon} />
            </div>

            {/* Program Distribution */}
            <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center justify-around gap-4 text-center">
                    <div className="font-semibold text-itera-blue-dark">Enrolled In:</div>
                    <div><span className="font-bold text-lg text-itera-blue-dark">{programDistribution.ccm}</span><span className="text-[10px] uppercase font-bold text-gray-400 ml-1">Chronic Care Management</span></div>
                    <div><span className="font-bold text-lg text-itera-blue-dark">{programDistribution.rpm}</span><span className="text-[10px] uppercase font-bold text-gray-400 ml-1">Remote Patient Monitoring</span></div>
                    <div><span className="font-bold text-lg text-itera-blue-dark">{programDistribution.ccmAndRpm}</span><span className="text-[10px] uppercase font-bold text-gray-400 ml-1">CCM & RPM</span></div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-itera-blue-dark mb-2">Weekly Trends</h3>
                    <TrendChart data={trendChartData} />
                    <div className="flex items-center justify-center gap-6 mt-2 text-sm">
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-itera-blue mr-2"></span>Contacted</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-itera-orange mr-2"></span>Scheduled</div>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-itera-blue-dark mb-4">Insurance per Patient</h3>
                        <PieChart data={insuranceChartData} />
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-itera-blue-dark mb-4">Patients per Care Manager</h3>
                        <HorizontalBarChart data={careManagerChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;