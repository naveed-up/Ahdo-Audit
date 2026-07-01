import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Import our business logic service and data types
import {
  calculateScore,
  WORKFLOW_STAGES_ORDER,
  getNextStage,
  getPreviousStage
} from './src/services/enterpriseServices.js';

import {
  MOCK_COMPANIES,
  MOCK_SERVICES,
  MOCK_AUDIT_TEMPLATES,
  MOCK_AUDITS,
  MOCK_FINDINGS,
  MOCK_REPORTS,
  MOCK_CALENDAR_EVENTS,
  MOCK_TASKS
} from './src/data.js';

import {
  Company,
  Service,
  AuditTemplate,
  Audit,
  Finding,
  Report,
  CalendarEvent,
  Task,
  ScoringRule,
  ApprovalFlow,
  ApprovalStep,
  ApprovalHistory,
  WorkflowStage,
  ActivityLog
} from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db_state.json');

// Interface for persistent DB state
interface DatabaseState {
  companies: Company[];
  services: Service[];
  templates: AuditTemplate[];
  audits: Audit[];
  findings: Finding[];
  reports: Report[];
  calendarEvents: CalendarEvent[];
  tasks: Task[];
  scoringRules: ScoringRule[];
  approvalFlows: ApprovalFlow[];
  approvalHistory: ApprovalHistory[];
  workflowStages: WorkflowStage[];
  activityLogs: ActivityLog[];
}

let db: DatabaseState = {
  companies: [],
  services: [],
  templates: [],
  audits: [],
  findings: [],
  reports: [],
  calendarEvents: [],
  tasks: [],
  scoringRules: [],
  approvalFlows: [],
  approvalHistory: [],
  workflowStages: [],
  activityLogs: []
};

// Seeding standard configurations if they don't exist
function seedDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('Database loaded successfully from file system. Records:');
      console.log(`- Audits: ${db.audits.length}, Templates: ${db.templates.length}`);
      return;
    } catch (err) {
      console.error('Error reading db_state.json, falling back to seeding', err);
    }
  }

  // Seed with standard mock data
  db.companies = [...MOCK_COMPANIES];
  db.services = [...MOCK_SERVICES];
  db.templates = [...MOCK_AUDIT_TEMPLATES];
  db.audits = [...MOCK_AUDITS];
  db.findings = [...MOCK_FINDINGS];
  db.reports = [...MOCK_REPORTS];
  db.calendarEvents = [...MOCK_CALENDAR_EVENTS];
  db.tasks = [...MOCK_TASKS];

  // Initialize scoring rules for mock templates
  db.templates.forEach((temp) => {
    const weightedSections = temp.sections.map((sec, index) => {
      // split 100% roughly between sections
      const count = temp.sections.length;
      const base = Math.floor(100 / count);
      const weight = index === count - 1 ? 100 - base * (count - 1) : base;
      return {
        sectionId: sec.id,
        sectionTitle: sec.title,
        weight
      };
    });

    db.scoringRules.push({
      id: 'score-' + temp.id,
      templateId: temp.id,
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

    // Initialize approval flows for mock templates
    db.approvalFlows.push({
      id: 'flow-' + temp.id,
      templateId: temp.id,
      steps: [
        { role: 'Auditor', order: 1, approvalRequired: true, commentRequired: true, notificationRequired: true },
        { role: 'Audit Manager', order: 2, approvalRequired: true, commentRequired: true, notificationRequired: true },
        { role: 'Operations Manager', order: 3, approvalRequired: true, commentRequired: true, notificationRequired: true },
        { role: 'Client Representative', order: 4, approvalRequired: true, commentRequired: false, notificationRequired: true }
      ]
    });
  });

  // Initialize workflow stages for mock audits
  db.audits.forEach((aud) => {
    // Standard initial timeline for audits
    const stages: WorkflowStage[] = WORKFLOW_STAGES_ORDER.map((stg, i) => {
      let isCurrent = false;
      let date = aud.scheduledDate;
      let comments = 'Automatic staging initialized.';
      let responsible = aud.auditorName;

      // map audit status to stages
      if (aud.status === 'Completed' && stg === 'Closed') {
        isCurrent = true;
        date = aud.completedDate || aud.scheduledDate;
        comments = 'Audit completed and closed successfully.';
      } else if (aud.status === 'In Progress' && stg === 'In Progress') {
        isCurrent = true;
        comments = 'Inspection active on checklist checkpoints.';
      } else if (aud.status === 'Under Review' && stg === 'Under Review') {
        isCurrent = true;
        comments = 'Audit under assessment by manager.';
      } else if (aud.status === 'Scheduled' && stg === 'Assigned') {
        isCurrent = true;
        comments = 'Audit assigned to inspector.';
      } else if (aud.status === 'Scheduled' && i === 0) {
        // Fallback
        isCurrent = false;
      }

      return {
        id: `stg-${aud.id}-${stg.toLowerCase().replace(/\s+/g, '-')}`,
        auditId: aud.id,
        status: stg as WorkflowStage['status'],
        responsiblePerson: responsible,
        date,
        comments,
        isCurrent
      };
    });

    // If no current is set, set the first one
    if (!stages.some(s => s.isCurrent)) {
      stages[0].isCurrent = true;
    }

    db.workflowStages.push(...stages);
  });

  saveDB();
  console.log('Seeded database with standard enterprise workflows, scoring rules, and templates.');
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db_state.json', err);
  }
}

