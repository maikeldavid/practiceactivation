
import React, { useState } from 'react';
import { PhoneCall, CalendarIcon } from './IconComponents';

const ContactSection: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  return (
    <section id="contact" className="py-20 bg-itera-blue-dark">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">We’re Here to Help</h2>
          <p className="text-lg text-blue-200">
            Get the support you need or schedule time with our team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Contact Support */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-xl shadow-lg text-center flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <PhoneCall className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Contact Support</h3>
            <p className="text-blue-200 mb-6 flex-grow">Reach our team for immediate assistance.</p>
            
            <div className="text-left space-y-3 mb-8 text-blue-100">
                <p><strong>Phone:</strong> <a href="tel:+18005550199" className="hover:underline text-white">(800) 555-0199</a></p>
                <p><strong>Email:</strong> <a href="mailto:support@itera.health" className="hover:underline text-white">support@itera.health</a></p>
                <p><strong>Hours:</strong> Mon-Fri, 9am - 5pm EST</p>
            </div>

            <a
              href="mailto:support@itera.health"
              className="mt-auto bg-itera-orange text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-itera-orange-dark transition-colors duration-300 w-full text-center"
            >
              Send Email
            </a>
          </div>

          {/* Card 2: Schedule a Meeting */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-xl shadow-lg text-center flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Schedule a Meeting</h3>
            <p className="text-blue-200 mb-6 flex-grow">Pick a time to meet with an ITERA representative.</p>
            
            <div className="mb-8">
                <div className="flex justify-center gap-2">
                    {[15, 30, 45].map(duration => (
                        <button
                            key={duration}
                            onClick={() => setSelectedDuration(duration)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${selectedDuration === duration ? 'bg-itera-orange text-white' : 'bg-white/10 text-blue-100 hover:bg-white/20'}`}
                        >
                            {duration} min
                        </button>
                    ))}
                </div>
            </div>

            <a
              href="https://calendar.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto bg-itera-orange text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-itera-orange-dark transition-colors duration-300 w-full text-center"
            >
              Schedule a Meeting
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
