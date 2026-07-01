/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, Service, AuditTemplate, Audit, Finding, Report, CalendarEvent, Task, Notification } from './types';

export const MOCK_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Food Safety Audit',
    description: 'Comprehensive evaluation of kitchens, storage, hygiene, and supply chain records to meet HACCP and ISO 22000 requirements.',
    status: 'Active',
    assignedCompaniesCount: 4,
    category: 'Food Industry',
    standardCode: 'ISO 22000 / HACCP'
  },
  {
    id: 'srv-2',
    name: 'Water Safety & Quality Control',
    description: 'Microbiological and chemical analysis of water supply, drainage, treatment systems, and environmental safety protocols.',
    status: 'Active',
    assignedCompaniesCount: 2,
    category: 'Environmental',
    standardCode: 'WHO GDWQ'
  },
  {
    id: 'srv-3',
    name: 'Integrated Pest Management (IPM)',
    description: 'Structural inspections, pest activity auditing, preventive action checks, and biological hazard compliance.',
    status: 'Active',
    assignedCompaniesCount: 5,
    category: 'Hygiene & Pest Control',
    standardCode: 'IPM-V1'
  },
  {
    id: 'srv-4',
    name: 'Facility Safety & Infrastructure Audit',
    description: 'Full inspection of structural integrity, fire escapes, electrical systems, emergency plans, and physical hazard reviews.',
    status: 'Active',
    assignedCompaniesCount: 6,
    category: 'Safety & Facility',
    standardCode: 'OSHA 1910'
  },
  {
    id: 'srv-5',
    name: 'Compliance Consulting & Pre-Audit Assessment',
    description: 'GAP analysis and custom consulting sessions to prepare healthcare and food factories for official certifications.',
    status: 'Active',
    assignedCompaniesCount: 3,
    category: 'Consulting',
    standardCode: 'GAP-2026'
  },
  {
    id: 'srv-6',
    name: 'Enterprise Safety Training',
    description: 'Certified courses for frontline employees on microbiological controls, hazardous material handling (HAZMAT), and emergency response.',
    status: 'Active',
    assignedCompaniesCount: 4,
    category: 'Training',
    standardCode: 'EST-H9'
  },
  {
    id: 'srv-7',
    name: 'Global Safety Certification',
    description: 'Official enterprise-wide certification showing top-tier compliance across food processing and patient hospitality standards.',
    status: 'Active',
    assignedCompaniesCount: 2,
    category: 'Certification',
    standardCode: 'AHDO-GSC'
  },
  {
    id: 'srv-8',
    name: 'Independent Process Verification',
    description: 'Unscheduled, third-party verify audits targeting cold chains, clean rooms, and surgical sterilizations.',
    status: 'Active',
    assignedCompaniesCount: 3,
    category: 'Verification',
    standardCode: 'IPV-ISO9'
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'co-1',
    name: 'Apex Bio-Pharma Group',
    industry: 'Healthcare',
    logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&fit=crop&q=80',
    status: 'Active',
    createdAt: '2024-01-15',
    assignedServices: ['srv-4', 'srv-5', 'srv-8'],
    facilities: [
      { id: 'fac-1-1', name: 'Apex Sterile Lab East', address: '450 Innovation Parkway, Bldg B', city: 'Boston', status: 'Active', lastAuditDate: '2026-05-10', safetyScore: 97 },
      { id: 'fac-1-2', name: 'Apex Logistics & Cold Store', address: '12 Logistics Way', city: 'Worcester', status: 'Under Audit', lastAuditDate: '2026-06-12', safetyScore: 84 },
      { id: 'fac-1-3', name: 'Westside Clean Room Suite', address: '88 Biotech Dr', city: 'Framingham', status: 'Active', lastAuditDate: '2025-11-20', safetyScore: 91 }
    ],
    contacts: [
      { id: 'con-1-1', name: 'Dr. Sarah Jenkins', role: 'VP of Quality Assurance', email: 's.jenkins@apexbiopharma.com', phone: '+1 (617) 555-0143', isPrimary: true },
      { id: 'con-1-2', name: 'Marcus Vance', role: 'EHS Operations Manager', email: 'm.vance@apexbiopharma.com', phone: '+1 (617) 555-0189', isPrimary: false }
    ]
  },
  {
    id: 'co-2',
    name: 'Verdant Foods Inc.',
    industry: 'Food',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&fit=crop&q=80',
    status: 'Active',
    createdAt: '2023-08-22',
    assignedServices: ['srv-1', 'srv-2', 'srv-3', 'srv-6'],
    facilities: [
      { id: 'fac-2-1', name: 'Verdant Packaging Plant 1', address: '1100 Harvest Drive', city: 'Chicago', status: 'Active', lastAuditDate: '2026-04-18', safetyScore: 94 },
      { id: 'fac-2-2', name: 'Verdant Organics Distillery', address: '400 River Road', city: 'Peoria', status: 'Active', lastAuditDate: '2026-01-14', safetyScore: 88 }
    ],
    contacts: [
      { id: 'con-2-1', name: 'Raymond Patel', role: 'Director of Food Safety', email: 'r.patel@verdantfoods.com', phone: '+1 (312) 555-8812', isPrimary: true }
    ]
  },
  {
    id: 'co-3',
    name: 'Grand Hyatt Executive Resort',
    industry: 'Hospitality',
    logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&fit=crop&q=80',
    status: 'Active',
    createdAt: '2024-03-01',
    assignedServices: ['srv-1', 'srv-3', 'srv-4'],
    facilities: [
      { id: 'fac-3-1', name: 'Main Resort Hotel & Spas', address: '1000 Coastal Highway', city: 'Miami', status: 'Active', lastAuditDate: '2026-03-12', safetyScore: 95 },
      { id: 'fac-3-2', name: 'Oceanside Kitchen & Buffet', address: '1000 Coastal Highway, Cabana Wing', city: 'Miami', status: 'Under Audit', lastAuditDate: '2026-06-28', safetyScore: 78 }
    ],
    contacts: [
      { id: 'con-3-1', name: 'Elaine Rousseau', role: 'General Manager', email: 'elaine.rousseau@hyatt-miami.com', phone: '+1 (305) 555-0990', isPrimary: true }
    ]
  },
  {
    id: 'co-4',
    name: 'Titan Heavy Manufacturing',
    industry: 'Manufacturing',
    logoUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=80&fit=crop&q=80',
    status: 'Active',
    createdAt: '2022-11-10',
    assignedServices: ['srv-4', 'srv-6'],
    facilities: [
      { id: 'fac-4-1', name: 'Titan Foundry and Die Cast', address: '888 Industrial Blvd', city: 'Detroit', status: 'Active', lastAuditDate: '2025-10-05', safetyScore: 82 },
      { id: 'fac-4-2', name: 'Titan Assembly Facility #3', address: '900 Industrial Blvd', city: 'Detroit', status: 'Active', lastAuditDate: '2026-02-14', safetyScore: 89 }
    ],
    contacts: [
      { id: 'con-4-1', name: 'Arthur Kowalski', role: 'EHS Senior Lead', email: 'a.kowalski@titan-mfg.com', phone: '+1 (313) 555-4040', isPrimary: true }
    ]
  },
  {
    id: 'co-5',
    name: 'Metro Transit Infrastructure',
    industry: 'Government',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&fit=crop&q=80',
    status: 'Pending',
    createdAt: '2026-05-30',
    assignedServices: ['srv-4', 'srv-8'],
    facilities: [
      { id: 'fac-5-1', name: 'Central Subway Depot', address: '22 Rail Terminal Plaza', city: 'New York', status: 'Active', lastAuditDate: '2025-08-11', safetyScore: 79 }
    ],
    contacts: [
      { id: 'con-5-1', name: 'Chief Inspector Gary Cole', role: 'Transit Compliance Director', email: 'gcole@mta-ny.gov', phone: '+1 (212) 555-9011', isPrimary: true }
    ]
  },
  {
    id: 'co-6',
    name: 'Sacred Heart Medical Center',
    industry: 'Healthcare',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=80&fit=crop&q=80',
    status: 'Active',
    createdAt: '2023-04-14',
    assignedServices: ['srv-2', 'srv-4', 'srv-7'],
    facilities: [
      { id: 'fac-6-1', name: 'Main Patient ICU Tower', address: '777 Medical Center Way', city: 'Seattle', status: 'Active', lastAuditDate: '2026-02-28', safetyScore: 98 },
      { id: 'fac-6-2', name: 'Outpatient Surgery Center', address: '781 Medical Center Way, Suite A', city: 'Seattle', status: 'Active', lastAuditDate: '2026-05-15', safetyScore: 95 }
    ],
    contacts: [
      { id: 'con-6-1', name: 'Dr. Helen Cho', role: 'Chief of Medical Staff', email: 'h.cho@sacredheart.org', phone: '+1 (206) 555-1234', isPrimary: true }
    ]
  },
  {
    id: 'co-7',
    name: 'Global Grain & Milling Co.',
    industry: 'Agriculture',
    logoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=80&fit=crop&q=80',
    status: 'Suspended',
    createdAt: '2022-05-20',
    assignedServices: ['srv-1', 'srv-3'],
    facilities: [
      { id: 'fac-7-1', name: 'Silo Complex Delta', address: 'Rural Route 4, Box 150', city: 'Omaha', status: 'Inactive', lastAuditDate: '2025-06-11', safetyScore: 61 }
    ],
    contacts: [
      { id: 'con-7-1', name: 'Hank Peterson', role: 'Storage Site Superintendent', email: 'h.peterson@globalgrain.com', phone: '+1 (402) 555-7890', isPrimary: true }
    ]
  }
];