seedDB();

// ==========================================
// REST API CONTROLLERS / ENDPOINTS
// ==========================================

// Helper to support both with and without /api prefix
const addEndpoints = (route: string, handler: express.RequestHandler, method: 'get' | 'post' | 'put' | 'delete' = 'get') => {
  app[method](route, handler);
  app[method](`/api${route}`, handler);
};

// ---- SYSTEM HEALTH ----
addEndpoints('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ---- DATA SEED FETCHER FOR FRONTEND ----
addEndpoints('/db-state', (req, res) => {
  res.json({ status: 'success', data: db });
});

// ---- AUDITS CRUD INTEGRATION ----
addEndpoints('/audits', (req, res) => {
  res.json(db.audits);
});

// ==========================================
// 1. AUDIT WORKFLOW ENDPOINTS
// ==========================================

// GET /workflow: get all workflow stages (optionally filtered by auditId)
addEndpoints('/workflow', (req, res) => {
  const { auditId } = req.query;
  if (auditId) {
    const filtered = db.workflowStages.filter(ws => ws.auditId === auditId);
    return res.json(filtered);
  }
  res.json(db.workflowStages);
});

// POST /workflow: create new workflow stage
addEndpoints('/workflow', (req, res) => {
  const { auditId, status, responsiblePerson, comments, date } = req.body;
  if (!auditId || !status) {
    return res.status(400).json({ error: 'Missing required parameters auditId or status' });
  }

  const newWS: WorkflowStage = {
    id: 'ws-' + Date.now(),
    auditId,
    status,
    responsiblePerson: responsiblePerson || 'System Administrator',
    date: date || new Date().toISOString().split('T')[0],
    comments: comments || '',
    isCurrent: true
  };

  // Mark other stages for this audit as non-current
  db.workflowStages = db.workflowStages.map(ws => {
    if (ws.auditId === auditId) {
      return { ...ws, isCurrent: false };
    }
    return ws;
  });

  db.workflowStages.push(newWS);
  saveDB();

  res.status(201).json({ status: 'success', data: newWS });
}, 'post');

// PUT /workflow/:id: update a stage
addEndpoints('/workflow/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  let found = false;
  db.workflowStages = db.workflowStages.map(ws => {
    if (ws.id === id) {
      found = true;
      return { ...ws, ...updates };
    }
    return ws;
  });

  if (!found) {
    return res.status(404).json({ error: 'Workflow stage not found' });
  }

  saveDB();
  res.json({ status: 'success', message: 'Workflow stage updated' });
}, 'put');

