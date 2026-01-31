
import type { MockPatient } from '../types';

export const PROGRAM_NAMES: Record<string, string> = {
    'CCM': 'Chronic Care Management',
    'RPM': 'Remote Patient Monitoring',
    'PCM': 'Principal Care Management',
    'APCM': 'Advanced Primary Care Management',
    'BHI': 'Behavioral Health Integration'
};

interface Condition {
    code: string;
    description: string;
    category?: string;
}

// Simplified ICD-10 Map based on common chronic conditions
// In a real app, this would be a database lookup
const ICD10_DB: Record<string, Condition> = {
    'I10': { code: 'I10', description: 'Essential (primary) hypertension', category: 'Hypertension' },
    'I11': { code: 'I11', description: 'Hypertensive heart disease', category: 'Hypertension' },
    'I12': { code: 'I12', description: 'Hypertensive kidney disease', category: 'Hypertension' },
    'I13': { code: 'I13', description: 'Hypertensive heart and kidney disease', category: 'Hypertension' },
    'E11': { code: 'E11', description: 'Type 2 diabetes mellitus', category: 'Diabetes' },
    'E10': { code: 'E10', description: 'Type 1 diabetes mellitus', category: 'Diabetes' },
    'J44': { code: 'J44', description: 'Other chronic obstructive pulmonary disease', category: 'COPD' },
    'J45': { code: 'J45', description: 'Asthma', category: 'Asthma' },
    'I50': { code: 'I50', description: 'Heart failure', category: 'Heart Failure' },
    'M15': { code: 'M15', description: 'Polyosteoarthritis', category: 'Arthritis' },
    'M16': { code: 'M16', description: 'Osteoarthritis of hip', category: 'Arthritis' },
    'M17': { code: 'M17', description: 'Osteoarthritis of knee', category: 'Arthritis' },
    'E78': { code: 'E78', description: 'Disorders of lipoprotein metabolism', category: 'Hyperlipidemia' },
    'N18': { code: 'N18', description: 'Chronic kidney disease (CKD)', category: 'CKD' },
    'F32': { code: 'F32', description: 'Major depressive disorder', category: 'Behavioral Health' },
    'F41': { code: 'F41', description: 'Other anxiety disorders', category: 'Behavioral Health' },
    'G30': { code: 'G30', description: 'Alzheimer disease', category: 'Dementia' },
};

interface PatientInput {
    id?: string | number;
    name: string;
    dob?: string;
    gender?: string;
    zip?: string;
    insurance?: string;
    icd10_codes: string; // Comma separated
    last_visit_date?: string; // YYYY-MM-DD
}

interface ProgramEvaluation {
    eligible: boolean;
    tooltip: string;
    evidence: string[];
    constraints: string[];
}

export interface EligibilityResult {
    patient_id: string;
    display_name: string;
    insurance: string;
    eligible_programs: {
        program: string;
        tooltip: string;
        evidence: string[];
        notes?: string[];
    }[];
    program_evaluation: {
        [key: string]: ProgramEvaluation;
    };
    conflicts: { programs_in_conflict: string[], reason: string, recommendation: string }[];
    not_eligible_reason?: string | null;
    recommended_next_steps?: string[];
    identified_conditions: string[]; // Human readable categories
    ui_status: string;
}

const lookupCondition = (codePrefix: string): Condition | null => {
    const clean = codePrefix.trim().toUpperCase();
    // Exact match
    if (ICD10_DB[clean]) return ICD10_DB[clean];
    // Prefix match
    const found = Object.keys(ICD10_DB).find(k => clean.startsWith(k));
    if (found) return ICD10_DB[found];
    return null;
};