export const MOCK_AUDIT_TEMPLATES: AuditTemplate[] = [
  {
    id: 'tmp-1',
    name: 'Food Kitchen Hygiene & Safety Standard',
    industry: 'Food',
    version: '4.2',
    status: 'Active',
    createdAt: '2025-01-10',
    updatedAt: '2026-05-20',
    sections: [
      {
        id: 'sec-1-1',
        title: 'Temperature & Cold Chain Integrity',
        description: 'Validation of operational cooling equipment and safety logs.',
        questions: [
          { id: 'q-1-1', text: 'Are all walk-in freezer temperatures verified below -18°C (-0.4°F)?', type: 'yes-no', required: true, weight: 5, isCritical: true, helpText: 'Freezer thermometer reading must be logged twice daily.', placeholder: '' },
          { id: 'q-1-2', text: 'Record the current temperature of the main prep refrigerator.', type: 'number', required: true, weight: 3, isCritical: false, helpText: 'Target range is 1°C to 4°C.', placeholder: '°C' },
          { id: 'q-1-3', text: 'Select the temperature logging method utilized by this facility.', type: 'dropdown', required: false, weight: 2, isCritical: false, helpText: 'How is cold chain data recorded?', options: ['Manual Logs (Paper)', 'Digital Bluetooth Sensors', 'Scanned QR Loggers', 'None / Unmonitored'] }
        ]
      },
      {
        id: 'sec-1-2',
        title: 'Hygiene & Sanitary Operations',
        description: 'Checkpoints for sanitation compliance and employee handwashing.',
        questions: [
          { id: 'q-1-4', text: 'Handwashing stations are fully stocked with soap, sanitizing solution, and hot running water (≥38°C).', type: 'pass-fail', required: true, weight: 5, isCritical: true, helpText: 'Immediate critical failure if soap or hot water is absent.', placeholder: '' },
          { id: 'q-1-5', text: 'Provide photo evidence of the primary dishwashing sanitation gauge.', type: 'photo', required: true, weight: 4, isCritical: false, helpText: 'Take close-up showing chemical concentration or heat reading.', placeholder: '' },
          { id: 'q-1-6', text: 'Are cross-contamination controls strictly enforced in food preparation zones?', type: 'yes-no', required: true, weight: 4, isCritical: true, helpText: 'Verify separate color-coded cutting boards are used.' }
        ]
      },
      {
        id: 'sec-1-3',
        title: 'Signatures & Final Declarations',
        description: 'Authorized sign-offs confirming the correctness of entries.',
        questions: [
          { id: 'q-1-7', text: 'Authorized Site representative signature and GPS stamp.', type: 'signature', required: true, weight: 1, isCritical: false, helpText: 'Draw signature below to lock inputs.' }
        ]
      }
    ]
  },
  {
    id: 'tmp-2',
    name: 'Clinical Environment & Biohazard Control',
    industry: 'Healthcare',
    version: '6.1',
    status: 'Active',
    createdAt: '2024-11-15',
    updatedAt: '2026-04-12',
    sections: [
      {
        id: 'sec-2-1',
        title: 'Surgical Sterilization & Autoclave Log',
        description: 'Audit parameters covering pressure chambers and clinical logs.',
        questions: [
          { id: 'q-2-1', text: 'Are autoclave sterilization records present for all active batches this week?', type: 'yes-no', required: true, weight: 5, isCritical: true },
          { id: 'q-2-2', text: 'Record autoclave machine chamber peak pressure reading (psi).', type: 'number', required: true, weight: 3, isCritical: false, placeholder: 'psi' }
        ]
      },
      {
        id: 'sec-2-2',
        title: 'Infectious Waste & Sharps Disposal',
        description: 'Evaluation of medical and hazardous waste processes.',
        questions: [
          { id: 'q-2-3', text: 'Red biohazard bags are sealed and stored in rigid, leak-proof containers.', type: 'pass-fail', required: true, weight: 4, isCritical: true },
          { id: 'q-2-4', text: 'Upload the monthly waste hauling compliance certificate file.', type: 'file', required: true, weight: 3, isCritical: false, helpText: 'Accepts PDF, JPG, PNG formats.' }
        ]
      }
    ]
  },
  {
    id: 'tmp-3',
    name: 'Industrial OSHA General Safety Assessment',
    industry: 'Manufacturing',
    version: '2.0',
    status: 'Draft',
    createdAt: '2026-06-01',
    updatedAt: '2026-06-15',
    sections: [
      {
        id: 'sec-3-1',
        title: 'Emergency Exits & Machine Guarding',
        questions: [
          { id: 'q-3-1', text: 'All emergency fire exits are unlocked, unobstructed, and clear from raw inventory storage.', type: 'yes-no', required: true, weight: 5, isCritical: true },
          { id: 'q-3-2', text: 'Confirm physical metal guards are safely active on the main heavy press machinery.', type: 'pass-fail', required: true, weight: 5, isCritical: true }
        ]
      }
    ]
  }
];

