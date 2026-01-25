import type { MockPatient } from './types';

const randomDateBetween = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const addDays = (isoDate: string, days: number): string => {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const insurances: MockPatient['insurance'][] = ['UHC', 'Aetna', 'Cigna', 'Humana', 'Other'];
const careManagers: MockPatient['careManager'][] = ['Ana Smith', 'John Doe', 'Emily White', 'Michael Brown'];

const chronicConditionsPool = [
  'Hypertension', 'Diabetes Type 2', 'Hyperlipidemia', 'CKD Stage 3',
  'Heart Failure', 'COPD', 'Asthma', 'Arthritis', 'Obesity', 'CAD'
];

const medicationsPool = [
  'Lisinopril', 'Metformin', 'Atorvastatin', 'Amlodipine', 'Levothyroxine',
  'Furosemide', 'Metoprolol', 'Gabapentin', 'Losartan', 'Albuterol'
];

const addressesPool = [
  '45 SW 9TH STREET, Miami, FL, 33130',
  '123 Ocean Drive, Miami Beach, FL, 33139',
  '789 Brickell Ave, Miami, FL, 33131',
  '456 Coral Way, Coral Gables, FL, 33134',
  '1010 Collins Ave, Miami Beach, FL, 33139'
];

const generateOperationalData = (patient: MockPatient): MockPatient => {
  const hasData = Math.random() > 0.1;
  if (!hasData) return patient;

  const operationalPatient = { ...patient };
  operationalPatient.insurance = insurances[Math.floor(Math.random() * insurances.length)];
  operationalPatient.gender = Math.random() > 0.5 ? 'male' : 'female';
  operationalPatient.zipCode = Math.floor(10000 + Math.random() * 90000).toString();

  operationalPatient.email = `${patient.name.toLowerCase().replace(' ', '.')}@example.com`;
  operationalPatient.phone = `(786) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
  operationalPatient.address = addressesPool[Math.floor(Math.random() * addressesPool.length)];

  // Random chronic conditions (1 to 3)
  const shuffledConditions = [...chronicConditionsPool].sort(() => 0.5 - Math.random());
  operationalPatient.chronicConditions = shuffledConditions.slice(0, Math.floor(Math.random() * 3) + 1);

  // Random medications (1 to 4)
  const shuffledMeds = [...medicationsPool].sort(() => 0.5 - Math.random());
  operationalPatient.medications = shuffledMeds.slice(0, Math.floor(Math.random() * 4) + 1);

  // Bias dates towards the current month (Jan 2026) to ensure they show up in the dashboard
  const currentMonthStart = new Date('2026-01-01');
  const now = new Date();

  // 80% chance of being in the current month, 20% in the previous year
  const callAttemptDate = Math.random() > 0.2
    ? randomDateBetween(currentMonthStart, now)
    : randomDateBetween(new Date('2025-01-01'), new Date('2025-12-31'));

  operationalPatient.callAttemptDate = callAttemptDate;

  if (Math.random() > 0.3) { // 70% chance of contact
    const contactedDate = addDays(callAttemptDate, Math.floor(Math.random() * 2));
    operationalPatient.contactedDate = contactedDate;

    if (Math.random() > 0.4) { // 60% chance of appointment
      const appointmentDate = addDays(contactedDate, Math.floor(Math.random() * 5) + 1);
      operationalPatient.appointmentDate = appointmentDate;
      operationalPatient.careManager = careManagers[Math.floor(Math.random() * careManagers.length)];

      if (Math.random() > 0.25) { // 75% chance of enrollment
        const enrollmentDate = addDays(appointmentDate, Math.floor(Math.random() * 7) + 1);
        operationalPatient.enrollmentDate = enrollmentDate;

        const programs: ('CCM' | 'RPM')[] = [];
        if (patient.eligiblePrograms.includes('CCM') && Math.random() > 0.3) programs.push('CCM');
        if (patient.eligiblePrograms.includes('RPM') && Math.random() > 0.4) programs.push('RPM');
        if (programs.length === 0 && patient.eligiblePrograms.length > 0) {
          programs.push(patient.eligiblePrograms[0] as 'CCM' | 'RPM');
        }
        operationalPatient.enrolledPrograms = programs;
      }
    }
  }

  return operationalPatient;
};


export const MOCK_PATIENTS: MockPatient[] = [
  { id: 101, name: 'Eleanor Vance', dob: '1958-09-15', eligiblePrograms: ['CCM', 'RPM'], status: 'Pending Approval' },
  { id: 102, name: 'Marcus Holloway', dob: '1962-03-22', eligiblePrograms: ['CCM'], status: 'Pending Approval' },
  { id: 103, name: 'Clara Oswald', dob: '1947-11-30', eligiblePrograms: ['CCM', 'RPM', 'TCM'], status: 'Approved' },
  { id: 104, name: 'Arthur Pendelton', dob: '1955-07-02', eligiblePrograms: ['RPM'], status: 'Active' },
  { id: 105, name: 'Beatrice Miller', dob: '1960-01-19', eligiblePrograms: ['CCM', 'PCM'], status: 'Outreach - 1st Attempt' },
  { id: 106, name: 'Samuel Graves', dob: '1953-06-08', eligiblePrograms: ['CCM', 'RPM'], status: 'Active' },
  { id: 107, name: 'Penelope Cruz', dob: '1965-04-28', eligiblePrograms: ['RPM'], status: 'Consent Sent' },
  { id: 108, name: 'Richard Castle', dob: '1969-04-01', eligiblePrograms: ['TCM'], status: 'Approved' },
  { id: 109, name: 'Kate Beckett', dob: '1979-11-17', eligiblePrograms: ['APCM'], status: 'Pending Approval' },
  { id: 110, name: 'Javier Esposito', dob: '1978-08-12', eligiblePrograms: ['CCM'], status: 'Not Approved' },
  { id: 111, name: 'Kevin Ryan', dob: '1980-02-20', eligiblePrograms: ['RPM'], status: 'Device Shipped' },
  { id: 112, name: 'Lanie Parish', dob: '1975-10-05', eligiblePrograms: ['CCM'], status: 'Active' },
  { id: 113, name: 'Martha Rodgers', dob: '1945-12-25', eligiblePrograms: ['CCM', 'RPM'], status: 'Outreach - 2nd Attempt' },
  { id: 114, name: 'Alexis Castle', dob: '1996-05-18', eligiblePrograms: ['APCM'], status: 'Pending Approval' },
  { id: 115, name: 'Roy Montgomery', dob: '1963-09-09', eligiblePrograms: ['TCM'], status: 'Not Approved' },
  { id: 116, name: 'Victoria Gates', dob: '1970-07-14', eligiblePrograms: ['PCM'], status: 'Active' },
  { id: 117, name: 'Michael Smith', dob: '1952-08-21', eligiblePrograms: ['CCM', 'RPM'], status: 'Pending Approval' },
  { id: 118, name: 'Jennifer Allen', dob: '1961-12-01', eligiblePrograms: ['CCM'], status: 'Approved' },
  { id: 119, name: 'Robert Johnson', dob: '1949-03-11', eligiblePrograms: ['RPM'], status: 'Active' },
  { id: 120, name: 'Patricia Williams', dob: '1955-05-16', eligiblePrograms: ['CCM', 'PCM'], status: 'Consent Sent' },
].map(generateOperationalData);