export const evaluatePatientEligibility = (patient: PatientInput): EligibilityResult => {
    const conditions: Condition[] = [];
    const conditionCodes = patient.icd10_codes.split(',').map(c => c.trim()).filter(Boolean);

    conditionCodes.forEach(c => {
        const cond = lookupCondition(c);
        if (cond) conditions.push(cond);
        // If unknown code, we might still count it as a "condition" but without category
        else conditions.push({ code: c, description: 'Unknown Condition', category: 'Unknown' });
    });

    const uniqueCategories = new Set(conditions.map(c => c.category).filter(c => c !== 'Unknown'));
    const uniqueCodes = new Set(conditions.map(c => c.code));

    // --- Program Logic ---

    // 1. CCM (Chronic Care Management)
    // Rule: 2 or more chronic conditions expected to last 12 months
    const ccmEval: ProgramEvaluation = { eligible: false, tooltip: '', evidence: [], constraints: [] };
    if (uniqueCategories.size >= 2 || uniqueCodes.size >= 2) { // Heuristic: simplify 2 codes as potential 2 conditions
        ccmEval.eligible = true;
        const conditionList = Array.from(uniqueCategories).join(', ');
        ccmEval.tooltip = `Eligible for ${PROGRAM_NAMES['CCM']} because the patient has 2+ chronic conditions (${conditionList || 'Detected Conditions'}) expected to last ≥12 months.`;
        ccmEval.evidence = conditions.map(c => `${c.code} (${c.category || 'Condition'})`);
    } else {
        ccmEval.tooltip = 'Not eligible because Medicare eligibility criteria are not met (Requires 2+ chronic conditions).';
        ccmEval.constraints.push('Insufficient chronic conditions detected (Need 2+).');
    }

    // 2. RPM (Remote Patient Monitoring)
    // Rule: acute or chronic condition where physiologic monitoring is medically necessary
    // We infer necessity from condition types like Heart Failure, Hypertension, Diabetes, COPD
    const rpmEval: ProgramEvaluation = { eligible: false, tooltip: '', evidence: [], constraints: [] };
    const rpmEligibleCategories = ['Hypertension', 'Heart Failure', 'Diabetes', 'COPD', 'Asthma'];
    const rpmConditions = conditions.filter(c => c.category && rpmEligibleCategories.includes(c.category));

    if (rpmConditions.length > 0) {
        rpmEval.eligible = true;
        const conditionList = Array.from(new Set(rpmConditions.map(c => c.category))).join(', ');
        rpmEval.tooltip = `Eligible for ${PROGRAM_NAMES['RPM']} because the patient has a chronic condition (${conditionList}) requiring remote physiologic monitoring.`;
        rpmEval.evidence = rpmConditions.map(c => c.code);
    } else {
        rpmEval.tooltip = 'Not eligible because Medicare eligibility criteria are not met (No physiologic monitoring indication).';
        rpmEval.constraints.push('Need diagnosis like HTN, Diabetes, CHF, COPD.');
    }

    // 3. PCM (Principal Care Management)
    // Rule: 1 complex chronic condition requiring stabilization
    const pcmEval: ProgramEvaluation = { eligible: false, tooltip: '', evidence: [], constraints: [] };
    // Heuristic: If NOT eligible for CCM (only 1 condition) but has a serious one
    if (!ccmEval.eligible && uniqueCodes.size >= 1) {
        pcmEval.eligible = true;
        const conditionList = Array.from(uniqueCategories).join(', ');
        pcmEval.tooltip = `Eligible for ${PROGRAM_NAMES['PCM']} because the patient has one high-risk chronic condition (${conditionList || 'Detected Condition'}).`;
        pcmEval.evidence = conditions.map(c => c.code);
    } else if (ccmEval.eligible) {
        pcmEval.tooltip = `Eligible for ${PROGRAM_NAMES['APCM']} because the patient has multiple chronic conditions with clinical complexity (CCM criteria met).`;
        pcmEval.constraints.push('CCM is preferred over PCM for multi-condition patients.');
    } else {
        pcmEval.tooltip = 'Not eligible because Medicare eligibility criteria are not met.';
        pcmEval.constraints.push('No qualifying chronic condition found.');
    }

    // 4. BHI (Behavioral Health Integration)
    const bhiEval: ProgramEvaluation = { eligible: false, tooltip: '', evidence: [], constraints: [] };
    const bhiCategories = ['Behavioral Health', 'Dementia'];
    const bhiConditions = conditions.filter(c => c.category && bhiCategories.includes(c.category));
    if (bhiConditions.length > 0) {
        bhiEval.eligible = true;
        const conditionList = Array.from(new Set(bhiConditions.map(c => c.category))).join(', ');
        bhiEval.tooltip = `Eligible for ${PROGRAM_NAMES['BHI']} because the patient has a behavioral health condition (${conditionList}).`;
        bhiEval.evidence = bhiConditions.map(c => c.code);
    } else {
        bhiEval.tooltip = 'Not eligible because Medicare eligibility criteria are not met.';
        bhiEval.constraints.push('No behavioral health diagnosis found.');
    }

    // 5. APCM (Advanced Primary Care Management)
    const apcmEval: ProgramEvaluation = { eligible: false, tooltip: '', evidence: [], constraints: [] };
    if (uniqueCategories.size >= 2) {
        apcmEval.eligible = true;
        apcmEval.tooltip = `Eligible for ${PROGRAM_NAMES['APCM']} because the patient has multiple chronic conditions with clinical complexity.`;
        apcmEval.evidence = Array.from(uniqueCodes);
    } else {
        apcmEval.tooltip = 'Not eligible because Medicare eligibility criteria are not met.';
    }

    // --- Conflicts & Compilation ---
    const conflicts: { programs_in_conflict: string[], reason: string, recommendation: string }[] = [];

    // Conflict: PCM vs CCM
    // Medicare usually doesn't pay for both in same month for same condition logic.
    // If eligible for both (which our logic prevented, but checking safely), flag it.
    if (ccmEval.eligible && pcmEval.eligible) {
        conflicts.push({
            programs_in_conflict: ['CCM', 'PCM'],
            reason: 'Duplicate care management for chronic conditions.',
            recommendation: 'Enroll in CCM as it covers comprehensive needs.'
        });
    }

    const eligiblePrograms = [];
    const evaluations = { CCM: ccmEval, RPM: rpmEval, PCM: pcmEval, APCM: apcmEval, BHI: bhiEval };

    for (const [prog, ev] of Object.entries(evaluations)) {
        if (ev.eligible) {
            eligiblePrograms.push({
                program: prog,
                tooltip: ev.tooltip,
                evidence: ev.evidence,
                notes: ev.constraints
            });
        }
    }

    let notEligibleReason = null;
    let nextSteps: string[] = [];

    if (eligiblePrograms.length === 0) {
        notEligibleReason = 'Not eligible because Medicare eligibility criteria are not met.';
        nextSteps = ['Add/confirm active chronic diagnoses', 'Verify Medicare coverage'];
    }

    // Check for "seen within last year" requirement
    if (patient.last_visit_date) {
        const lastVisit = new Date(patient.last_visit_date);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        if (lastVisit < oneYearAgo) {
            notEligibleReason = 'Patient has not had an office visit in more than 12 months. An AWV or office visit is required for Medicare CCM eligibility.';
            nextSteps.unshift('Schedule Annual Wellness Visit (AWV)');
        }
    }

    return {
        patient_id: patient.id?.toString() || 'unknown',
        display_name: patient.name,
        insurance: patient.insurance || 'Unknown',
        eligible_programs: eligiblePrograms,
        program_evaluation: evaluations,
        conflicts: conflicts,
        not_eligible_reason: notEligibleReason,
        recommended_next_steps: nextSteps,
        identified_conditions: Array.from(uniqueCategories),
        ui_status: eligiblePrograms.length > 0 ? 'Pending Approval' : 'Not Approved'
    };
};