export const MOCK_AUDITS: Audit[] = [
  {
    id: 'aud-1',
    templateId: 'tmp-1',
    templateName: 'Food Kitchen Hygiene & Safety Standard',
    companyId: 'co-3',
    companyName: 'Grand Hyatt Executive Resort',
    facilityId: 'fac-3-2',
    facilityName: 'Oceanside Kitchen & Buffet',
    auditorName: 'Elena Rostova',
    scheduledDate: '2026-06-28',
    completedDate: '2026-06-28',
    status: 'Completed',
    progress: 100,
    score: 82,
    answers: [
      { questionId: 'q-1-1', value: 'yes', status: 'Pass', notes: 'Walk-ins reading exactly -19°C. Consistent.' },
      { questionId: 'q-1-2', value: '3.8', status: 'Conforming', notes: 'Checked with laser thermometer.' },
      { questionId: 'q-1-3', value: 'Manual Logs (Paper)', status: 'Conforming', notes: 'Using clipboards on wall.' },
      { questionId: 'q-1-4', value: 'Fail', status: 'Fail', notes: 'Sink #2 in primary pantry is out of paper towels and soap. Corrected during audit.', photos: ['Pantry Sink Deficiency'] },
      { questionId: 'q-1-5', value: 'sanitation_gauge_raw_82.jpg', status: 'Conforming', notes: 'Gauge reads 82°C on rinse loop.' },
      { questionId: 'q-1-6', value: 'yes', status: 'Pass', notes: 'Separate cutting boards are being color used correctly.' },
      { questionId: 'q-1-7', value: 'REPRESENTATIVE_SIGNATURE_STAMP', status: 'Conforming', notes: 'Signed off by Chef de Cuisine.' }
    ]
  },
  {
    id: 'aud-2',
    templateId: 'tmp-1',
    templateName: 'Food Kitchen Hygiene & Safety Standard',
    companyId: 'co-2',
    companyName: 'Verdant Foods Inc.',
    facilityId: 'fac-2-1',
    facilityName: 'Verdant Packaging Plant 1',
    auditorName: 'Elena Rostova',
    scheduledDate: '2026-06-30',
    status: 'In Progress',
    progress: 57,
    answers: [
      { questionId: 'q-1-1', value: 'yes', status: 'Pass', notes: 'Checked, freezers at -21°C.' },
      { questionId: 'q-1-2', value: '2.5', status: 'Conforming', notes: 'Thermocouple calibrated today.' },
      { questionId: 'q-1-3', value: 'Digital Bluetooth Sensors', status: 'Conforming', notes: 'Sensors linked to central SCADA.' },
      { questionId: 'q-1-4', value: 'Pass', status: 'Pass', notes: 'All 4 stations perfectly stocked.' }
    ]
  },
  {
    id: 'aud-3',
    templateId: 'tmp-2',
    templateName: 'Clinical Environment & Biohazard Control',
    companyId: 'co-1',
    companyName: 'Apex Bio-Pharma Group',
    facilityId: 'fac-1-2',
    facilityName: 'Apex Logistics & Cold Store',
    auditorName: 'David Vance',
    scheduledDate: '2026-06-30',
    status: 'Scheduled',
    progress: 0,
    answers: []
  },
  {
    id: 'aud-4',
    templateId: 'tmp-2',
    templateName: 'Clinical Environment & Biohazard Control',
    companyId: 'co-6',
    companyName: 'Sacred Heart Medical Center',
    facilityId: 'fac-6-1',
    facilityName: 'Main Patient ICU Tower',
    auditorName: 'David Vance',
    scheduledDate: '2026-05-15',
    completedDate: '2026-05-15',
    status: 'Completed',
    progress: 100,
    score: 98,
    answers: [
      { questionId: 'q-2-1', value: 'yes', status: 'Pass', notes: 'Log sheets fully complete and signed by nurse manager.' },
      { questionId: 'q-2-2', value: '31.2', status: 'Conforming', notes: 'Pressure levels nominal.' },
      { questionId: 'q-2-3', value: 'Pass', status: 'Pass', notes: 'Corrugated safety containers perfectly sealed.' },
      { questionId: 'q-2-4', value: 'hauling_permit_seattle_county.pdf', status: 'Conforming', notes: 'Document verified.' }
    ]
  }
];