// POST /workflow/next: Move workflow to next stage
addEndpoints('/workflow/next', (req, res) => {
  const { auditId, operator, comments } = req.body;
  if (!auditId) {
    return res.status(400).json({ error: 'Missing auditId' });
  }

  // Find audit
  const auditIndex = db.audits.findIndex(a => a.id === auditId);
  if (auditIndex === -1) {
    return res.status(404).json({ error: 'Audit not found' });
  }
  const audit = db.audits[auditIndex];

  // Get current active stage
  const auditStages = db.workflowStages.filter(ws => ws.auditId === auditId);
  const currentStageObj = auditStages.find(ws => ws.isCurrent);
  if (!currentStageObj) {
    return res.status(400).json({ error: 'No active workflow stage found for this audit' });
  }

  const nextStage = getNextStage(currentStageObj.status);
  if (!nextStage) {
    return res.status(400).json({ error: 'Workflow is already at the final stage' });
  }

  // Update current stages to non-current
  db.workflowStages = db.workflowStages.map(ws => {
    if (ws.auditId === auditId) {
      if (ws.status === nextStage) {
        return {
          ...ws,
          isCurrent: true,
          date: new Date().toISOString().split('T')[0],
          comments: comments || `Advanced to ${nextStage}`,
          responsiblePerson: operator || currentStageObj.responsiblePerson
        };
      }
      return { ...ws, isCurrent: false };
    }
    return ws;
  });

  // Create Activity Log
  const log: ActivityLog = {
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    auditId,
    fromStatus: currentStageObj.status,
    toStatus: nextStage,
    timestamp: new Date().toISOString(),
    operator: operator || 'System Administrator',
    comments: comments || `Staged advanced from ${currentStageObj.status} to ${nextStage}`
  };
  db.activityLogs.push(log);

  // Sync audit status
  let finalStatus: Audit['status'] = audit.status;
  if (nextStage === 'Draft') finalStatus = 'Scheduled';
  else if (nextStage === 'Assigned') finalStatus = 'Scheduled';
  else if (nextStage === 'In Progress') finalStatus = 'In Progress';
  else if (nextStage === 'Submitted') finalStatus = 'Under Review';
  else if (nextStage === 'Under Review') finalStatus = 'Under Review';
  else if (nextStage === 'Approved') finalStatus = 'Completed';
  else if (nextStage === 'Shared with Client') finalStatus = 'Completed';
  else if (nextStage === 'Closed') finalStatus = 'Completed';

  db.audits[auditIndex].status = finalStatus;

  saveDB();

  res.json({
    status: 'success',
    currentStage: nextStage,
    auditStatus: finalStatus,
    timeline: db.workflowStages.filter(ws => ws.auditId === auditId),
    logs: db.activityLogs.filter(l => l.auditId === auditId)
  });
}, 'post');

