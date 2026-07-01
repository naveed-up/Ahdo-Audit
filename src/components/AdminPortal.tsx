/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertTriangle,
  X,
  Play,
  Save,
  Check,
  Building2,
  Mail,
  Phone,
  Settings as SettingsIcon,
  ChevronDown,
  Calendar as CalendarIcon,
  Download,
  AlertOctagon,
  FileText,
  Clock,
  Briefcase,
  User,
  MapPin,
  Camera,
  Activity,
  Award
} from 'lucide-react';
import {
  Company,
  Service,
  AuditTemplate,
  Audit,
  Finding,
  Report,
  CalendarEvent,
  Task,
  AuditAnswer,
  AuditQuestion,
  AuditSection,
  QuestionType,
  ScoringRule,
  ApprovalFlow,
  ApprovalHistory,
  WorkflowStage,
  ActivityLog
} from '../types';

interface AdminPortalProps {
  adminTab: string;
  setAdminTab: (tab: string) => void;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  templates: AuditTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<AuditTemplate[]>>;
  audits: Audit[];
  setAudits: React.Dispatch<React.SetStateAction<Audit[]>>;
  findings: Finding[];
  setFindings: React.Dispatch<React.SetStateAction<Finding[]>>;
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  globalSearchQuery: string;
}

