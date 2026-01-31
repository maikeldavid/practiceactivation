import React, { useState } from 'react';
import { SaveIcon, CheckCircleIcon, MessageSquareIcon, PhoneCall, GlobeIcon } from '../IconComponents';

interface OutreachScriptReviewViewProps {
    onApprove: (scripts: { english: string; spanish: string; sms: string; smsSpanish: string }) => void;
    onCancel: () => void;
    physicianName?: string;
}

const generateScripts = (doctorName: string) => ({
    english: `CALL CENTER: Hello, am I speaking with [Patient's Name]? My name is [Your Name], and I'm calling from ${doctorName}'s office.

IF NOT SPEAKING TO THE PATIENT: ${doctorName} is expanding his services to provide remote monitoring of treatment plans, offering personalized support from care managers to ensure the best possible outcomes for [Patient's Name]. May I leave a message for the patient? When would be a convenient time for the patient to receive a callback?

IF SPEAKING TO THE PATIENT: I hope you’re doing well today. Please note, this call is being recorded for quality assurance purposes. ${doctorName} is introducing a new service to remotely monitor your treatment plan, ensuring that everything is progressing in the best way possible.

This attention is included as part of your treatment plan. It allows us to monitor your health status through medical-grade devices that measure your blood pressure, weight, pulse, and other vital signs. These devices are external, low complexity, and fully covered by your Medicare insurance. 

You will also be assigned a Care Manager who will regularly check in with you and report any changes or new needs directly to ${doctorName}.

With this service, ${doctorName} will gain more precise insights into how your treatment is working, allowing for quicker and more personalized adjustments if necessary.

I have a few important questions for you: Have you been receiving this type of service from any other doctors? Are you currently monitoring your blood pressure, weight, oxygen levels, or other vital signs with regular follow-ups from a care manager at another clinic? (Please select "yes" or "no" on the Go/Contact platform).

IF PATIENT RESPONDS NO: In that case, I’d like to schedule a telephone appointment with your assigned Care Manager, who can provide more details. They are available from 09:00 am to 5:00 pm, Monday through Friday. 

Thank you so much for your time! Your Care Manager will be calling you from the phone number (305) 394-8070. Please save this number in your phone so you can easily recognize it when they call. Wishing you a healthy and wonderful day!`,
    spanish: `CALL CENTER: Hola, ¿estoy hablando con [Nombre del Paciente]? Mi nombre es [Tu Nombre] y estoy llamando de la oficina del ${doctorName}.

SI NO ESTÁS HABLANDO CON EL PACIENTE: El ${doctorName} está ampliando sus servicios para ofrecer un monitoreo remoto de los planes de tratamiento, con apoyo personalizado de gestores de atención para asegurar los mejores resultados posibles para [Nombre del Paciente]. ¿Puedo dejar un mensaje para el paciente? ¿Cuándo sería un buen momento para que el paciente reciba una llamada de regreso?.

SI ESTÁS HABLANDO CON EL PACIENTE: Espero que estés bien hoy. Por favor, ten en cuenta que esta llamada está siendo grabada para fines de calidad. El ${doctorName} está introduciendo una nueva atención para monitorear remotamente tu plan de tratamiento y asegurarse de que todo esté progresando de la mejor manera posible.

Esta atención está incluida como parte de tu plan de tratamiento. Nos permite monitorear tu estado de salud a través de dispositivos de grado médico que miden tu presión arterial, peso, pulso y otros signos vitales. Estos dispositivos son externos, fáciles de usar y están completamente cubiertos por tu seguro de Medicare.

También se te asignará un Gestor de Atención que se comunicará regularmente contigo y reportará cualquier cambio o necesidad nueva directamente al ${doctorName}.

Con este servicio, el ${doctorName} obtendrá una visión más precisa de cómo está funcionando tu tratamiento, lo que permitirá hacer ajustes más rápidos y personalizados si es necesario.

Tengo algunas preguntas importantes para ti: ¿Has estado recibiendo este tipo de servicio de otros doctores? ¿Estás monitoreando actualmente tu presión arterial, peso, niveles de oxígeno u otros signos vitales con seguimientos regulares de un gestor de atención en otra clínica?.

SI EL PACIENTE RESPONDE NO: En ese caso, me gustaría programar una cita telefónica con tu Gestor de Atención asignado, quien te puede proporcionar más detalles. Están disponibles de 09:00 am a 5:00 pm, de lunes a viernes. 

¡Muchas gracias por tu tiempo! Tu Gestor de Atención te llamará desde el número de teléfono (305) 394-8070. Por favor, guarda este número en tu teléfono para que lo reconozcas fácilmente cuando te llamen. ¡Te deseo un día saludable y maravilloso!`,
    sms: `Hello! This is a message from ${doctorName} office. We’re starting a new service to to remotely monitor your treatment progress. A Care Manager will be in touch soon to explain more. Please save our number: (305) 394-8070. Stay healthy!`,
    smsSpanish: `¡Hola! Este es un mensaje de la oficina del ${doctorName}. Estamos iniciando un nuevo servicio para monitorear remotamente el progreso de tu tratamiento. Por favor, guarda nuestro número: (305) 394-8070 para nuestra próxima llamada.`
});