// POST /workflow/back: Move workflow to previous stage
addEndpoints('/workflow/back', (req, res) => {
  const { auditId, operator, comments } = req.body;
  if (!auditId) {
    return res.status(400).json({ error: 'Missing auditId' });
  }

  const auditIndex = db.audits.findIndex(a => a.id === auditId);
  if (auditIndex === -1) {
    return res.status(404).json({ error: 'Audit not found' });
  }
  const audit = db.audits[auditIndex];

  const auditStages = db.workflowStages.filter(ws => ws.auditId === auditId);
  const currentStageObj = auditStages.find(ws => ws.isCurrent);
  if (!currentStageObj) {
    return res.status(400).json({ error: 'No active workflow stage found for this audit' });
  }

  const prevStage = getPreviousStage(currentStageObj.status);
  if (!prevStage) {
    return res.status(400).json({ error: 'Workflow is already at the first stage' });
  }

  // Update current stages
  db.workflowStages = db.workflowStages.map(ws => {
    if (ws.auditId === auditId) {
      if (ws.status === prevStage) {
        return {
          ...ws,
          isCurrent: true,
          date: new Date().toISOString().split('T')[0],
          comments: comments || `Reverted back to ${prevStage}`,
          responsiblePerson: operator || currentStageObj.responsiblePerson
        };
      }
      return { ...ws, isCurrent: false };
    }
    return ws;
  });

  // Create Activity Log
  const log: ActivityLog = {
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    auditId,
    fromStatus: currentStageObj.status,
    toStatus: prevStage,
    timestamp: new Date().toISOString(),
    operator: operator || 'System Administrator',
    comments: comments || `Staged reverted from ${currentStageObj.status} to ${prevStage}`
  };
  db.activityLogs.push(log);

  // Sync audit status
  let finalStatus: Audit['status'] = audit.status;
  if (prevStage === 'Draft') finalStatus = 'Scheduled';
  else if (prevStage === 'Assigned') finalStatus = 'Scheduled';
  else if (prevStage === 'In Progress') finalStatus = 'In Progress';
  else if (prevStage === 'Submitted') finalStatus = 'Under Review';
  else if (prevStage === 'Under Review') finalStatus = 'Under Review';
  else if (prevStage === 'Approved') finalStatus = 'Completed';
  else if (prevStage === 'Shared with Client') finalStatus = 'Completed';
  else if (prevStage === 'Closed') finalStatus = 'Completed';

  db.audits[auditIndex].status = finalStatus;

  saveDB();

  res.json({
    status: 'success',
    currentStage: prevStage,
    auditStatus: finalStatus,
    timeline: db.workflowStages.filter(ws => ws.auditId === auditId),
    logs: db.activityLogs.filter(l => l.auditId === auditId)
  });
}, 'post');

// ==========================================
// 2. SCORING ENGINE ENDPOINTS
// ==========================================

// GET /scoring-rules: get all rules
addEndpoints('/scoring-rules', (req, res) => {
  const { templateId } = req.query;
  if (templateId) {
    const rule = db.scoringRules.find(r => r.templateId === templateId);
    return res.json(rule ? [rule] : []);
  }
  res.json(db.scoringRules);
});

// POST /scoring-rules: create new rules
addEndpoints('/scoring-rules', (req, res) => {
  const { templateId, scoringMethod, complianceThreshold, criticalFailureEnabled, weightedSections, riskLevels } = req.body;
  if (!templateId || !scoringMethod) {
    return res.status(400).json({ error: 'Missing required parameters templateId or scoringMethod' });
  }

  const existingIdx = db.scoringRules.findIndex(r => r.templateId === templateId);

  const rule: ScoringRule = {
    id: existingIdx !== -1 ? db.scoringRules[existingIdx].id : 'rule-' + Date.now(),
    templateId,
    scoringMethod,
    complianceThreshold: complianceThreshold || 80,
    criticalFailureEnabled: criticalFailureEnabled !== undefined ? criticalFailureEnabled : true,
    weightedSections: weightedSections || [],
    riskLevels: riskLevels || {
      low: { label: 'Low Risk', threshold: 85, color: 'Green' },
      medium: { label: 'Medium Risk', threshold: 70, color: 'Yellow' },
      high: { label: 'High Risk', threshold: 50, color: 'Orange' },
      critical: { label: 'Critical Risk', threshold: 0, color: 'Red' }
    }
  };

  if (existingIdx !== -1) {
    db.scoringRules[existingIdx] = rule;
  } else {
    db.scoringRules.push(rule);
  }

  saveDB();
  res.status(201).json({ status: 'success', data: rule });
}, 'post');

// PUT /scoring-rules/:id: update scoring rule
addEndpoints('/scoring-rules/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  let found = false;
  db.scoringRules = db.scoringRules.map(r => {
    if (r.id === id || r.templateId === id) {
      found = true;
      return { ...r, ...updates };
    }
    return r;
  });

  if (!found) {
    return res.status(404).json({ error: 'Scoring rule not found' });
  }

  saveDB();
  res.json({ status: 'success', message: 'Scoring rule updated' });
}, 'put');