export default function AdminPortal({
  adminTab,
  setAdminTab,
  companies,
  setCompanies,
  services,
  setServices,
  templates,
  setTemplates,
  audits,
  setAudits,
  findings,
  setFindings,
  reports,
  setReports,
  calendarEvents,
  setCalendarEvents,
  tasks,
  setTasks,
  globalSearchQuery
}: AdminPortalProps) {

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- COMPANIES MODULE STATE ---
  const [companySearch, setCompanySearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Healthcare' as Company['industry'],
    facilityName: '',
    facilityAddress: '',
    facilityCity: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    assignedServices: [] as string[]
  });

  // --- SERVICES MODULE STATE ---
  const [showCreateService, setShowCreateService] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'Safety & Quality',
    standardCode: 'ISO Standard'
  });

  // --- TEMPLATE BUILDER STATE ---
  const [selectedTemplate, setSelectedTemplate] = useState<AuditTemplate | null>(templates[0]);
  const [activeSectionId, setActiveSectionId] = useState<string>(templates[0]?.sections[0]?.id || '');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // --- AUDIT EXECUTION STATE ---
  const [activeExecutionAudit, setActiveExecutionAudit] = useState<Audit | null>(null);
  const [activeExecSectionIdx, setActiveExecSectionIdx] = useState(0);

  // --- FINDINGS STATE ---
  const [severityFilter, setSeverityFilter] = useState('All');

  // --- REPORTS STATE ---
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // --- TASKS STATE ---
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // --- CALENDAR VIEW ---
  const [selectedCalendarFilter, setSelectedCalendarFilter] = useState<'All' | 'audit' | 'consultation' | 'training'>('All');

  // --- SETTINGS STATE ---
  const [settingsForm, setSettingsForm] = useState({
    profileName: 'Naveed Jawaid',
    profileEmail: 'naveedjawaid92@gmail.com',
    orgName: 'AHDO Advanced Systems',
    enableNotifications: true,
    alertThreshold: 'High'
  });

  // --- ENTERPRISE MODULES STATE ---
  const [templateSubTab, setTemplateSubTab] = useState<'checklist' | 'scoring' | 'approval'>('checklist');
  const [selectedAuditForDetails, setSelectedAuditForDetails] = useState<Audit | null>(null);

  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [approvalFlows, setApprovalFlows] = useState<ApprovalFlow[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [editingScoringRule, setEditingScoringRule] = useState<ScoringRule | null>(null);
  const [editingApprovalFlow, setEditingApprovalFlow] = useState<ApprovalFlow | null>(null);

  const [approvalComment, setApprovalComment] = useState('');
  const [approverRole, setApproverRole] = useState('Audit Manager');

  // Synchronize DB state on mount and when updates occur
  const fetchDBState = async () => {
    try {
      const res = await fetch('/api/db-state');
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success') {
          const {
            scoringRules: bScoringRules,
            approvalFlows: bApprovalFlows,
            approvalHistory: bApprovalHistory,
            workflowStages: bWorkflowStages,
            activityLogs: bActivityLogs,
            audits: bAudits,
            templates: bTemplates,
            reports: bReports,
            findings: bFindings
          } = json.data;

          setScoringRules(bScoringRules || []);
          setApprovalFlows(bApprovalFlows || []);
          setApprovalHistory(bApprovalHistory || []);
          setWorkflowStages(bWorkflowStages || []);
          setActivityLogs(bActivityLogs || []);
          
          if (bAudits && setAudits) setAudits(bAudits);
          if (bTemplates && setTemplates) setTemplates(bTemplates);
          if (bReports && setReports) setReports(bReports);
          if (bFindings && setFindings) setFindings(bFindings);
        }
      }
    } catch (err) {
      console.warn('Backend sync offline, operating in simulated local mode:', err);
    }
  };

  React.useEffect(() => {
    fetchDBState();
  }, []);

  React.useEffect(() => {
    if (activeBuilderTemplate) {
      const rule = scoringRules.find(r => r.templateId === activeBuilderTemplate.id);
      if (rule) {
        setEditingScoringRule(rule);
      } else {
        const weightedSections = activeBuilderTemplate.sections.map(sec => ({
          sectionId: sec.id,
          sectionTitle: sec.title,
          weight: Math.round(100 / activeBuilderTemplate.sections.length)
        }));
        setEditingScoringRule({
          id: 'rule-' + activeBuilderTemplate.id,
          templateId: activeBuilderTemplate.id,
          scoringMethod: 'Percentage',
          complianceThreshold: 80,
          criticalFailureEnabled: true,
          weightedSections,
          riskLevels: {
            low: { label: 'Low Risk', threshold: 85, color: 'Green' },
            medium: { label: 'Medium Risk', threshold: 70, color: 'Yellow' },
            high: { label: 'High Risk', threshold: 50, color: 'Orange' },
            critical: { label: 'Critical Risk', threshold: 0, color: 'Red' }
          }
        });
      }

      const flow = approvalFlows.find(f => f.templateId === activeBuilderTemplate.id);
      if (flow) {
        setEditingApprovalFlow(flow);
      } else {
        setEditingApprovalFlow({
          id: 'flow-' + activeBuilderTemplate.id,
          templateId: activeBuilderTemplate.id,
          steps: [
            { role: 'Auditor', order: 1, approvalRequired: true, commentRequired: true, notificationRequired: true },
            { role: 'Audit Manager', order: 2, approvalRequired: true, commentRequired: true, notificationRequired: true },
            { role: 'Operations Manager', order: 3, approvalRequired: true, commentRequired: true, notificationRequired: true },
            { role: 'Client Representative', order: 4, approvalRequired: true, commentRequired: false, notificationRequired: true }
          ]
        });
      }
    }
  }, [selectedTemplate, scoringRules, approvalFlows]);

  const handleSaveScoringRule = async () => {
    if (!editingScoringRule) return;

    if (editingScoringRule.scoringMethod === 'Weighted') {
      const totalWeight = editingScoringRule.weightedSections.reduce((acc, curr) => acc + curr.weight, 0);
      if (totalWeight !== 100) {
        showToast(`Weight total must equal 100%. Current total: ${totalWeight}%`, 'error');
        return;
      }
    }

    try {
      const res = await fetch('/api/scoring-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingScoringRule)
      });
      if (res.ok) {
        showToast('Scoring rules successfully saved to Audit Engine.', 'success');
        fetchDBState();
      } else {
        showToast('Error saving scoring rules to engine.', 'error');
      }
    } catch (err) {
      showToast('Offline mode simulation saved.', 'success');
    }
  };

  const handleSaveApprovalFlow = async () => {
    if (!editingApprovalFlow) return;

    try {
      const res = await fetch('/api/approval-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingApprovalFlow)
      });
      if (res.ok) {
        showToast('Approval workflow rules saved successfully.', 'success');
        fetchDBState();
      } else {
        showToast('Error saving approval workflow.', 'error');
      }
    } catch (err) {
      showToast('Offline mode simulation saved.', 'success');
    }
  };

  const handleWorkflowAdvance = async (auditId: string) => {
    try {
      const res = await fetch('/api/workflow/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          operator: 'Elena Rostova',
          comments: 'Workflow advanced by QA team checkpoint checklist verification.'
        })
      });
      if (res.ok) {
        const json = await res.json();
        showToast(`Audit workflow advanced to: ${json.currentStage}`, 'success');
        fetchDBState();
        if (selectedAuditForDetails && selectedAuditForDetails.id === auditId) {
          setSelectedAuditForDetails(prev => prev ? { ...prev, status: json.auditStatus } : null);
        }
      }
    } catch (err) {
      showToast('Workflow transition simulated.', 'success');
    }
  };

  const handleWorkflowRevert = async (auditId: string) => {
    try {
      const res = await fetch('/api/workflow/back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          operator: 'Elena Rostova',
          comments: 'Workflow rolled back to previous stage by operator request.'
        })
      });
      if (res.ok) {
        const json = await res.json();
        showToast(`Audit workflow reverted to: ${json.currentStage}`, 'info');
        fetchDBState();
        if (selectedAuditForDetails && selectedAuditForDetails.id === auditId) {
          setSelectedAuditForDetails(prev => prev ? { ...prev, status: json.auditStatus } : null);
        }
      }
    } catch (err) {
      showToast('Workflow rollback simulated.', 'info');
    }
  };

  const handleApproveStep = async (auditId: string) => {
    try {
      const res = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          role: approverRole,
          comments: approvalComment || 'Complies with all guidelines.',
          operator: 'Operations Board Administrator'
        })
      });
      if (res.ok) {
        const json = await res.json();
        showToast(`Approval Step signed off successfully by ${approverRole}`, 'success');
        setApprovalComment('');
        fetchDBState();
      } else {
        const json = await res.json();
        showToast(json.error || 'Approval step failed.', 'error');
      }
    } catch (err) {
      showToast('Approval level cleared locally.', 'success');
    }
  };

  const handleRejectStep = async (auditId: string) => {
    if (!approvalComment) {
      showToast('Rejection reasons/comments must be documented.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          role: approverRole,
          comments: approvalComment,
          operator: 'Operations Board Administrator'
        })
      });
      if (res.ok) {
        showToast(`Audit rejected at ${approverRole} level. Status rolled back to In Progress.`, 'info');
        setApprovalComment('');
        fetchDBState();
      } else {
        const json = await res.json();
        showToast(json.error || 'Rejection action failed.', 'error');
      }
    } catch (err) {
      showToast('Audit returned to In Progress state.', 'info');
    }
  };

  const handleTriggerScoreRecalculation = async (auditId: string) => {
    try {
      const res = await fetch('/api/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId })
      });
      if (res.ok) {
        const json = await res.json();
        showToast(`Scoring Engine calculation successful. Score: ${json.score}%`, 'success');
        fetchDBState();
      }
    } catch (err) {
      showToast('Calculations complete.', 'success');
    }
  };

  // Filter lists based on Search & Query
  const filteredCompanies = companies.filter(co => {
    const query = (globalSearchQuery || companySearch).toLowerCase();
    const matchSearch = co.name.toLowerCase().includes(query) || co.facilities.some(f => f.name.toLowerCase().includes(query));
    const matchIndustry = industryFilter === 'All' || co.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  const activeBuilderTemplate = templates.find(t => t.id === selectedTemplate?.id) || templates[0];

  // --- HANDLERS ---
  const handleAddCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.facilityName) return;

    const created: Company = {
      id: `co-${companies.length + 1}`,
      name: newCompany.name,
      industry: newCompany.industry,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      facilities: [
        {
          id: `fac-${companies.length + 1}-1`,
          name: newCompany.facilityName,
          address: newCompany.facilityAddress,
          city: newCompany.facilityCity,
          status: 'Active',
          safetyScore: 100
        }
      ],
      contacts: [
        {
          id: `con-${companies.length + 1}-1`,
          name: newCompany.contactName,
          role: 'EHS Manager',
          email: newCompany.contactEmail,
          phone: newCompany.contactPhone,
          isPrimary: true
        }
      ],
      assignedServices: newCompany.assignedServices
    };

    setCompanies([...companies, created]);
    setShowCreateCompany(false);
    setNewCompany({
      name: '',
      industry: 'Healthcare',
      facilityName: '',
      facilityAddress: '',
      facilityCity: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      assignedServices: []
    });
    showToast(`Company '${created.name}' registered successfully!`);
  };

  const handleCreateServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name) return;

    const created: Service = {
      id: `srv-${services.length + 1}`,
      name: newService.name,
      description: newService.description,
      status: 'Active',
      assignedCompaniesCount: 0,
      category: newService.category,
      standardCode: newService.standardCode
    };

    setServices([...services, created]);
    setShowCreateService(false);
    setNewService({ name: '', description: '', category: 'Safety & Quality', standardCode: 'ISO Standard' });
    showToast(`Service '${created.name}' added to catalogue.`);
  };

  const handleAddSectionToTemplate = () => {
    if (!newSectionTitle || !activeBuilderTemplate) return;
    const newSection: AuditSection = {
      id: `sec-added-${Date.now()}`,
      title: newSectionTitle,
      questions: []
    };

    const updated = templates.map(t => {
      if (t.id === activeBuilderTemplate.id) {
        return {
          ...t,
          sections: [...t.sections, newSection],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    });

    setTemplates(updated);
    setNewSectionTitle('');
    setActiveSectionId(newSection.id);
    showToast(`Section '${newSectionTitle}' added to template.`);
  };

  const handleAddQuestionToSection = (type: QuestionType) => {
    if (!activeBuilderTemplate || !activeSectionId) return;

    const newQuestion: AuditQuestion = {
      id: `q-added-${Date.now()}`,
      text: 'New Safety Parameter Checklist Item',
      type,
      required: true,
      weight: 3,
      isCritical: false,
      helpText: '',
      placeholder: '',
      options: type === 'dropdown' || type === 'radio' ? ['Pass', 'Fail', 'Incomplete'] : undefined
    };

    const updated = templates.map(t => {
      if (t.id === activeBuilderTemplate.id) {
        return {
          ...t,
          sections: t.sections.map(s => {
            if (s.id === activeSectionId) {
              return { ...s, questions: [...s.questions, newQuestion] };
            }
            return s;
          }),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    });

    setTemplates(updated);
    setSelectedQuestionId(newQuestion.id);
    showToast('Question inserted. Custom parameters can be edited on the right.');
  };

  const handleQuestionPropChange = (qId: string, updates: Partial<AuditQuestion>) => {
    if (!activeBuilderTemplate) return;
    const updated = templates.map(t => {
      if (t.id === activeBuilderTemplate.id) {
        return {
          ...t,
          sections: t.sections.map(s => {
            return {
              ...s,
              questions: s.questions.map(q => {
                if (q.id === qId) {
                  return { ...q, ...updates };
                }
                return q;
              })
            };
          })
        };
      }
      return t;
    });
    setTemplates(updated);
  };

  const handleSaveTemplateSettings = () => {
    showToast('Template parameters secured and synchronized.', 'success');
  };

  // --- AUDIT EXECUTION ENGINE ---
  const handleLaunchAudit = (audit: Audit) => {
    // Populate default values if empty
    const template = templates.find(t => t.id === audit.templateId);
    let populatedAnswers = [...audit.answers];

    if (template && populatedAnswers.length === 0) {
      template.sections.forEach(s => {
        s.questions.forEach(q => {
          populatedAnswers.push({
            questionId: q.id,
            value: '',
            status: 'Unanswered'
          });
        });
      });
    }

    const activeAudit: Audit = {
      ...audit,
      status: 'In Progress',
      answers: populatedAnswers
    };

    // Update in global audits
    setAudits(audits.map(a => a.id === audit.id ? activeAudit : a));
    setActiveExecutionAudit(activeAudit);
    setActiveExecSectionIdx(0);
    setAdminTab('audits');
  };

  const handleAnswerChange = (questionId: string, value: string, notes?: string, status: AuditAnswer['status'] = 'Conforming') => {
    if (!activeExecutionAudit) return;

    const updatedAnswers = activeExecutionAudit.answers.map(ans => {
      if (ans.questionId === questionId) {
        return {
          ...ans,
          value,
          notes: notes !== undefined ? notes : ans.notes,
          status
        };
      }
      return ans;
    });

    // Calculate dynamic progress
    const answeredCount = updatedAnswers.filter(a => a.value !== '').length;
    const totalQuestions = updatedAnswers.length;
    const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

    const updatedAudit: Audit = {
      ...activeExecutionAudit,
      answers: updatedAnswers,
      progress
    };

    setActiveExecutionAudit(updatedAudit);
    setAudits(audits.map(a => a.id === activeExecutionAudit.id ? updatedAudit : a));
  };

  const handleSubmitAuditForm = () => {
    if (!activeExecutionAudit) return;

    // Recalculate Mock Score (e.g. random high score but reflecting failures)
    const criticalFailure = activeExecutionAudit.answers.some(a => a.status === 'Fail');
    const safetyScore = criticalFailure ? 68 : 94;

    const completedAudit: Audit = {
      ...activeExecutionAudit,
      status: 'Completed',
      progress: 100,
      score: safetyScore,
      completedDate: new Date().toISOString().split('T')[0]
    };

    // Auto create non-compliance findings if any questions were flagged as Fail
    const newFindings: Finding[] = [];
    activeExecutionAudit.answers.forEach((ans, idx) => {
      if (ans.status === 'Fail') {
        newFindings.push({
          id: `find-auto-${Date.now()}-${idx}`,
          auditId: completedAudit.id,
          companyId: completedAudit.companyId,
          companyName: completedAudit.companyName,
          facilityId: completedAudit.facilityId,
          facilityName: completedAudit.facilityName,
          questionId: ans.questionId,
          questionText: 'Automatic hazard identification from audit parameter',
          title: `Deficiency detected during inspection: ${ans.value || 'Unstocked Sink/Fault'}`,
          description: ans.notes || 'No description notes logged by inspector.',
          severity: 'High',
          responsiblePerson: 'EHS Site Coordinator',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Open'
        });
      }
    });

    // Auto create diagnostic Report
    const newReport: Report = {
      id: `rep-auto-${Date.now()}`,
      auditId: completedAudit.id,
      title: `${completedAudit.templateName} - ${completedAudit.facilityName}`,
      companyName: completedAudit.companyName,
      facilityName: completedAudit.facilityName,
      auditorName: completedAudit.auditorName,
      date: completedAudit.completedDate || '',
      overallScore: safetyScore,
      compliancePercentage: safetyScore,
      riskRating: safetyScore > 90 ? 'Low' : safetyScore > 80 ? 'Medium' : 'High',
      recommendations: [
        'Review recent automatic compliance findings within 48 hours.',
        'Conduct a supplemental training review with EHS field managers.'
      ],
      sectionScores: [
        { sectionId: 'sec-1', title: 'Main Parameters', score: safetyScore }
      ]
    };

    setAudits(audits.map(a => a.id === activeExecutionAudit.id ? completedAudit : a));
    setFindings([...findings, ...newFindings]);
    setReports([...reports, newReport]);
    setActiveExecutionAudit(null);
    showToast(`Audit completed successfully! Score: ${safetyScore}/100. Generated report and ${newFindings.length} findings.`);
    setAdminTab('reports');
    setActiveReport(newReport);
  };

  const handleResolveFinding = (id: string) => {
    setFindings(findings.map(f => f.id === id ? { ...f, status: 'Resolved' } : f));
    showToast('Corrective action item marked as Resolved.');
  };

  const handleDownloadPdf = (repTitle: string) => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      showToast(`Export complete: ${repTitle}.pdf successfully downloaded to device.`);
    }, 2000);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const created: Task = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: 'Naveed Jawaid',
      priority: 'Medium',
      status: 'To Do'
    };

    setTasks([...tasks, created]);
    setNewTaskTitle('');
    showToast('Task added to operational log.');
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full transition-colors">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3.5 text-xs font-semibold text-white shadow-2xl border border-slate-800 dark:bg-zinc-900 dark:border-zinc-800 animate-slide-up">
          {toast.type === 'success' && <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />}
          {toast.type === 'info' && <Clock className="h-4.5 w-4.5 text-sky-400" />}
          {toast.type === 'error' && <AlertOctagon className="h-4.5 w-4.5 text-rose-400" />}
          {toast.message}
        </div>
      )}

      {/* ====================================================
          DASHBOARD VIEW
          ==================================================== */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: 'Companies', val: companies.length, color: 'text-blue-600' },
              { label: 'Total Audits', val: audits.length, color: 'text-violet-600' },
              { label: 'Pending', val: audits.filter(a => a.status !== 'Completed').length, color: 'text-amber-600' },
              { label: 'Completed', val: audits.filter(a => a.status === 'Completed').length, color: 'text-emerald-600' },
              { label: 'Today Visits', val: 1, color: 'text-rose-500' },
              { label: 'Open Findings', val: findings.filter(f => f.status !== 'Resolved').length, color: 'text-rose-600' },
              { label: 'Reports', val: reports.length, color: 'text-indigo-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <p className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider leading-none">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold mt-2.5 leading-none ${stat.color} dark:text-zinc-100`}>
                  {stat.val}
                </p>
              </div>
            ))}
          </div>

          {/* Core Interactive Charts Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Monthly Audits Trend (Custom SVG Chart) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Inspection Throughput (Monthly)
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Total executed compliance checks, Jan - Jun</p>
              
              <div className="h-56 w-full flex flex-col justify-between mt-6">
                <div className="flex-1 flex items-end justify-between gap-3 px-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
                  {[
                    { month: 'Jan', val: 14, h: '40%' },
                    { month: 'Feb', val: 19, h: '55%' },
                    { month: 'Mar', val: 24, h: '70%' },
                    { month: 'Apr', val: 18, h: '50%' },
                    { month: 'May', val: 28, h: '82%' },
                    { month: 'Jun', val: 32, h: '95%' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                      <div className="absolute -top-7 bg-slate-900 text-white rounded text-[9px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                        {item.val} audits
                      </div>
                      <div className="w-full bg-blue-100 group-hover:bg-blue-600 dark:bg-blue-950 dark:group-hover:bg-blue-900 rounded-t transition-all" style={{ height: item.h }} />
                      <span className="text-[9px] font-mono font-bold text-slate-400 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Compliance Trend Score (Custom Interactive Line-graph) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Average Compliance Index
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Historical facility safety rating trends</p>

              <div className="h-56 w-full flex flex-col justify-end mt-6">
                <svg viewBox="0 0 300 120" className="w-full flex-1 overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-zinc-800" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-zinc-800" />
                  <line x1="0" y1="100" x2="300" y2="100" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-zinc-800" />
                  
                  {/* Score Path */}
                  <path
                    d="M 10,100 L 60,85 L 110,65 L 160,80 L 210,40 L 260,35"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Dots with popovers */}
                  {[
                    { cx: 10, cy: 100, val: '71%' },
                    { cx: 60, cy: 85, val: '76%' },
                    { cx: 110, cy: 65, val: '82%' },
                    { cx: 160, cy: 80, val: '78%' },
                    { cx: 210, cy: 40, val: '91%' },
                    { cx: 260, cy: 35, val: '94%' }
                  ].map((pt, i) => (
                    <g key={i} className="group cursor-pointer">
                      <circle cx={pt.cx} cy={pt.cy} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                      <circle cx={pt.cx} cy={pt.cy} r="8" fill="#2563eb" fillOpacity="0" className="hover:fill-opacity-10 transition-colors" />
                    </g>
                  ))}
                </svg>
                <div className="flex justify-between px-2 text-[9px] font-mono text-slate-400 mt-2 border-t border-slate-100 pt-2 dark:border-zinc-800">
                  <span>Q1 2025</span>
                  <span>Q2 2025</span>
                  <span>Q3 2025</span>
                  <span>Q4 2025</span>
                  <span>Q1 2026</span>
                  <span>Q2 2026</span>
                </div>
              </div>
            </div>

            {/* Chart 3: Risk Distribution (Donut representation) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                EHS Risk Distribution
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Distribution of current facility findings</p>

              <div className="h-56 flex flex-col justify-center items-center mt-6">
                <div className="flex items-center gap-8">
                  {/* SVG Donut */}
                  <svg className="h-28 w-28 -rotate-90">
                     <circle cx="56" cy="56" r="40" stroke="#f1f5f9" strokeWidth="12" fill="transparent" className="dark:stroke-zinc-800" />
                     {/* Critical portion */}
                     <circle cx="56" cy="56" r="40" stroke="#f43f5e" strokeWidth="12" fill="transparent" strokeDasharray="251.2" strokeDashoffset="180" />
                     {/* High portion */}
                     <circle cx="56" cy="56" r="40" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="251.2" strokeDashoffset="210" />
                     {/* Medium portion */}
                     <circle cx="56" cy="56" r="40" stroke="#2563eb" strokeWidth="12" fill="transparent" strokeDasharray="251.2" strokeDashoffset="240" />
                  </svg>
                  
                  {/* Legend */}
                  <div className="space-y-2 text-[10px] font-semibold text-slate-600 dark:text-zinc-400">
                    <p className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-rose-500" /> Critical (1)</p>
                    <p className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500" /> High Priority (1)</p>
                    <p className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-blue-500" /> Medium (1)</p>
                    <p className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Low Risk (0)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Activities, Visits & Tasks Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Panel 1: Recent Activities */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
                Recent Operations Feed
              </h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {audits.map(aud => (
                  <div key={aud.id} className="flex gap-3 text-xs">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      <Briefcase className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {aud.companyName}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">
                        {aud.facilityName} • Status: <span className="font-semibold text-blue-600">{aud.status}</span>
                      </p>
                      <span className="text-[9px] text-slate-400 dark:text-zinc-600">
                        Scheduled: {aud.scheduledDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Scheduled Inspector Visits */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
                Upcoming Inspections
              </h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {calendarEvents.slice(0, 4).map(evt => (
                  <div key={evt.id} className="flex gap-3 text-xs items-center justify-between p-2 hover:bg-slate-50 rounded dark:hover:bg-zinc-800/40">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white leading-none">{evt.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1.5">{evt.details}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase bg-blue-50 px-2 py-1 rounded dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
                      {evt.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Urgent Actions / Quick Tasks */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
                Operational Task Checkpoints
              </h3>
              
              <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Record rapid check..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
                <button type="submit" className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors">
                  Add
                </button>
              </form>

              <div className="space-y-3 max-h-52 overflow-y-auto">
                {tasks.map(tsk => (
                  <label key={tsk.id} className="flex gap-2.5 text-xs items-center select-none cursor-pointer p-1.5 hover:bg-slate-50 rounded dark:hover:bg-zinc-800/40">
                    <input
                      type="checkbox"
                      checked={tsk.status === 'Completed'}
                      onChange={() => {
                        setTasks(tasks.map(t => t.id === tsk.id ? { ...t, status: t.status === 'Completed' ? 'To Do' : 'Completed' } : t));
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold ${tsk.status === 'Completed' ? 'line-through text-slate-400 dark:text-zinc-600' : 'text-slate-800 dark:text-zinc-200'}`}>
                        {tsk.title}
                      </p>
                      <p className="text-[9px] text-slate-500 dark:text-zinc-500">Due: {tsk.dueDate} • Assigned: {tsk.assignedTo}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}


      {/* ====================================================
          COMPANIES MODULE
          ==================================================== */}
      {adminTab === 'companies' && (
        <div className="space-y-6">
          
          {selectedCompany ? (
            /* --- Company Detail Sub-view --- */
            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex justify-between items-start border-b border-gray-50 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{selectedCompany.name}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-500 mt-0.5">Industry Sector: <span className="font-semibold text-sky-600">{selectedCompany.industry}</span> • Created on {selectedCompany.createdAt}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="rounded-lg border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 px-3 py-1.5 dark:border-zinc-800 dark:hover:bg-zinc-800"
                >
                  Back to Register
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Column 1: Facilities List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operational Facilities ({selectedCompany.facilities.length})</h4>
                  <div className="space-y-2">
                    {selectedCompany.facilities.map(fac => (
                      <div key={fac.id} className="p-3.5 border border-gray-50 rounded-xl bg-gray-50/50 dark:bg-zinc-950 dark:border-zinc-800/80">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{fac.name}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded ${
                            fac.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}>{fac.status}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1">{fac.address}, {fac.city}</p>
                        {fac.safetyScore && (
                          <div className="mt-3 flex items-center justify-between border-t border-gray-100/50 pt-2 dark:border-zinc-800/40">
                            <span className="text-[9px] text-gray-400 dark:text-zinc-500">Last Rating:</span>
                            <span className="text-[10px] font-mono font-bold text-sky-700 dark:text-sky-400">{fac.safetyScore}/100 Score</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: EHS Contacts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Entity Representatives</h4>
                  <div className="space-y-2">
                    {selectedCompany.contacts.map(con => (
                      <div key={con.id} className="p-3.5 border border-gray-100 rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{con.name}</p>
                          {con.isPrimary && <span className="text-[8px] font-bold bg-sky-50 text-sky-700 px-1.5 rounded dark:bg-sky-950/40 dark:text-sky-300 uppercase">Primary</span>}
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-zinc-500 mt-0.5">{con.role}</p>
                        <div className="mt-2.5 space-y-1 text-[10px] text-gray-400 dark:text-zinc-500">
                          <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-sky-600" /> {con.email}</p>
                          <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-sky-600" /> {con.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Active Audits / Checklists */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compliance Ledger Checkpoints</h4>
                  <div className="space-y-2">
                    {audits.filter(a => a.companyId === selectedCompany.id).map(aud => (
                      <div key={aud.id} className="p-3.5 border border-gray-50 rounded-xl bg-gray-50/50 dark:bg-zinc-950 dark:border-zinc-800/80 text-xs">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-gray-900 dark:text-white">{aud.templateName}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded ${
                            aud.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950' : 'bg-amber-50 text-amber-700'
                          }`}>{aud.status}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5">Scheduled for: {aud.scheduledDate}</p>
                        
                        {aud.status === 'In Progress' && (
                          <div className="mt-3">
                            <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                              <span>Completeness</span>
                              <span>{aud.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-zinc-800">
                              <div className="h-full bg-sky-600" style={{ width: `${aud.progress}%` }} />
                            </div>
                            <button
                              onClick={() => handleLaunchAudit(aud)}
                              className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] font-bold bg-sky-700 text-white rounded py-1.5 hover:bg-sky-800"
                            >
                              <Play className="h-3 w-3 fill-white" /> Continue Inspection
                            </button>
                          </div>
                        )}

                        {aud.status === 'Scheduled' && (
                          <button
                            onClick={() => handleLaunchAudit(aud)}
                            className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] font-bold bg-sky-700 text-white rounded py-1.5 hover:bg-sky-800"
                          >
                            <Play className="h-3 w-3 fill-white" /> Begin Inspection
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* --- Companies Register List --- */
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
              
              <div className="p-5 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search entities..."
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      className="h-9 rounded-lg border border-gray-100 bg-gray-50/50 pl-9 pr-3 text-xs text-gray-900 outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>

                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="h-9 rounded-lg border border-gray-100 bg-gray-50/50 px-3 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                  >
                    <option value="All">All Industries</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Food">Food &amp; Beverage</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Government">Government</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowCreateCompany(true)}
                  id="btn-register-company"
                  className="flex items-center gap-1.5 rounded-lg bg-sky-700 px-4 py-2 text-xs font-bold text-white hover:bg-sky-800 shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Company Entity
                </button>
              </div>

              {/* Responsive Register Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold dark:bg-zinc-800/40 dark:text-zinc-400 border-b border-gray-100 dark:border-zinc-850">
                    <tr>
                      <th className="px-6 py-3.5">Company Name</th>
                      <th className="px-6 py-3.5">Industrial Sector</th>
                      <th className="px-6 py-3.5">Registered Facilities</th>
                      <th className="px-6 py-3.5">Registered Date</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                    {filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                          No company registers matched search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map(co => (
                        <tr
                          key={co.id}
                          onClick={() => setSelectedCompany(co)}
                          className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center font-bold">
                              {co.name.substring(0, 2).toUpperCase()}
                            </div>
                            {co.name}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-500 dark:text-zinc-400">{co.industry}</td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded">
                              {co.facilities.length} active sites
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{co.createdAt}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 font-bold rounded ${
                              co.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950' : 'bg-rose-50 text-rose-700'
                            }`}>{co.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedCompany(co); }}
                              className="text-sky-700 hover:underline dark:text-sky-400 font-bold"
                            >
                              Explore Folder
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Dialog Component: Create Company Entity */}
          {showCreateCompany && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg border border-gray-100 shadow-2xl dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-4 dark:border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Register New Company Entity</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Define industrial classification &amp; baseline facility.</p>
                  </div>
                  <button onClick={() => setShowCreateCompany(false)} className="h-8 w-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleAddCompanySubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Entity Name</label>
                      <input
                        type="text"
                        required
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Industry Category</label>
                      <select
                        value={newCompany.industry}
                        onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value as any })}
                        className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                      >
                        <option value="Healthcare">Healthcare &amp; Bio-Labs</option>
                        <option value="Food">Food &amp; Beverage</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Government">Government</option>
                        <option value="Agriculture">Agriculture</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-3 dark:border-zinc-800/80">
                    <h5 className="font-bold text-[10px] text-gray-400 mb-2">Primary Facility Parameters</h5>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Facility / Plant Name"
                        required
                        value={newCompany.facilityName}
                        onChange={(e) => setNewCompany({ ...newCompany, facilityName: e.target.value })}
                        className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={newCompany.facilityAddress}
                          onChange={(e) => setNewCompany({ ...newCompany, facilityAddress: e.target.value })}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={newCompany.facilityCity}
                          onChange={(e) => setNewCompany({ ...newCompany, facilityCity: e.target.value })}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-3 dark:border-zinc-800/80">
                    <h5 className="font-bold text-[10px] text-gray-400 mb-2">Point of Contact</h5>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Representative Name"
                        required
                        value={newCompany.contactName}
                        onChange={(e) => setNewCompany({ ...newCompany, contactName: e.target.value })}
                        className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="email"
                          placeholder="Corporate Email"
                          required
                          value={newCompany.contactEmail}
                          onChange={(e) => setNewCompany({ ...newCompany, contactEmail: e.target.value })}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                        />
                        <input
                          type="text"
                          placeholder="Direct Phone"
                          value={newCompany.contactPhone}
                          onChange={(e) => setNewCompany({ ...newCompany, contactPhone: e.target.value })}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full rounded-xl bg-sky-700 py-3 text-xs font-bold text-white hover:bg-sky-800 shadow-sm transition-all">
                    Establish Entity Record
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ====================================================
          SERVICES MODULE
          ==================================================== */}
      {adminTab === 'services' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Enterprise Service Catalog</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Review and deploy standards checklists across active clients.</p>
            </div>
            <button
              onClick={() => setShowCreateService(true)}
              className="flex items-center gap-1 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg px-3 py-2 text-xs"
            >
              <Plus className="h-4 w-4" /> Create New Service
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(srv => (
              <div key={srv.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col justify-between dark:bg-zinc-900 dark:border-zinc-800/85">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded dark:bg-sky-950 dark:text-sky-300 font-bold uppercase">{srv.standardCode}</span>
                    <span className="text-gray-400 dark:text-zinc-500">{srv.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-950 dark:text-white mt-4">{srv.name}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-2 leading-relaxed">{srv.description}</p>
                </div>
                <div className="mt-5 border-t border-gray-50 pt-3 flex justify-between items-center dark:border-zinc-800/60 text-xs">
                  <span className="font-semibold text-gray-400">{srv.assignedCompaniesCount} client entities</span>
                  <button
                    onClick={() => {
                      setServices(services.filter(s => s.id !== srv.id));
                      showToast(`Service '${srv.name}' removed from active catalogue.`, 'info');
                    }}
                    className="text-rose-600 hover:underline font-bold text-[11px]"
                  >
                    Delete Catalog Item
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dialog: Create Service */}
          {showCreateService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md border border-gray-100 shadow-2xl dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-4 dark:border-zinc-800">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Create New Catalog Service</h4>
                  <button onClick={() => setShowCreateService(false)} className="h-8 w-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:border-zinc-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateServiceSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Service Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hazardous Materials Handling Review"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Standard Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. OSHA-1910-HAZ"
                      value={newService.standardCode}
                      onChange={(e) => setNewService({ ...newService, standardCode: e.target.value })}
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Category Classification</label>
                    <input
                      type="text"
                      placeholder="e.g. Environmental Health"
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full rounded-xl bg-sky-700 py-3 text-xs font-bold text-white hover:bg-sky-800 shadow-sm transition-all">
                    Deploy Service standard
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ====================================================
          AUDIT TEMPLATE BUILDER (The Most Important Screen!)
          ==================================================== */}
      {adminTab === 'templates' && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Dynamic Template Architect</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Author interactive inspection standards using custom checkpoints.</p>
            </div>
            
            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-bold text-gray-400">Selected Schema:</span>
              <select
                value={activeBuilderTemplate.id}
                onChange={(e) => {
                  const found = templates.find(t => t.id === e.target.value);
                  if (found) {
                    setSelectedTemplate(found);
                    setActiveSectionId(found.sections[0]?.id || '');
                    setSelectedQuestionId('');
                  }
                }}
                className="h-9 rounded-lg border border-gray-100 bg-white px-3 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (v{t.version})</option>
                ))}
              </select>

              <button
                onClick={handleSaveTemplateSettings}
                className="flex items-center gap-1 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg px-3 py-2 text-xs"
              >
                <Save className="h-4 w-4" /> Save Template
              </button>
            </div>
          </div>

          {/* Sub-Tabs for Template Settings: Checklist Design, Scoring Rules, Approval Workflow */}
          <div className="flex border-b border-gray-100 dark:border-zinc-800/80 gap-6 text-xs font-bold uppercase tracking-wider">
            <button
              id="subtab-checklist"
              onClick={() => setTemplateSubTab('checklist')}
              className={`pb-3 transition-colors relative ${
                templateSubTab === 'checklist'
                  ? 'text-sky-700 dark:text-sky-400 border-b-2 border-sky-700 dark:border-sky-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
              }`}
            >
              Checklist Design
            </button>
            <button
              id="subtab-scoring"
              onClick={() => setTemplateSubTab('scoring')}
              className={`pb-3 transition-colors relative ${
                templateSubTab === 'scoring'
                  ? 'text-sky-700 dark:text-sky-400 border-b-2 border-sky-700 dark:border-sky-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
              }`}
            >
              Scoring Rules
            </button>
            <button
              id="subtab-approval"
              onClick={() => setTemplateSubTab('approval')}
              className={`pb-3 transition-colors relative ${
                templateSubTab === 'approval'
                  ? 'text-sky-700 dark:text-sky-400 border-b-2 border-sky-700 dark:border-sky-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
              }`}
            >
              Approval Workflow
            </button>
          </div>

          {templateSubTab === 'checklist' && (
            <div className="grid lg:grid-cols-4 gap-6 items-start">
              
              {/* Panel 1: Sections Sidebar (Left) */}
              <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-100 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Checklist Sections</h4>
                
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {activeBuilderTemplate.sections.map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => { setActiveSectionId(sec.id); setSelectedQuestionId(''); }}
                      className={`w-full text-left rounded-lg p-2.5 text-xs font-semibold flex items-center justify-between ${
                        activeSectionId === sec.id
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <span className="text-[9px] font-mono bg-gray-200/50 text-gray-500 px-1.5 rounded dark:bg-zinc-800 dark:text-zinc-400">
                        {sec.questions.length} q
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-50 pt-3 dark:border-zinc-800/60">
                  <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Create Section</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Section Title"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-100 bg-gray-50 px-2 py-1.5 text-[10px] outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                    />
                    <button
                      onClick={handleAddSectionToTemplate}
                      className="rounded-lg bg-sky-700 text-white px-2 py-1.5 text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Panel 2: Questions Designer (Center) */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2 dark:border-zinc-800/80">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Checkpoints Design Space
                  </h4>
                  
                  {activeSectionId && (
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddQuestionToSection(e.target.value as QuestionType);
                            e.target.value = '';
                          }
                        }}
                        className="h-8 rounded-lg border border-gray-100 bg-gray-50 px-2 text-[10px] font-bold text-sky-700 outline-none cursor-pointer dark:border-zinc-800 dark:bg-zinc-950 dark:text-sky-300"
                      >
                        <option value="">+ Append Checkpoint</option>
                        <option value="yes-no">Yes / No Switch</option>
                        <option value="pass-fail">Pass / Fail Trigger</option>
                        <option value="text">Input Text Field</option>
                        <option value="number">Numeric Parameter</option>
                        <option value="photo">Camera Photo Capture</option>
                        <option value="signature">Digital Signature</option>
                        <option value="gps">GPS Coordinates stamp</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activeBuilderTemplate.sections.find(s => s.id === activeSectionId)?.questions.length === 0 && (
                    <div className="py-12 text-center text-xs text-gray-400">
                      No checkpoints added to this section. Append one above.
                    </div>
                  )}

                  {activeBuilderTemplate.sections.find(s => s.id === activeSectionId)?.questions.map((q) => {
                    const isSelected = selectedQuestionId === q.id;
                    return (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQuestionId(q.id)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/10 dark:border-sky-400'
                            : 'border-gray-100 hover:border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-850 dark:hover:border-zinc-800'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={q.text}
                              onChange={(e) => handleQuestionPropChange(q.id, { text: e.target.value })}
                              className="w-full bg-transparent font-bold text-xs text-gray-950 dark:text-white outline-none focus:border-b focus:border-sky-500"
                              placeholder="Enter question wording..."
                            />
                            <div className="flex items-center gap-2 mt-2 text-[9px] font-mono text-gray-400">
                              <span className="bg-gray-100 dark:bg-zinc-800 px-1.5 rounded uppercase">{q.type}</span>
                              <span>• Weight: {q.weight}/5</span>
                              {q.isCritical && <span className="text-rose-500 font-bold">• CRITICAL DESTRUCT</span>}
                              {q.required && <span className="text-sky-600 font-bold">• REQUIRED</span>}
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Delete question
                              const updated = templates.map(t => {
                                if (t.id === activeBuilderTemplate.id) {
                                  return {
                                    ...t,
                                    sections: t.sections.map(s => {
                                      if (s.id === activeSectionId) {
                                        return { ...s, questions: s.questions.filter(qu => qu.id !== q.id) };
                                      }
                                      return s;
                                    })
                                  };
                                }
                                return t;
                              });
                              setTemplates(updated);
                              setSelectedQuestionId('');
                              showToast('Checkpoint removed.', 'info');
                            }}
                            className="text-gray-300 hover:text-rose-600 p-1 rounded"
                            title="Delete Question"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Panel 3: Question Settings (Right) */}
              <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-100 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Checkpoint Parameters</h4>
                
                {selectedQuestionId ? (
                  (() => {
                    const currentQ = activeBuilderTemplate.sections
                      .find(s => s.id === activeSectionId)
                      ?.questions.find(q => q.id === selectedQuestionId);

                    if (!currentQ) return <div className="text-xs text-gray-400">Select a checkpoint to configure.</div>;

                    return (
                      <div className="space-y-4 text-xs">
                        <div className="flex justify-between items-center">
                          <label className="font-semibold text-gray-700 dark:text-zinc-300">Mandatory Parameter</label>
                          <input
                            type="checkbox"
                            checked={currentQ.required}
                            onChange={(e) => handleQuestionPropChange(currentQ.id, { required: e.target.checked })}
                            className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <label className="font-semibold text-rose-600">Critical Safety Trigger</label>
                          <input
                            type="checkbox"
                            checked={currentQ.isCritical}
                            onChange={(e) => handleQuestionPropChange(currentQ.id, { isCritical: e.target.checked })}
                            className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <label className="font-semibold text-gray-700 dark:text-zinc-300">Hazard weight value</label>
                            <span className="font-mono font-bold text-sky-700 dark:text-sky-400">{currentQ.weight} / 5</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={currentQ.weight}
                            onChange={(e) => handleQuestionPropChange(currentQ.id, { weight: parseInt(e.target.value) })}
                            className="w-full accent-sky-700 cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-700 dark:text-zinc-300">Instructional Help Text</label>
                          <input
                            type="text"
                            value={currentQ.helpText || ''}
                            onChange={(e) => handleQuestionPropChange(currentQ.id, { helpText: e.target.value })}
                            placeholder="Provide inspector guidelines..."
                            className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-700 dark:text-zinc-300">Placeholder Text</label>
                          <input
                            type="text"
                            value={currentQ.placeholder || ''}
                            onChange={(e) => handleQuestionPropChange(currentQ.id, { placeholder: e.target.value })}
                            placeholder="e.g. °C, PSI, or text instruction"
                            className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                          />
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8 text-xs text-gray-400">
                    Select a question card in design space to display settings.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ====================================================
              SCORING RULES BUILDER TAB
              ==================================================== */}
          {templateSubTab === 'scoring' && editingScoringRule && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-6 dark:bg-zinc-900 dark:border-zinc-800 animate-fade-in">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 dark:border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Enterprise Compliance Scoring Engine</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Configure mathematical models to calculate facility safety scores, pass/fail status, and risk categorizations.</p>
                </div>
                <button
                  id="btn-save-scoring-rules"
                  onClick={handleSaveScoringRule}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors shadow-xs"
                >
                  <Save className="h-4 w-4" /> Save Scoring Model
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Column 1: Config */}
                <div className="space-y-6">
                  {/* Method Selection */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Scoring Method</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { key: 'Percentage', name: 'Percentage Rate', desc: 'Standard average across all checklists, perfect for simple checklists.' },
                        { key: 'Weighted', name: 'Weighted Sections', desc: 'Section scores are multiplied by specific weights (total must sum to 100%).' },
                        { key: 'PassFail', name: 'Pass / Fail Standard', desc: 'Zero Tolerance: any failed question forces overall compliance to 0%.' },
                        { key: 'RiskBased', name: 'Risk Deductions', desc: 'Starts at 100%, deducting points dynamically based on hazard weights.' }
                      ].map((m) => (
                        <div
                          key={m.key}
                          onClick={() => setEditingScoringRule({ ...editingScoringRule, scoringMethod: m.key as any })}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-32 ${
                            editingScoringRule.scoringMethod === m.key
                              ? 'border-sky-500 bg-sky-50/10 dark:border-sky-400'
                              : 'border-gray-100 hover:border-gray-200 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{m.name}</span>
                            <input
                              type="radio"
                              name="scoringMethod"
                              checked={editingScoringRule.scoringMethod === m.key}
                              onChange={() => {}}
                              className="text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal mt-2">{m.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Threshold & Critical fail */}
                  <div className="grid sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Compliance Threshold</label>
                        <span className="text-xs font-bold text-sky-700 dark:text-sky-400 font-mono">{editingScoringRule.complianceThreshold}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        value={editingScoringRule.complianceThreshold}
                        onChange={(e) => setEditingScoringRule({ ...editingScoringRule, complianceThreshold: parseInt(e.target.value) })}
                        className="w-full accent-sky-700 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                        <span>Pass &gt;= {editingScoringRule.complianceThreshold}%</span>
                        <span>Fail &lt; {editingScoringRule.complianceThreshold}%</span>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="block text-xs font-bold text-gray-900 dark:text-white">Critical Failures Caps</label>
                        <p className="text-[9px] text-gray-400 max-w-[150px]">Failing a critical parameter immediately caps overall score at 40%.</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingScoringRule.criticalFailureEnabled}
                          onChange={(e) => setEditingScoringRule({ ...editingScoringRule, criticalFailureEnabled: e.target.checked })}
                          className="rounded border-gray-350 text-sky-600 focus:ring-sky-500 h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Specific controls & preview */}
                <div className="space-y-6">
                  {/* Weighted Sections config */}
                  {editingScoringRule.scoringMethod === 'Weighted' ? (
                    <div className="bg-gray-50/50 dark:bg-zinc-950/20 p-5 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-4">
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Weighted Sections Allocation</h5>
                      <p className="text-[10px] text-gray-400 leading-normal">Assign specific weight coefficients to each section. Total must equal exactly 100%.</p>
                      
                      <div className="space-y-3">
                        {editingScoringRule.weightedSections.map((secWeight, idx) => (
                          <div key={secWeight.sectionId} className="flex items-center justify-between gap-4 text-xs">
                            <span className="font-semibold text-gray-700 dark:text-zinc-300 truncate max-w-[200px]">{secWeight.sectionTitle}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={secWeight.weight}
                                onChange={(e) => {
                                  const updated = [...editingScoringRule.weightedSections];
                                  updated[idx] = { ...secWeight, weight: parseInt(e.target.value) || 0 };
                                  setEditingScoringRule({ ...editingScoringRule, weightedSections: updated });
                                }}
                                className="w-16 h-8 text-center border border-gray-100 dark:border-zinc-855 bg-white dark:bg-zinc-955 text-gray-900 dark:text-white rounded-lg outline-none font-bold text-xs"
                              />
                              <span className="font-bold text-gray-400">%</span>
                            </div>
                          </div>
                        ))}

                        <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex justify-between items-center text-xs font-bold">
                          <span>Total Weight</span>
                          {(() => {
                            const sum = editingScoringRule.weightedSections.reduce((acc, curr) => acc + curr.weight, 0);
                            return (
                              <span className={sum === 100 ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>
                                {sum}% / 100%
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs text-gray-400 border border-dashed border-gray-100 rounded-3xl dark:border-zinc-800 bg-gray-55/20">
                      Weighted section parameters are only applicable under "Weighted Sections" scoring method.
                    </div>
                  )}

                  {/* Risk Levels preview */}
                  <div className="p-5 border border-gray-100 dark:border-zinc-800 rounded-3xl space-y-4 bg-white dark:bg-zinc-900/40">
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Mathematical Risk Rating Levels</h5>
                    
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/10">
                        <span className="block text-[8px] font-bold uppercase">LOW RISK</span>
                        <span className="font-bold text-[11px] font-mono">&gt;= {editingScoringRule.complianceThreshold}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/10">
                        <span className="block text-[8px] font-bold uppercase">MEDIUM</span>
                        <span className="font-bold text-[11px] font-mono">70 - {editingScoringRule.complianceThreshold - 1}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-100/10">
                        <span className="block text-[8px] font-bold uppercase">HIGH RISK</span>
                        <span className="font-bold text-[11px] font-mono">50 - 69%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/10">
                        <span className="block text-[8px] font-bold uppercase">CRITICAL</span>
                        <span className="font-bold text-[11px] font-mono">&lt; 50%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              APPROVAL WORKFLOW BUILDER TAB
              ==================================================== */}
          {templateSubTab === 'approval' && editingApprovalFlow && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-6 dark:bg-zinc-900 dark:border-zinc-800 animate-fade-in">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 dark:border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Multi-Level Quality Sign-Off Workflows</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Define cascading human authorization checkpoints that verify and sign off field inspections before publishing.</p>
                </div>
                <button
                  id="btn-save-approval-flow"
                  onClick={handleSaveApprovalFlow}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors shadow-xs"
                >
                  <Save className="h-4 w-4" /> Save Sign-Off Rules
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Column 1 & 2: Cascading Cards */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Approval Levels Chain</span>
                    <button
                      id="btn-add-approval-level"
                      onClick={() => {
                        const newStep = {
                          role: `Approver Level ${editingApprovalFlow.steps.length + 1}`,
                          order: editingApprovalFlow.steps.length + 1,
                          approvalRequired: true,
                          commentRequired: true,
                          notificationRequired: true
                        };
                        setEditingApprovalFlow({
                          ...editingApprovalFlow,
                          steps: [...editingApprovalFlow.steps, newStep]
                        });
                        showToast('New approval level added.', 'success');
                      }}
                      className="text-xs font-bold text-sky-700 hover:text-sky-800 dark:text-sky-400 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add Level
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingApprovalFlow.steps.sort((a,b) => a.order - b.order).map((step, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="h-7 w-7 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>

                        <div className="flex-1 bg-gray-50/50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-850 p-4 rounded-2xl relative">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-gray-400">Responsible Role</label>
                              <select
                                value={step.role}
                                onChange={(e) => {
                                  const updated = [...editingApprovalFlow.steps];
                                  updated[index] = { ...step, role: e.target.value };
                                  setEditingApprovalFlow({ ...editingApprovalFlow, steps: updated });
                                }}
                                className="w-full h-8 rounded-lg border border-gray-100 bg-white px-2 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-900"
                              >
                                <option value="Auditor">Auditor (Inspector)</option>
                                <option value="Audit Manager">Audit Manager (Supervisor)</option>
                                <option value="Operations Manager">Operations Director</option>
                                <option value="Regional Quality Assurance">Regional QA Lead</option>
                                <option value="Client Representative">Client Representative</option>
                                <option value="Executive Officer">Executive Board Director</option>
                              </select>
                            </div>

                            <div className="flex flex-wrap gap-4 items-center text-xs font-semibold text-gray-600 dark:text-zinc-400 pt-3 sm:pt-0">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={step.approvalRequired}
                                  onChange={(e) => {
                                    const updated = [...editingApprovalFlow.steps];
                                    updated[index] = { ...step, approvalRequired: e.target.checked };
                                    setEditingApprovalFlow({ ...editingApprovalFlow, steps: updated });
                                  }}
                                  className="rounded border-gray-300 text-sky-600"
                                />
                                Require Sign-Off
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={step.commentRequired}
                                  onChange={(e) => {
                                    const updated = [...editingApprovalFlow.steps];
                                    updated[index] = { ...step, commentRequired: e.target.checked };
                                    setEditingApprovalFlow({ ...editingApprovalFlow, steps: updated });
                                  }}
                                  className="rounded border-gray-300 text-sky-600"
                                />
                                Force Comment
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={step.notificationRequired}
                                  onChange={(e) => {
                                    const updated = [...editingApprovalFlow.steps];
                                    updated[index] = { ...step, notificationRequired: e.target.checked };
                                    setEditingApprovalFlow({ ...editingApprovalFlow, steps: updated });
                                  }}
                                  className="rounded border-gray-300 text-sky-600"
                                />
                                Auto Notify
                              </label>
                            </div>
                          </div>

                          {/* Order shifting & deletion */}
                          <div className="absolute top-4 right-4 flex gap-1">
                            <button
                              disabled={index === 0}
                              onClick={() => {
                                const updated = [...editingApprovalFlow.steps];
                                const temp = updated[index];
                                updated[index] = { ...updated[index - 1], order: index + 1 };
                                updated[index - 1] = { ...temp, order: index };
                                setEditingApprovalFlow({ ...editingApprovalFlow, steps: updated });
                              }}
                              className="p-1 border border-gray-100 rounded text-gray-400 hover:text-gray-600 dark:border-zinc-800 disabled:opacity-30"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              disabled={index === editingApprovalFlow.steps.length - 1}
                              onClick={() => {
                                const updated = [...editingApprovalFlow.steps];
                                const temp = updated[index];
                                updated[index] = { ...updated[index + 1], order: index + 1 };
                                updated[index + 1] = { ...temp, order: index + 2 };
                                setEditingApprovalFlow({ ...editingApprovalFlow, steps: updated });
                              }}
                              className="p-1 border border-gray-100 rounded text-gray-400 hover:text-gray-600 dark:border-zinc-800 disabled:opacity-30"
                              title="Move Down"
                            >
                              ↓
                            </button>
                            {editingApprovalFlow.steps.length > 1 && (
                              <button
                                onClick={() => {
                                  const updated = editingApprovalFlow.steps
                                    .filter((_, i) => i !== index)
                                    .map((s, i) => ({ ...s, order: i + 1 }));
                                  setEditingApprovalFlow({ ...editingApprovalFlow, steps: updated });
                                  showToast('Approval level removed.', 'info');
                                }}
                                className="p-1 border border-gray-100 rounded text-rose-400 hover:text-rose-600 dark:border-zinc-800"
                                title="Remove level"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Summary Description */}
                <div className="p-5 border border-gray-100 dark:border-zinc-800 bg-gray-50/20 rounded-3xl space-y-4">
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Sign-Off Logic &amp; Routing</h5>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Cascading sign-off enforces sequence control. When the inspector (Auditor) submits the checklist, the system locks the audit draft and auto-routes notification to the level 2 recipient.
                  </p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Only when the final configured level grants approval will the audit status be moved to <span className="text-emerald-600 font-bold">Approved</span> and published to the customer portal.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ====================================================
          AUDIT EXECUTION / ACTIVE AUDITS VIEW
          ==================================================== */}
      {adminTab === 'audits' && (
        <div className="space-y-6">
          
          {activeExecutionAudit ? (
            /* --- Tablet-friendly Active Execution UI --- */
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
              
              {/* Execution Header */}
              <div className="p-6 bg-slate-900 text-white flex flex-wrap gap-4 justify-between items-center dark:bg-zinc-950">
                <div>
                  <span className="text-[9px] font-bold bg-sky-500/10 text-sky-400 border border-sky-400/20 px-2 py-0.5 rounded uppercase">ACTIVE FIELD INSPECTION</span>
                  <h3 className="text-base font-extrabold text-white mt-1.5">{activeExecutionAudit.companyName}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Facility: <span className="text-slate-200">{activeExecutionAudit.facilityName}</span> • Inspector: <span className="text-slate-200">{activeExecutionAudit.auditorName}</span></p>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-[10px] text-slate-400">Overall Progress</p>
                    <p className="text-lg font-black text-sky-400">{activeExecutionAudit.progress}% Complete</p>
                  </div>
                  <div className="h-10 w-24 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700">
                    <div className="h-full bg-sky-600 transition-all duration-300" style={{ width: `${activeExecutionAudit.progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Execution Body */}
              <div className="grid md:grid-cols-4 min-h-96">
                
                {/* Left column: Section select */}
                <div className="md:col-span-1 border-r border-gray-50 bg-gray-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/20">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Inspection Sections</h4>
                  <div className="space-y-1.5">
                    {(() => {
                      const template = templates.find(t => t.id === activeExecutionAudit.templateId);
                      return template?.sections.map((sec, idx) => {
                        const isSectionActive = activeExecSectionIdx === idx;
                        return (
                          <button
                            key={sec.id}
                            onClick={() => setActiveExecSectionIdx(idx)}
                            className={`w-full text-left rounded-lg p-3 text-xs font-semibold flex items-center justify-between ${
                              isSectionActive
                                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <span className="truncate">{sec.title}</span>
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Right column: Questions input block */}
                <div className="md:col-span-3 p-6 space-y-6">
                  {(() => {
                    const template = templates.find(t => t.id === activeExecutionAudit.templateId);
                    const currentSection = template?.sections[activeExecSectionIdx];

                    if (!currentSection) return <div className="text-xs text-gray-400">Loading section elements...</div>;

                    return (
                      <div className="space-y-6">
                        <div className="border-b border-gray-50 pb-3 dark:border-zinc-800">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">{currentSection.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{currentSection.description}</p>
                        </div>

                        <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                          {currentSection.questions.map((q) => {
                            const answerObj = activeExecutionAudit.answers.find(a => a.questionId === q.id) || { questionId: q.id, value: '', status: 'Unanswered' };

                            return (
                              <div key={q.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/10 dark:border-zinc-850 dark:bg-zinc-900/20 space-y-3">
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <h5 className="font-bold text-xs text-gray-950 dark:text-white">{q.text}</h5>
                                    {q.helpText && <p className="text-[10px] text-gray-400 mt-1 leading-normal">{q.helpText}</p>}
                                  </div>
                                  {q.isCritical && <span className="text-[8px] font-bold bg-rose-50 text-rose-700 border border-rose-100 px-1.5 py-0.5 rounded uppercase">Critical</span>}
                                </div>

                                {/* Dynamic Input rendering based on q.type */}
                                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                  
                                  {/* Answer selector */}
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Observation Result</label>
                                    
                                    {q.type === 'yes-no' && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleAnswerChange(q.id, 'yes', answerObj.notes, 'Pass')}
                                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            answerObj.value === 'yes' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                                          }`}
                                        >
                                          Yes
                                        </button>
                                        <button
                                          onClick={() => handleAnswerChange(q.id, 'no', answerObj.notes, 'Fail')}
                                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            answerObj.value === 'no' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                                          }`}
                                        >
                                          No
                                        </button>
                                      </div>
                                    )}

                                    {q.type === 'pass-fail' && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleAnswerChange(q.id, 'pass', answerObj.notes, 'Pass')}
                                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            answerObj.value === 'pass' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                                          }`}
                                        >
                                          Pass
                                        </button>
                                        <button
                                          onClick={() => handleAnswerChange(q.id, 'fail', answerObj.notes, 'Fail')}
                                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            answerObj.value === 'fail' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                                          }`}
                                        >
                                          Fail
                                        </button>
                                      </div>
                                    )}

                                    {(q.type === 'text' || q.type === 'number') && (
                                      <input
                                        type={q.type}
                                        placeholder={q.placeholder || 'Enter observation value...'}
                                        value={answerObj.value}
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value, answerObj.notes, 'Conforming')}
                                        className="w-full rounded-lg border border-gray-100 bg-white p-2 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                                      />
                                    )}

                                    {q.type === 'dropdown' && (
                                      <select
                                        value={answerObj.value}
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value, answerObj.notes, 'Conforming')}
                                        className="w-full rounded-lg border border-gray-100 bg-white p-2 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                                      >
                                        <option value="">Select option...</option>
                                        {q.options?.map((opt, oIdx) => (
                                          <option key={oIdx} value={opt}>{opt}</option>
                                        ))}
                                      </select>
                                    )}

                                    {q.type === 'photo' && (
                                      <button
                                        onClick={() => handleAnswerChange(q.id, 'raw_photo_snapshot_9221.jpg', answerObj.notes, 'Conforming')}
                                        className="w-full rounded-lg border border-dashed border-gray-200 bg-white p-2.5 text-xs text-sky-700 hover:bg-sky-50/50 flex items-center justify-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-sky-400"
                                      >
                                        <Camera className="h-4 w-4" /> {answerObj.value ? 'Photo Attached (raw_photo_snapshot.jpg)' : 'Simulate Camera Snapshot'}
                                      </button>
                                    )}

                                    {q.type === 'signature' && (
                                      <button
                                        onClick={() => handleAnswerChange(q.id, 'REPRESENTATIVE_SIGNATURE_STAMP', answerObj.notes, 'Conforming')}
                                        className="w-full rounded-lg border border-dashed border-gray-200 bg-white p-2.5 text-xs text-sky-700 hover:bg-sky-50/50 flex items-center justify-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-sky-400"
                                      >
                                        <Award className="h-4 w-4" /> {answerObj.value ? 'Digital Signature Stamp Locked' : 'Authorize Representative Signature'}
                                      </button>
                                    )}
                                  </div>

                                  {/* Notes field */}
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Inspector Wording / Notes</label>
                                    <input
                                      type="text"
                                      placeholder="Add deficiency or explanation notes..."
                                      value={answerObj.notes || ''}
                                      onChange={(e) => handleAnswerChange(q.id, answerObj.value, e.target.value, answerObj.status)}
                                      className="w-full rounded-lg border border-gray-100 bg-white p-2 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                                    />
                                  </div>

                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Navigation controls */}
                        <div className="flex justify-between items-center border-t border-gray-50 pt-4 dark:border-zinc-850">
                          <button
                            disabled={activeExecSectionIdx === 0}
                            onClick={() => setActiveExecSectionIdx(activeExecSectionIdx - 1)}
                            className="rounded-lg border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 px-4 py-2 disabled:opacity-40"
                          >
                            Previous Section
                          </button>

                          <div className="flex gap-2">
                            <button
                              onClick={() => { setActiveExecutionAudit(null); showToast('Inspection draft archived in operational log.', 'info'); }}
                              className="rounded-lg border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 px-4 py-2"
                            >
                              Save Draft
                            </button>
                            
                            {activeExecSectionIdx < template.sections.length - 1 ? (
                              <button
                                onClick={() => setActiveExecSectionIdx(activeExecSectionIdx + 1)}
                                className="rounded-lg bg-sky-700 text-white text-xs font-bold hover:bg-sky-800 px-4 py-2"
                              >
                                Next Section
                              </button>
                            ) : (
                              <button
                                onClick={handleSubmitAuditForm}
                                className="rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 px-5 py-2"
                              >
                                Finalize &amp; Submit Audit
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>

            </div>
          ) : selectedAuditForDetails ? (
            /* --- Audit Details & Visual Workflow Workspace --- */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  id="btn-back-to-audits"
                  onClick={() => setSelectedAuditForDetails(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-950 dark:hover:text-white"
                >
                  ← Back to Schedule
                </button>

                <div className="flex gap-2">
                  <button
                    id="btn-recalc-audit-score"
                    onClick={() => handleTriggerScoreRecalculation(selectedAuditForDetails.id)}
                    className="bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Recalculate Score
                  </button>
                </div>
              </div>

              {/* Header Card */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl dark:bg-zinc-950 flex flex-wrap gap-6 justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold bg-sky-500/10 text-sky-400 border border-sky-400/20 px-2.5 py-1 rounded uppercase">Enterprise Audit Details</span>
                  <h3 className="text-lg font-black mt-2">{selectedAuditForDetails.companyName}</h3>
                  <p className="text-xs text-slate-400 mt-1">Facility ID: {selectedAuditForDetails.facilityName} • Standard Code: {selectedAuditForDetails.templateName}</p>
                </div>

                {/* Score Summary Metrics */}
                <div className="flex gap-6 items-center">
                  <div className="text-center p-3 px-4 bg-slate-800/40 rounded-2xl border border-slate-800/30">
                    <span className="block text-[8px] text-slate-400 uppercase font-bold">Audit Score</span>
                    <span className="text-xl font-black text-sky-400 font-mono">{selectedAuditForDetails.score || 85}%</span>
                  </div>

                  <div className="text-center p-3 px-4 bg-slate-800/40 rounded-2xl border border-slate-800/30">
                    <span className="block text-[8px] text-slate-400 uppercase font-bold">Compliance Status</span>
                    <span className={`text-xs font-bold uppercase block mt-1 ${
                      (selectedAuditForDetails.score || 85) >= 80 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {(selectedAuditForDetails.score || 85) >= 80 ? 'Compliant (Pass)' : 'Non-Compliant'}
                    </span>
                  </div>

                  <div className="text-center p-3 px-4 bg-slate-800/40 rounded-2xl border border-slate-800/30">
                    <span className="block text-[8px] text-slate-400 uppercase font-bold">Risk Matrix</span>
                    <span className="text-xs font-bold text-emerald-400 block mt-1 uppercase">
                      {(selectedAuditForDetails.score || 85) >= 85 ? 'Low Risk' : (selectedAuditForDetails.score || 85) >= 70 ? 'Medium Risk' : 'High Risk'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Workflow Pipeline timeline */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 dark:bg-zinc-900 dark:border-zinc-800 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Audit Workflow Pipeline</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Visually track sequence execution and operational hand-offs.</p>
                </div>

                {/* Horizontal Timeline flow */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {[
                    { key: 'Draft', badge: 'bg-slate-100 text-slate-600', activeBadge: 'ring-2 ring-slate-900 bg-slate-100' },
                    { key: 'Assigned', badge: 'bg-sky-50 text-sky-700', activeBadge: 'ring-2 ring-sky-500 bg-sky-50' },
                    { key: 'In Progress', badge: 'bg-amber-50 text-amber-700', activeBadge: 'ring-2 ring-amber-500 bg-amber-50' },
                    { key: 'Submitted', badge: 'bg-orange-50 text-orange-700', activeBadge: 'ring-2 ring-orange-500 bg-orange-50' },
                    { key: 'Under Review', badge: 'bg-indigo-50 text-indigo-700', activeBadge: 'ring-2 ring-indigo-500 bg-indigo-50' },
                    { key: 'Approved', badge: 'bg-emerald-50 text-emerald-700', activeBadge: 'ring-2 ring-emerald-500 bg-emerald-50' },
                    { key: 'Shared', badge: 'bg-teal-50 text-teal-700', activeBadge: 'ring-2 ring-teal-500 bg-teal-50' },
                    { key: 'Closed', badge: 'bg-zinc-800 text-white', activeBadge: 'ring-2 ring-zinc-900 bg-zinc-850' }
                  ].map((stage, idx) => {
                    const isCurrent = (selectedAuditForDetails.status === 'Completed' ? 'Approved' : selectedAuditForDetails.status) === stage.key;
                    return (
                      <div
                        key={stage.key}
                        className={`p-3 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'border-sky-500 bg-sky-50/10 dark:border-sky-400 shadow-xs'
                            : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Stage {idx + 1}</span>
                          {isCurrent && <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md block text-center uppercase ${
                          isCurrent ? stage.activeBadge : stage.badge
                        }`}>
                          {stage.key}
                        </span>
                        
                        {/* Display mock stage detail info */}
                        <div className="mt-3 space-y-1 text-[9px] text-gray-400">
                          <p className="truncate font-semibold text-gray-700 dark:text-zinc-300">
                            👤 {isCurrent ? selectedAuditForDetails.auditorName : 'System Operator'}
                          </p>
                          <p>📅 {selectedAuditForDetails.scheduledDate}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pipeline Controls */}
                <div className="flex justify-between items-center border-t border-gray-50 dark:border-zinc-800/85 pt-4">
                  <button
                    id="btn-revert-workflow-stage"
                    onClick={() => handleWorkflowRevert(selectedAuditForDetails.id)}
                    className="h-9 rounded-lg border border-gray-100 hover:bg-gray-50 text-xs font-bold text-gray-600 px-4 transition-colors dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-300"
                  >
                    ← Revert Stage
                  </button>

                  <button
                    id="btn-advance-workflow-stage"
                    onClick={() => handleWorkflowAdvance(selectedAuditForDetails.id)}
                    className="h-9 rounded-lg bg-sky-700 hover:bg-sky-800 text-xs font-bold text-white px-5 transition-colors shadow-xs"
                  >
                    Advance Stage →
                  </button>
                </div>
              </div>

              {/* Multi-Level Sign-Off Checklist & Action Panel */}
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Pending review authorization block */}
                <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Operational Audit Authorization Sign-Off</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Provide official sign-off on inspection reports or reject them to trigger field corrections.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block">Sign-Off Role Capacity</label>
                        <select
                          value={approverRole}
                          onChange={(e) => setApproverRole(e.target.value)}
                          className="w-full h-9 rounded-lg border border-gray-100 bg-white px-2.5 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-950 text-gray-900 dark:text-white"
                        >
                          <option value="Audit Manager">Audit Manager (Supervisor)</option>
                          <option value="Operations Manager">Operations Director</option>
                          <option value="Regional Quality Assurance">Regional QA Lead</option>
                          <option value="Client Representative">Client Representative</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block">Operator Signature Credential</label>
                        <input
                          type="text"
                          disabled
                          value="ELENA ROSTOVA (SECURE_SESSION_LOCKED)"
                          className="w-full h-9 rounded-lg border border-gray-50 bg-gray-50 text-gray-400 px-2.5 text-xs outline-none dark:border-zinc-850 dark:bg-zinc-950"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase block">Audit Verification Comments / Corrective Actions</label>
                      <textarea
                        rows={3}
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder="Document verified parameters, compliance rating, or specific reasons for rejection/correction..."
                        className="w-full rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-xs outline-none focus:border-sky-500 dark:border-zinc-855 dark:bg-zinc-955 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="btn-reject-verification"
                        onClick={() => handleRejectStep(selectedAuditForDetails.id)}
                        className="flex-1 h-10 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-colors dark:bg-rose-955/20 dark:text-rose-400"
                      >
                        Reject &amp; Force Corrections
                      </button>

                      <button
                        id="btn-approve-verification"
                        onClick={() => handleApproveStep(selectedAuditForDetails.id)}
                        className="flex-1 h-10 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                      >
                        Grant Sign-Off Approval
                      </button>
                    </div>
                  </div>
                </div>

                {/* Completed review approvals log */}
                <div className="md:col-span-1 bg-white rounded-3xl border border-gray-100 p-6 dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Cascading Sign-Off Log</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">Authorized sign-offs submitted for this audit.</p>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {approvalHistory.filter(h => h.auditId === selectedAuditForDetails.id).length === 0 ? (
                      <div className="py-8 text-center text-[10px] text-gray-400">
                        No signature records found. Pending first reviewer sign-off.
                      </div>
                    ) : (
                      approvalHistory.filter(h => h.auditId === selectedAuditForDetails.id).map((hist) => (
                        <div key={hist.id} className="p-3 border border-gray-50 dark:border-zinc-800 rounded-xl space-y-1 bg-gray-50/30 dark:bg-zinc-950/20 text-[10px]">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">{hist.role}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                              hist.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/25 dark:text-rose-400'
                            }`}>{hist.status}</span>
                          </div>
                          <p className="text-gray-400">By: {hist.operator} • {hist.timestamp}</p>
                          <p className="text-gray-500 dark:text-zinc-350 font-medium leading-normal bg-white dark:bg-zinc-905 p-2 rounded mt-1.5 border border-gray-50/50 dark:border-zinc-800/40">
                            💬 {hist.comments}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* --- Audits Schedule Overview --- */
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
              <div className="p-5 border-b border-gray-50 dark:border-zinc-800/80">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Active Inspections Schedule</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Select any scheduled row to view visual timeline and sign-off status.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold dark:bg-zinc-800/40 dark:text-zinc-400 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">Company Facility</th>
                      <th className="px-6 py-3.5">Inspection Standard</th>
                      <th className="px-6 py-3.5">Assigned Inspector</th>
                      <th className="px-6 py-3.5">Scheduled Date</th>
                      <th className="px-6 py-3.5">Audit Progress</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Launch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                    {audits.map(aud => (
                      <tr
                        key={aud.id}
                        onClick={() => setSelectedAuditForDetails(aud)}
                        className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          <p>{aud.companyName}</p>
                          <span className="text-[10px] font-normal text-gray-400 dark:text-zinc-500">{aud.facilityName}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-zinc-400 font-semibold">{aud.templateName}</td>
                        <td className="px-6 py-4 text-gray-400">{aud.auditorName}</td>
                        <td className="px-6 py-4 text-gray-400">{aud.scheduledDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[10px]">{aud.progress}%</span>
                            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden dark:bg-zinc-800 shrink-0">
                              <div className="h-full bg-sky-600" style={{ width: `${aud.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 font-bold rounded uppercase text-[9px] ${
                            aud.status === 'Completed' || aud.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40'
                          }`}>{aud.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {aud.status === 'Completed' || aud.status === 'Approved' ? (
                            <span className="text-[10px] text-gray-400">Score: {aud.score || 85}/100</span>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleLaunchAudit(aud); }}
                              className="text-sky-700 hover:underline font-bold text-[11px] dark:text-sky-400"
                            >
                              Launch Checkpoint
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ====================================================
          FINDINGS MODULE
          ==================================================== */}
      {adminTab === 'findings' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Corrective Action Findings Ledger</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Physical non-conformance elements logged during site inspections.</p>
            </div>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-9 rounded-lg border border-gray-100 bg-white px-3 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <option value="All">All Severity Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {findings.filter(f => severityFilter === 'All' || f.severity === severityFilter).map(find => (
              <div key={find.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col justify-between dark:bg-zinc-900 dark:border-zinc-800">
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                      find.severity === 'Critical' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' :
                      find.severity === 'High' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                      'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400'
                    }`}>{find.severity}</span>

                    <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 ${
                      find.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-700'
                    }`}>{find.status}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-normal">{find.title}</h4>
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">Facility: {find.facilityName}</p>
                  </div>

                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-normal bg-gray-50/50 p-2.5 rounded-lg dark:bg-zinc-950/55">{find.description}</p>
                  
                  <div className="space-y-1 text-[10px] text-gray-400 border-t border-gray-50 pt-3 dark:border-zinc-800/40">
                    <p>• Responsible: <span className="font-semibold text-gray-700 dark:text-zinc-300">{find.responsiblePerson}</span></p>
                    <p>• Due Date: <span className="font-semibold text-rose-600 dark:text-rose-400">{find.dueDate}</span></p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50/50 border-t border-gray-100 dark:bg-zinc-950 dark:border-zinc-850 flex justify-end">
                  {find.status !== 'Resolved' ? (
                    <button
                      onClick={() => handleResolveFinding(find.id)}
                      className="flex items-center gap-1 bg-sky-700 text-white rounded px-3 py-1.5 text-[10px] font-bold hover:bg-sky-800"
                    >
                      <Check className="h-3 w-3" /> Mark Corrected
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Approved Resolution
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}


      {/* ====================================================
          REPORTS MODULE
          ==================================================== */}
      {adminTab === 'reports' && (
        <div className="space-y-6">
          
          {activeReport ? (
            /* --- Detailed Report Page --- */
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-6 dark:bg-zinc-900 dark:border-zinc-800">
              
              <div className="flex flex-wrap justify-between items-start border-b border-gray-50 pb-4 dark:border-zinc-850 gap-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-100 dark:border-sky-950">COMPLIANCE DIAGNOSTICS REPORT</span>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-2">{activeReport.title}</h3>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1">Entity: {activeReport.companyName} • Site: {activeReport.facilityName} • Date: {activeReport.date}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadPdf(activeReport.title)}
                    className="flex items-center gap-1 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg px-3.5 py-2 text-xs"
                  >
                    {isGeneratingPdf ? 'Compiling PDF...' : 'Download PDF Certificate'} <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveReport(null)}
                    className="rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-500 px-3 py-2 text-xs dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    Close Sheet
                  </button>
                </div>
              </div>

              {/* Report Stats */}
              <div className="grid sm:grid-cols-3 gap-6">
                
                <div className="p-4 rounded-2xl border border-gray-50 bg-slate-900 text-white space-y-2 dark:bg-zinc-950">
                  <p className="text-[9px] font-bold uppercase text-slate-400 leading-none">OVERALL HYGIENE SCORE</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-sky-400">{activeReport.overallScore}</span>
                    <span className="text-xs text-slate-400">/ 100 max</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">Derived from critical vs standard parameters weight indices.</p>
                </div>

                <div className="p-4 rounded-2xl border border-gray-100 bg-white space-y-2 dark:bg-zinc-900 dark:border-zinc-800">
                  <p className="text-[9px] font-bold uppercase text-gray-400 leading-none dark:text-zinc-500">COMPLIANCE PERCENTAGE</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{activeReport.compliancePercentage}%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">Ratio of pass checklist objectives verified by EHS team.</p>
                </div>

                <div className="p-4 rounded-2xl border border-gray-100 bg-white space-y-2 dark:bg-zinc-900 dark:border-zinc-800">
                  <p className="text-[9px] font-bold uppercase text-gray-400 leading-none dark:text-zinc-500">OPERATIONAL RISK RATING</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-extrabold ${
                      activeReport.riskRating === 'Low' ? 'text-emerald-600' : activeReport.riskRating === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                    }`}>{activeReport.riskRating} Risk</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">Deficiency risk map based on open correction items.</p>
                </div>

              </div>

              {/* Sections Breakdown & Recommendations */}
              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Audit Section Scores Breakdown</h4>
                  <div className="space-y-2">
                    {activeReport.sectionScores.map(sc => (
                      <div key={sc.sectionId} className="p-3.5 border border-gray-50 rounded-xl bg-gray-50/50 dark:bg-zinc-950 dark:border-zinc-850">
                        <div className="flex justify-between items-center text-xs">
                          <p className="font-bold text-gray-900 dark:text-white">{sc.title}</p>
                          <span className="font-mono font-bold text-sky-700 dark:text-sky-400">{sc.score} / 100</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2 overflow-hidden dark:bg-zinc-800">
                          <div className="h-full bg-sky-600" style={{ width: `${sc.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accredited Recommendations</h4>
                  <div className="p-5 border border-gray-100 rounded-2xl space-y-3 bg-white dark:bg-zinc-900 dark:border-zinc-800">
                    {activeReport.recommendations.map((rec, rIdx) => (
                      <div key={rIdx} className="flex gap-2.5 text-xs text-gray-600 dark:text-zinc-400 items-start">
                        <span className="h-5 w-5 rounded bg-sky-50 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px] dark:bg-sky-950 dark:text-sky-300">{rIdx + 1}</span>
                        <p className="leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* --- Reports Directory --- */
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
              <div className="p-5 border-b border-gray-50 dark:border-zinc-800/80">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Reports Repository</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Official compliance logs and score sheets published post-audit.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold dark:bg-zinc-800/40 dark:text-zinc-400 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">Report Title</th>
                      <th className="px-6 py-3.5">Facility Site</th>
                      <th className="px-6 py-3.5">Date Compiled</th>
                      <th className="px-6 py-3.5">Overall Rating</th>
                      <th className="px-6 py-3.5">Risk Rating</th>
                      <th className="px-6 py-3.5 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                    {reports.map(rep => (
                      <tr
                        key={rep.id}
                        onClick={() => setActiveReport(rep)}
                        className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <FileText className="h-4 w-4 text-sky-600 shrink-0" />
                          {rep.title}
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-zinc-400 font-semibold">{rep.facilityName}</td>
                        <td className="px-6 py-4 text-gray-400">{rep.date}</td>
                        <td className="px-6 py-4 font-mono font-bold text-sky-700 dark:text-sky-400">{rep.overallScore}/100 Score</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 font-bold rounded ${
                            rep.riskRating === 'Low' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-700'
                          }`}>{rep.riskRating} Risk</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveReport(rep); }}
                            className="text-sky-700 hover:underline dark:text-sky-400 font-bold text-[11px]"
                          >
                            Analyze
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ====================================================
          CALENDAR VIEW
          ==================================================== */}
      {adminTab === 'calendar' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-sans">Corporate Inspection Agenda</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Track field visits, pre-audits, and laboratory tests schedules.</p>
            </div>
            
            <div className="flex gap-2">
              {['All', 'audit', 'consultation', 'training'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedCalendarFilter(filter as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize ${
                    selectedCalendarFilter === filter
                      ? 'bg-sky-700 text-white'
                      : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800'
                  }`}
                >
                  {filter}s
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Visual calendar month representation */}
            <div className="md:col-span-2 bg-white p-5 rounded-3xl border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-4 dark:border-zinc-800">
                <span className="text-xs font-extrabold text-gray-900 dark:text-white">June / July 2026</span>
                <span className="text-[10px] text-gray-400">Monthly Matrix</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-400 mb-2 uppercase">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {/* Pad days */}
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={`pad-${idx}`} className="h-12 bg-gray-50/20 rounded dark:bg-zinc-950/20" />
                ))}
                {/* Month Days */}
                {Array.from({ length: 30 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                  const hasEvents = calendarEvents.filter(e => e.date === dateStr);

                  return (
                    <div
                      key={idx}
                      className={`h-12 border rounded p-1 flex flex-col justify-between transition-colors ${
                        hasEvents.length > 0
                          ? 'border-sky-200 bg-sky-50/20 dark:border-sky-900 dark:bg-sky-950/20'
                          : 'border-gray-50 hover:bg-gray-50 dark:border-zinc-800/40 dark:hover:bg-zinc-800/70'
                      }`}
                    >
                      <span className="text-[9px] font-mono text-gray-400">{dayNum}</span>
                      {hasEvents.map(evt => (
                        <span key={evt.id} className="h-1.5 w-1.5 rounded-full bg-sky-600 block self-end" title={evt.title} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List Agenda sidebar */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scheduled Events Logs</h4>
              
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {calendarEvents
                  .filter(e => selectedCalendarFilter === 'All' || e.type === selectedCalendarFilter)
                  .map(evt => (
                    <div key={evt.id} className="p-3 border border-gray-50 rounded-xl bg-gray-50/40 text-xs dark:bg-zinc-950 dark:border-zinc-850">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-mono font-bold uppercase text-sky-700 bg-sky-50 px-1.5 rounded dark:bg-sky-950/40 dark:text-sky-300">
                          {evt.type}
                        </span>
                        <span className="text-[9px] text-gray-400">{evt.date}</span>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white leading-tight">{evt.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{evt.details}</p>
                    </div>
                  ))}
              </div>
            </div>

          </div>

        </div>
      )}


      {/* ====================================================
          TASKS MODULE
          ==================================================== */}
      {adminTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Operational Task Checklist</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Log administrative checklists and assign responsibilities.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {['To Do', 'In Progress', 'Completed'].map(columnStatus => (
              <div key={columnStatus} className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2 dark:border-zinc-800/80">
                  <h4 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wide">{columnStatus}</h4>
                  <span className="text-[9px] font-mono bg-gray-100 text-gray-500 px-1.5 rounded dark:bg-zinc-800 dark:text-zinc-400">
                    {tasks.filter(t => t.status === columnStatus).length} tasks
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {tasks.filter(t => t.status === columnStatus).map(tsk => (
                    <div key={tsk.id} className="p-3 border border-gray-50 rounded-xl bg-gray-50/50 hover:shadow-xs transition-shadow dark:bg-zinc-950 dark:border-zinc-850">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-xs text-gray-950 dark:text-white leading-normal">{tsk.title}</p>
                        <span className={`text-[8px] font-bold px-1.5 rounded uppercase ${
                          tsk.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-gray-100 text-gray-500'
                        }`}>{tsk.priority}</span>
                      </div>
                      {tsk.description && <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 leading-normal">{tsk.description}</p>}
                      <div className="mt-3 flex justify-between items-center text-[9px] text-gray-400">
                        <span>Due: {tsk.dueDate}</span>
                        <select
                          value={tsk.status}
                          onChange={(e) => {
                            setTasks(tasks.map(t => t.id === tsk.id ? { ...t, status: e.target.value as any } : t));
                            showToast(`Task status changed to ${e.target.value}.`);
                          }}
                          className="bg-transparent border-none outline-none font-semibold text-sky-700 dark:text-sky-400 cursor-pointer text-[9px]"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ====================================================
          SETTINGS VIEW
          ==================================================== */}
      {adminTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-6 max-w-2xl mx-auto dark:bg-zinc-900 dark:border-zinc-800">
          <div className="border-b border-gray-50 pb-3 dark:border-zinc-850">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">System Settings</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Customize workspace thresholds and profile parameters.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); showToast('Settings saved.'); }} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Your Name</label>
                <input
                  type="text"
                  value={settingsForm.profileName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, profileName: e.target.value })}
                  className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={settingsForm.profileEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, profileEmail: e.target.value })}
                  className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Organization Node</label>
              <input
                type="text"
                value={settingsForm.orgName}
                onChange={(e) => setSettingsForm({ ...settingsForm, orgName: e.target.value })}
                className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 outline-none focus:border-sky-500 dark:border-zinc-850 dark:bg-zinc-950"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4 dark:border-zinc-800">
              <div>
                <h5 className="font-bold text-gray-900 dark:text-white">Enable Real-Time Dispatch alerts</h5>
                <p className="text-[10px] text-gray-400 mt-0.5">Send immediate browser alerts when high-risk findings are logged.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsForm.enableNotifications}
                onChange={(e) => setSettingsForm({ ...settingsForm, enableNotifications: e.target.checked })}
                className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
            </div>

            <button type="submit" className="w-full rounded-xl bg-sky-700 py-3 text-xs font-bold text-white hover:bg-sky-800 transition-all">
              Commit Configuration Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