export const MOCK_FINDINGS: Finding[] = [
  {
    id: 'find-1',
    auditId: 'aud-1',
    companyId: 'co-3',
    companyName: 'Grand Hyatt Executive Resort',
    facilityId: 'fac-3-2',
    facilityName: 'Oceanside Kitchen & Buffet',
    questionId: 'q-1-4',
    questionText: 'Handwashing stations are fully stocked with soap, sanitizing solution, and hot running water.',
    title: 'Unstocked Handwashing Station in Pantry Area',
    description: 'Pantry preparation sink was missing soap and paper towel roll dispenser. Re-audited and stocked, but root cause suggests lack of daily checks.',
    severity: 'High',
    responsiblePerson: 'Elaine Rousseau (GM) / Sous Chef',
    dueDate: '2026-07-05',
    status: 'In Progress'
  },
  {
    id: 'find-2',
    auditId: 'aud-1',
    companyId: 'co-3',
    companyName: 'Grand Hyatt Executive Resort',
    facilityId: 'fac-3-2',
    facilityName: 'Oceanside Kitchen & Buffet',
    questionId: 'q-1-3',
    questionText: 'Select the temperature logging method utilized by this facility.',
    title: 'Inconsistent Manual Fridge Temperature Records',
    description: 'Manual log sheets showed multiple empty entries for evening temperature shifts on consecutive weekdays.',
    severity: 'Medium',
    responsiblePerson: 'Head Chef Ramirez',
    dueDate: '2026-07-10',
    status: 'Open'
  },
  {
    id: 'find-3',
    auditId: 'aud-4',
    companyId: 'co-1',
    companyName: 'Apex Bio-Pharma Group',
    facilityId: 'fac-1-2',
    facilityName: 'Apex Logistics & Cold Store',
    questionId: 'q-2-3',
    questionText: 'Red biohazard bags are sealed and stored in rigid, leak-proof containers.',
    title: 'Corridor Biohazard Bag Exposure',
    description: 'Biohazard bags were temporarily left in a general access corridor during morning cleaner rotation rather than in secure yellow holding vaults.',
    severity: 'Critical',
    responsiblePerson: 'Marcus Vance',
    dueDate: '2026-05-18',
    status: 'Resolved'
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep-1',
    auditId: 'aud-1',
    title: 'Food Hygiene Audit - Grand Hyatt Oceanside',
    companyName: 'Grand Hyatt Executive Resort',
    facilityName: 'Oceanside Kitchen & Buffet',
    auditorName: 'Elena Rostova',
    date: '2026-06-28',
    overallScore: 82,
    compliancePercentage: 85.7,
    riskRating: 'Medium',
    recommendations: [
      'Transition temperature logs from paper clipboards to automated Bluetooth sensor modules.',
      'Establish a formal morning checklist for kitchen crew chiefs to stock all hand sinks before prep work begins.',
      'Recalibrate the hot water heating element for the primary sanitizing sink to guarantee 38°C minimum flow.'
    ],
    sectionScores: [
      { sectionId: 'sec-1-1', title: 'Temperature & Cold Chain Integrity', score: 92 },
      { sectionId: 'sec-1-2', title: 'Hygiene & Sanitary Operations', score: 71 },
      { sectionId: 'sec-1-3', title: 'Signatures & Final Declarations', score: 100 }
    ]
  },
  {
    id: 'rep-2',
    auditId: 'aud-4',
    title: 'Clinical Safety Report - ICU Tower',
    companyName: 'Sacred Heart Medical Center',
    facilityName: 'Main Patient ICU Tower',
    auditorName: 'David Vance',
    date: '2026-05-15',
    overallScore: 98,
    compliancePercentage: 100,
    riskRating: 'Low',
    recommendations: [
      'Maintain existing stellar decontamination scheduling.',
      'Ensure next month waste haul certificate is uploaded directly to the portal within 24 hours of collection.'
    ],
    sectionScores: [
      { sectionId: 'sec-2-1', title: 'Surgical Sterilization & Autoclave Log', score: 100 },
      { sectionId: 'sec-2-2', title: 'Infectious Waste & Sharps Disposal', score: 96 }
    ]
  }
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'cal-1', title: 'Food Safety Audit: Hyatt Oceanside Kitchen', date: '2026-06-28', type: 'audit', status: 'Completed', details: 'Auditor: Elena Rostova. Completed score: 82.' },
  { id: 'cal-2', title: 'On-site Consultation: Apex Sterile Lab', date: '2026-07-02', type: 'consultation', status: 'Confirmed', details: 'Preparation for upcoming ISO 17025 certification. Led by VP Quality.' },
  { id: 'cal-3', title: 'Follow-up Check: Grand Hyatt Kitchen Findings', date: '2026-07-05', type: 'follow-up', status: 'Pending', details: 'Verifying hand soap stocks and newly printed daily checklists.' },
  { id: 'cal-4', title: 'Staff Decontamination Protocol Training', date: '2026-07-09', type: 'training', status: 'Confirmed', details: 'Sacred Heart Outpatient Surgery Wing. Classroom session.' },
  { id: 'cal-5', title: 'OSHA Pre-Audit: Titan Foundry & Cast', date: '2026-07-12', type: 'audit', status: 'Pending', details: 'Inspect heavy machinery shielding and warning signage.' }
];