// POST /calculate-score: Core calculation service endpoint
addEndpoints('/calculate-score', (req, res) => {
  const { auditId, templateId } = req.body;
  if (!auditId) {
    return res.status(400).json({ error: 'Missing auditId' });
  }

  const audit = db.audits.find(a => a.id === auditId);
  if (!audit) {
    return res.status(404).json({ error: 'Audit not found' });
  }

  const templateIdToUse = templateId || audit.templateId;
  const template = db.templates.find(t => t.id === templateIdToUse);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  // Find scoring rule or construct default
  let rule = db.scoringRules.find(r => r.templateId === templateIdToUse);
  if (!rule) {
    const weightedSections = template.sections.map(sec => ({
      sectionId: sec.id,
      sectionTitle: sec.title,
      weight: Math.round(100 / template.sections.length)
    }));
    rule = {
      id: 'rule-temp',
      templateId: templateIdToUse,
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
    };
  }

  // Calculate using service layer
  const calculation = calculateScore(audit, template, rule);

  // Update audit score & state
  db.audits = db.audits.map(a => {
    if (a.id === auditId) {
      return { ...a, score: calculation.overallScore };
    }
    return a;
  });

  // Check if report exists, update or create it
  const reportIndex = db.reports.findIndex(r => r.auditId === auditId);
  const updatedReport: Report = {
    id: reportIndex !== -1 ? db.reports[reportIndex].id : 'rep-' + Date.now(),
    auditId,
    title: `${audit.companyName} - Official Audit Verification Report`,
    companyName: audit.companyName,
    facilityName: audit.facilityName,
    auditorName: audit.auditorName,
    date: new Date().toISOString().split('T')[0],
    overallScore: calculation.overallScore,
    compliancePercentage: calculation.compliancePercentage,
    riskRating: calculation.riskRating,
    recommendations: [
      'Conduct follow-up inspections on any failed parameters.',
      calculation.overallScore < rule.complianceThreshold
        ? 'ALERT: Compliance threshold unmet. Urgent preventive measures recommended.'
        : 'Sustained standard operations conforming to the audit directives.'
    ],
    sectionScores: calculation.sectionScores
  };

  if (reportIndex !== -1) {
    db.reports[reportIndex] = updatedReport;
  } else {
    db.reports.push(updatedReport);
  }

  saveDB();

  res.json({
    status: 'success',
    score: calculation.overallScore,
    compliancePercentage: calculation.compliancePercentage,
    riskRating: calculation.riskRating,
    sectionScores: calculation.sectionScores,
    report: updatedReport
  });
}, 'post');

// ==========================================
// 3. APPROVAL WORKFLOW ENDPOINTS
// ==========================================

// GET /approval-flow: get approval flow details
addEndpoints('/approval-flow', (req, res) => {
  const { templateId } = req.query;
  if (templateId) {
    const flow = db.approvalFlows.find(af => af.templateId === templateId);
    return res.json(flow ? [flow] : []);
  }
  res.json(db.approvalFlows);
});

// POST /approval-flow: create or update approval steps
addEndpoints('/approval-flow', (req, res) => {
  const { templateId, steps } = req.body;
  if (!templateId || !steps) {
    return res.status(400).json({ error: 'Missing required parameters templateId or steps' });
  }

  const existingIdx = db.approvalFlows.findIndex(f => f.templateId === templateId);

  const flow: ApprovalFlow = {
    id: existingIdx !== -1 ? db.approvalFlows[existingIdx].id : 'flow-' + Date.now(),
    templateId,
    steps: steps.map((s: any, i: number) => ({
      role: s.role,
      order: s.order || i + 1,
      approvalRequired: s.approvalRequired !== undefined ? s.approvalRequired : true,
      commentRequired: s.commentRequired !== undefined ? s.commentRequired : false,
      notificationRequired: s.notificationRequired !== undefined ? s.notificationRequired : true,
      nextStep: s.nextStep
    }))
  };

  if (existingIdx !== -1) {
    db.approvalFlows[existingIdx] = flow;
  } else {
    db.approvalFlows.push(flow);
  }

  saveDB();
  res.status(201).json({ status: 'success', data: flow });
}, 'post');