const OutreachScriptReviewView: React.FC<OutreachScriptReviewViewProps> = ({ onApprove, onCancel, physicianName }) => {
    const [activeTab, setActiveTab] = useState<'english' | 'spanish' | 'sms'>('english');

    // Use the physician name if provided, otherwise default to placeholder
    const doctorName = physicianName || '[Doctor Name]';
    const [scripts, setScripts] = useState(() => generateScripts(doctorName));
    const [isApproved, setIsApproved] = useState(false);

    const handleSave = () => {
        setIsApproved(true);
        onApprove(scripts);
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-24">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-itera-blue-dark">Outreach Script Approval</h2>
                    <p className="text-gray-600 mt-1">Review and customize the scripts used by our Care Team to engage your patients.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('english')}
                        className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'english' ? 'text-itera-blue border-b-2 border-itera-blue bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <GlobeIcon className="w-4 h-4" />
                        English Call Script
                    </button>
                    <button
                        onClick={() => setActiveTab('spanish')}
                        className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'spanish' ? 'text-itera-blue border-b-2 border-itera-blue bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <GlobeIcon className="w-4 h-4" />
                        Spanish Call Script
                    </button>
                    <button
                        onClick={() => setActiveTab('sms')}
                        className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'sms' ? 'text-itera-blue border-b-2 border-itera-blue bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <MessageSquareIcon className="w-4 h-4" />
                        SMS Campaign
                    </button>
                </div>

                <div className="p-6 bg-gray-50/50">
                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'english' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                                    <PhoneCall className="w-5 h-5 text-itera-blue mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-itera-blue-dark text-sm">Call Center Script (English)</h4>
                                        <p className="text-xs text-itera-blue/80 mt-1">This script will be used by Care Managers during the initial enrollment call.</p>
                                    </div>
                                </div>
                                <textarea
                                    value={scripts.english}
                                    onChange={(e) => setScripts({ ...scripts, english: e.target.value })}
                                    className="w-full h-[500px] p-6 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-itera-blue focus:border-transparent font-mono text-sm leading-relaxed resize-y"
                                />
                            </div>
                        )}

                        {activeTab === 'spanish' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                                    <PhoneCall className="w-5 h-5 text-itera-blue mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-itera-blue-dark text-sm">Call Center Script (Spanish)</h4>
                                        <p className="text-xs text-itera-blue/80 mt-1">Este guión será utilizado por los Gestores de Atención durante la llamada inicial de inscripción.</p>
                                    </div>
                                </div>
                                <textarea
                                    value={scripts.spanish}
                                    onChange={(e) => setScripts({ ...scripts, spanish: e.target.value })}
                                    className="w-full h-[500px] p-6 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-itera-blue focus:border-transparent font-mono text-sm leading-relaxed resize-y"
                                />
                            </div>
                        )}

                        {activeTab === 'sms' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block font-bold text-gray-700">English SMS</label>
                                        <textarea
                                            value={scripts.sms}
                                            onChange={(e) => setScripts({ ...scripts, sms: e.target.value })}
                                            className="w-full h-40 p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-itera-blue focus:border-transparent text-sm resize-none"
                                        />
                                        <p className="text-xs text-gray-500 text-right">{scripts.sms.length} characters</p>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block font-bold text-gray-700">Spanish SMS</label>
                                        <textarea
                                            value={scripts.smsSpanish}
                                            onChange={(e) => setScripts({ ...scripts, smsSpanish: e.target.value })}
                                            className="w-full h-40 p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-itera-blue focus:border-transparent text-sm resize-none"
                                        />
                                        <p className="text-xs text-gray-500 text-right">{scripts.smsSpanish.length} characters</p>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="bg-gray-100 p-4 rounded-2xl max-w-sm w-full border border-gray-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <MessageSquareIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs font-bold text-gray-400 uppercase">Preview</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm text-sm text-gray-800 mb-2">
                                            {scripts.sms}
                                        </div>
                                        <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm text-sm text-gray-800">
                                            {scripts.smsSpanish}
                                        </div>
                                        <div className="mt-2 text-[10px] text-gray-400 text-center">Delivered via secure HIPAA-compliant gateway</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-6 z-40 transform transition-transform duration-300 translate-y-0">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                        By approving, you authorize the Call Center to use this verbiage for patient outreach.
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-8 py-3 bg-itera-blue text-white font-bold rounded-xl shadow-lg hover:bg-itera-blue-dark transition-all active:scale-95"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            Approve Scripts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OutreachScriptReviewView;