export const MOCK_TASKS: Task[] = [
  { id: 'tsk-1', title: 'Verify hand sink stocks', description: 'Confirm that Grand Hyatt Chef has completed and returned the initial photos of newly labeled sanitizing dispensers.', dueDate: '2026-07-03', assignedTo: 'Elena Rostova', priority: 'High', status: 'In Progress', companyId: 'co-3' },
  { id: 'tsk-2', title: 'Upload Seattle Outpatient Waste Permit', description: 'Ensure Outpatient facility coordinator provides PDF signature receipt of Seattle County waste transit.', dueDate: '2026-07-01', assignedTo: 'David Vance', priority: 'Medium', status: 'To Do', companyId: 'co-6' },
  { id: 'tsk-3', title: 'Draft Custom Water Testing Protocol', description: 'Write standard operational procedures for Apex new Worcester storage facilities.', dueDate: '2026-07-08', assignedTo: 'Chief Inspector Cole', priority: 'Low', status: 'To Do', companyId: 'co-1' },
  { id: 'tsk-4', title: 'Review Titan Foundry safety shielding logs', description: 'Audit machinery logs to make sure guards are tested daily.', dueDate: '2026-07-04', assignedTo: 'Elena Rostova', priority: 'High', status: 'Completed', companyId: 'co-4' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'not-1', title: 'Audit Completed', message: 'Food Hygiene Audit for Grand Hyatt Kitchen has been finalized with score 82/100.', time: '2 hours ago', read: false, type: 'success' },
  { id: 'not-2', title: 'Critical Finding Logged', message: 'A critical hygiene deficiency was flagged on handwashing stations at Oceanside Buffet.', time: '4 hours ago', read: false, type: 'warning' },
  { id: 'not-3', title: 'Consultation Requested', message: 'Apex Bio-Pharma requested a custom water testing consult for Worcester Site.', time: '1 day ago', read: true, type: 'info' },
  { id: 'not-4', title: 'Security Alert', message: 'Your login credentials were used on a new mobile terminal at 10:45 AM.', time: '2 days ago', read: true, type: 'alert' }
];