// PUT /approval-flow/:id: update approval step directly
addEndpoints('/approval-flow/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  let found = false;
  db.approvalFlows = db.approvalFlows.map(af => {
    if (af.id === id || af.templateId === id) {
      found = true;
      return { ...af, ...updates };
    }
    return af;
  });

  if (!found) {
    return res.status(404).json({ error: 'Approval flow not found' });
  }

  saveDB();
  res.json({ status: 'success', message: 'Approval flow updated' });
}, 'put');

// POST /approve: Approve current step of the Audit
addEndpoints('/approve', (req, res) => {
  const { auditId, role, comments, operator } = req.body;
  if (!auditId || !role) {
    return res.status(400).json({ error: 'Missing auditId or role' });
  }

  const auditIndex = db.audits.findIndex(a => a.id === auditId);
  if (auditIndex === -1) {
    return res.status(404).json({ error: 'Audit not found' });
  }
  const audit = db.audits[auditIndex];

  // Get approval flow for the template
  const flow = db.approvalFlows.find(f => f.templateId === audit.templateId);
  const steps = flow ? flow.steps.sort((a, b) => a.order - b.order) : [];

  // Find approval history for this audit
  const auditHistory = db.approvalHistory.filter(h => h.auditId === auditId);

  // Find current step order
  let currentStepOrder = 1;
  const lastApprovedStep = [...auditHistory]
    .filter(h => h.status === 'Approved')
    .sort((a, b) => b.stepOrder - a.stepOrder)[0];

  if (lastApprovedStep) {
    currentStepOrder = lastApprovedStep.stepOrder + 1;
  }

  // Verify role matching
  const currentStep = steps.find(s => s.order === currentStepOrder);
  if (!currentStep) {
    return res.status(400).json({ error: 'No active approval step available for this audit' });
  }

  if (currentStep.role !== role) {
    return res.status(400).json({ error: `Invalid approver. Current step requires: ${currentStep.role}, but got: ${role}` });
  }

  // Check comments
  if (currentStep.commentRequired && !comments) {
    return res.status(400).json({ error: 'Comments are required for this approval level' });
  }

  // Create approval record
  const approvalRecord: ApprovalHistory = {
    id: 'apph-' + Date.now(),
    auditId,
    stepOrder: currentStepOrder,
    role,
    status: 'Approved',
    approver: operator || 'System Approver',
    comments: comments || 'Approved',
    timestamp: new Date().toISOString()
  };
  db.approvalHistory.push(approvalRecord);

  // Move to next step or finalize
  const nextPendingStep = steps.find(s => s.order === currentStepOrder + 1);
  let workflowUpdated = false;
  let newWorkflowStage = '';

  if (!nextPendingStep) {
    // Final approved!
    // Set workflow stage to Approved
    db.workflowStages = db.workflowStages.map(ws => {
      if (ws.auditId === auditId) {
        if (ws.status === 'Approved') {
          workflowUpdated = true;
          newWorkflowStage = 'Approved';
          return {
            ...ws,
            isCurrent: true,
            date: new Date().toISOString().split('T')[0],
            comments: 'All approval workflow levels cleared successfully.',
            responsiblePerson: operator || 'Operations Board'
          };
        }
        return { ...ws, isCurrent: false };
      }
      return ws;
    });

    db.audits[auditIndex].status = 'Completed';

    // Activity Log
    db.activityLogs.push({
      id: 'log-' + Date.now(),
      auditId,
      fromStatus: 'Under Review',
      toStatus: 'Approved',
      timestamp: new Date().toISOString(),
      operator: operator || 'Operations Board',
      comments: 'Final sign-off achieved. Audit approved.'
    });
  } else {
    // Notify or move slightly
    // Activity Log of step approval
    db.activityLogs.push({
      id: 'log-' + Date.now(),
      auditId,
      fromStatus: 'Under Review',
      toStatus: 'Under Review',
      timestamp: new Date().toISOString(),
      operator: operator || 'Manager',
      comments: `Step ${currentStepOrder} approved by ${role}. Pending step: ${nextPendingStep.role}`
    });
  }

  saveDB();

  res.json({
    status: 'success',
    approvedStep: currentStep,
    nextStep: nextPendingStep || null,
    history: db.approvalHistory.filter(h => h.auditId === auditId),
    auditStatus: db.audits[auditIndex].status,
    currentWorkflowStage: newWorkflowStage || 'Under Review'
  });
}, 'post');

