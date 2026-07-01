/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  status: 'Active' | 'Under Audit' | 'Inactive';
  lastAuditDate?: string;
  safetyScore?: number;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface Company {
  id: string;
  name: string;
  industry: 'Food' | 'Healthcare' | 'Hospitality' | 'Manufacturing' | 'Construction' | 'Government' | 'Education' | 'Agriculture';
  logoUrl?: string;
  status: 'Active' | 'Pending' | 'Suspended';
  createdAt: string;
  facilities: Facility[];
  contacts: Contact[];
  assignedServices: string[]; // Service IDs
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft' | 'Archived';
  assignedCompaniesCount: number;
  category: string;
  standardCode: string;
}

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'yes-no'
  | 'pass-fail'
  | 'checkbox'
  | 'dropdown'
  | 'radio'
  | 'date'
  | 'time'
  | 'photo'
  | 'file'
  | 'signature'
  | 'gps';

export interface AuditQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  weight: number; // For compliance calculation (e.g. 1 to 5)
  isCritical: boolean;
  helpText?: string;
  placeholder?: string;
  options?: string[]; // For dropdown/radio/checkbox
}

export interface AuditSection {
  id: string;
  title: string;
  description?: string;
  questions: AuditQuestion[];
}

export interface AuditTemplate {
  id: string;
  name: string;
  industry: string;
  version: string;
  status: 'Active' | 'Draft' | 'Archived';
  sections: AuditSection[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditAnswer {
  questionId: string;
  value: string; // "yes"/"no", "pass"/"fail", input text, signature data url, etc.
  notes?: string;
  photos?: string[]; // Mock local paths or labels
  attachments?: string[];
  status: 'Pass' | 'Fail' | 'Conforming' | 'Non-Conforming' | 'N/A' | 'Unanswered';
}

export interface Audit {
  id: string;
  templateId: string;
  templateName: string;
  companyId: string;
  companyName: string;
  facilityId: string;
  facilityName: string;
  auditorName: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Under Review' | 'Completed';
  progress: number; // Percentage
  answers: AuditAnswer[];
  score?: number; // 0-100 calculation
}

export interface Finding {
  id: string;
  auditId: string;
  companyId: string;
  companyName: string;
  facilityId: string;
  facilityName: string;
  questionId: string;
  questionText: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  responsiblePerson: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface Report {
  id: string;
  auditId: string;
  title: string;
  companyName: string;
  facilityName: string;
  auditorName: string;
  date: string;
  overallScore: number;
  compliancePercentage: number;
  riskRating: 'Low' | 'Medium' | 'High' | 'Severe';
  recommendations: string[];
  sectionScores: { sectionId: string; title: string; score: number }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'audit' | 'consultation' | 'follow-up' | 'training';
  status: 'Pending' | 'Confirmed' | 'Completed';
  details: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  companyId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
}