// POST /reject: Reject current step and roll back
addEndpoints('/reject', (req, res) => {
  const { auditId, role, comments, operator } = req.body;
  if (!auditId || !role) {
    return res.status(400).json({ error: 'Missing auditId or role' });
  }

  const auditIndex = db.audits.findIndex(a => a.id === auditId);
  if (auditIndex === -1) {
    return res.status(404).json({ error: 'Audit not found' });
  }

  // Verify there is an active step to reject
  const flow = db.approvalFlows.find(f => f.templateId === db.audits[auditIndex].templateId);
  const steps = flow ? flow.steps.sort((a, b) => a.order - b.order) : [];
  const auditHistory = db.approvalHistory.filter(h => h.auditId === auditId);

  let currentStepOrder = 1;
  const lastApprovedStep = [...auditHistory]
    .filter(h => h.status === 'Approved')
    .sort((a, b) => b.stepOrder - a.stepOrder)[0];

  if (lastApprovedStep) {
    currentStepOrder = lastApprovedStep.stepOrder + 1;
  }

  const currentStep = steps.find(s => s.order === currentStepOrder);
  if (!currentStep) {
    return res.status(400).json({ error: 'No active approval step available for this audit' });
  }

  // Create rejection record
  const rejectionRecord: ApprovalHistory = {
    id: 'apph-' + Date.now(),
    auditId,
    stepOrder: currentStepOrder,
    role,
    status: 'Rejected',
    approver: operator || 'System Approver',
    comments: comments || 'Rejected due to findings discrepancies.',
    timestamp: new Date().toISOString()
  };
  db.approvalHistory.push(rejectionRecord);

  // Roll back workflow stage to In Progress or Draft
  db.workflowStages = db.workflowStages.map(ws => {
    if (ws.auditId === auditId) {
      if (ws.status === 'In Progress') {
        return {
          ...ws,
          isCurrent: true,
          date: new Date().toISOString().split('T')[0],
          comments: `Audit REJECTED during approval phase by ${role}. Reason: ${comments || 'No comment provided.'}`,
          responsiblePerson: db.audits[auditIndex].auditorName
        };
      }
      return { ...ws, isCurrent: false };
    }
    return ws;
  });

  db.audits[auditIndex].status = 'In Progress';

  // Activity Log
  db.activityLogs.push({
    id: 'log-' + Date.now(),
    auditId,
    fromStatus: 'Under Review',
    toStatus: 'In Progress',
    timestamp: new Date().toISOString(),
    operator: operator || role,
    comments: `Rejection action. Audit returned to In Progress stage. Comments: ${comments}`
  });

  saveDB();

  res.json({
    status: 'success',
    rejectedStep: currentStep,
    history: db.approvalHistory.filter(h => h.auditId === auditId),
    auditStatus: 'In Progress'
  });
}, 'post');


// ==========================================
// VITE DEV SERVER OR STATIC SERVING IN PROD
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Static files serve mounted for production.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
