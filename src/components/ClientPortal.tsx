/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Award,
  Clock,
  Layers,
  GraduationCap,
  FileCheck,
  LifeBuoy,
  Download,
  AlertTriangle,
  CheckCircle,
  Plus,
  Send,
  X,
  CreditCard,
  Check
} from 'lucide-react';
import {
  Company,
  Audit,
  Finding,
  Report,
  Task
} from '../types';

interface ClientPortalProps {
  clientTab: string;
  setClientTab: (tab: string) => void;
  reports: Report[];
  audits: Audit[];
  findings: Finding[];
}

export default function ClientPortal({
  clientTab,
  setClientTab,
  reports,
  audits,
  findings
}: ClientPortalProps) {
  // Mock logged-in client company info (Grand Hyatt Executive Resort)
  const clientCompany = {
    id: 'co-3',
    name: 'Grand Hyatt Executive Resort',
    industry: 'Hospitality',
    status: 'Active',
    joinedDate: '2024-03-01'
  };

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- MY REPORTS ---
  const myReports = reports.filter(r => r.companyName.includes('Hyatt'));
  const myAudits = audits.filter(a => a.companyId === 'co-3');
  const myFindings = findings.filter(f => f.companyId === 'co-3');

  // --- CERTIFICATES ---
  const [myCertificates, setMyCertificates] = useState([
    { id: 'cert-1', name: 'AHDO Gold Safety Standard - Kitchens & Buffets', issued: '2026-03-12', expires: '2027-03-12', status: 'Active', code: 'AHDO-GOLD-9921' },
    { id: 'cert-2', name: 'Water Purity Safety Clearance', issued: '2026-03-15', expires: '2027-03-15', status: 'Active', code: 'AHDO-H2O-4011' }
  ]);

  // --- TRAINING ---
  const [trainingModules, setTrainingModules] = useState([
    { id: 'tr-1', name: 'HACCP Food Safety Principle for Kitchen Staff', progress: 75, status: 'In Progress', code: 'HAC-STAFF' },
    { id: 'tr-2', name: 'Allergen Isolation & Labeling protocol', progress: 100, status: 'Completed', code: 'ALLER-9' },
    { id: 'tr-3', name: 'OSHA Kitchen Structural Hazard Prevention', progress: 0, status: 'Not Started', code: 'OSHA-KIT' }
  ]);

  // --- INVOICES ---
  const [invoices, setInvoices] = useState([
    { id: 'inv-1', title: 'Onsite Kitchen Safety Audit - June 2026', amount: '$1,850.00', date: '2026-06-28', status: 'Pending Payment' },
    { id: 'inv-2', title: 'EHS Standard Corporate Subscription - Annual', amount: '$4,200.00', date: '2026-03-01', status: 'Paid' }
  ]);

  // --- SUPPORT ---
  const [supportTickets, setSupportTickets] = useState([
    { id: 't-1', subject: 'Inquire about Bluetooth Refrigerator Sensors', body: 'We are looking to transition to Bluetooth automatic temperature sensors. Can AHDO help calibrate our central EHS dashboard?', status: 'Replied by EHS Expert' }
  ]);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketBody, setNewTicketBody] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject) return;

    const created = {
      id: `t-${Date.now()}`,
      subject: newTicketSubject,
      body: newTicketBody,
      status: 'Awaiting Assignment'
    };

    setSupportTickets([created, ...supportTickets]);
    setNewTicketSubject('');
    setNewTicketBody('');
    triggerToast('EHS Support ticket created. An expert investigator will contact you shortly.');
  };

  const handlePayInvoice = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    triggerToast('Payment cleared successfully via simulated Stripe Gateway.');
  };

  const handleDownloadPdf = (title: string) => {
    triggerToast(`Downloading ${title}.pdf compliant sheet to downloads directory...`);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full transition-colors text-xs">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl dark:bg-zinc-900 dark:border-zinc-850 border border-slate-800">
          <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-950 to-slate-950 p-6 rounded-xl text-white mb-8 relative overflow-hidden shadow-sm border border-slate-800/25">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10 space-y-2">
          <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-400/20 px-2.5 py-1 rounded-full uppercase">Client Workspace Access</span>
          <h2 className="text-lg font-black text-white">{clientCompany.name}</h2>
          <p className="text-[10px] text-slate-400 font-medium">Industry: Hospitality • EHS Registered Member Since {clientCompany.joinedDate}</p>
        </div>
      </div>

      {/* ====================================================
          CLIENT PORTAL DASHBOARD
          ==================================================== */}
      {clientTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Certificates', val: myCertificates.length, color: 'text-blue-600' },
              { label: 'Unresolved Findings', val: myFindings.filter(f => f.status !== 'Resolved').length, color: 'text-rose-600' },
              { label: 'Total Audits Run', val: myAudits.length, color: 'text-violet-600' },
              { label: 'Staff Training Progress', val: '66% avg', color: 'text-indigo-600' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{stat.label}</span>
                <span className={`text-2xl font-bold block mt-2.5 ${stat.color} dark:text-zinc-100`}>{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Active Action Plans / High Priority Findings */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 dark:border-zinc-800/80">
                <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Corrective Actions Agenda</h4>
                <button onClick={() => setClientTab('corrective')} className="text-blue-600 font-bold hover:underline">View All</button>
              </div>

              <div className="space-y-3">
                {myFindings.length === 0 ? (
                  <p className="text-center py-6 text-slate-400">Perfect safety! No current EHS findings are logged.</p>
                ) : (
                  myFindings.slice(0, 2).map(find => (
                    <div key={find.id} className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 dark:bg-zinc-950 dark:border-zinc-850">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-slate-800 dark:text-white leading-normal">{find.title}</p>
                        <span className="text-[8px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded uppercase">{find.severity}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 dark:text-zinc-400">{find.description}</p>
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-between items-center text-[10px] text-slate-400 dark:border-zinc-800/45">
                        <span>Responsible: {find.responsiblePerson}</span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">Due: {find.dueDate}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Official published certificates */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 dark:border-zinc-800/80">
                <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Active Certifications</h4>
                <button onClick={() => setClientTab('certificates')} className="text-blue-600 font-bold hover:underline">Verify Badge</button>
              </div>

              <div className="space-y-3">
                {myCertificates.map(cert => (
                  <div key={cert.id} className="flex gap-4 items-center justify-between p-3.5 border border-blue-100 rounded-lg bg-blue-50/10 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex gap-3 items-center">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{cert.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">ID: {cert.code} • Expires on: {cert.expires}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 rounded">Active</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}


      {/* ====================================================
          MY REPORTS
          ==================================================== */}
      {clientTab === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 animate-fade-in">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800/80">
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Operational Audit Reports</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Review scores, recommendations, and evidence compiled by AHDO scientists.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold dark:bg-zinc-800/40 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Audit Title</th>
                  <th className="px-6 py-3.5">Inspected Facility</th>
                  <th className="px-6 py-3.5">Published Date</th>
                  <th className="px-6 py-3.5">Overall Score</th>
                  <th className="px-6 py-3.5">Compliance Index</th>
                  <th className="px-6 py-3.5 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {myReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No published reports registered. Check after active inspections submit.</td>
                  </tr>
                ) : (
                  myReports.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                        {rep.title}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-zinc-400 font-semibold">{rep.facilityName}</td>
                      <td className="px-6 py-4 text-slate-400">{rep.date}</td>
                      <td className="px-6 py-4 font-mono font-bold text-blue-700 dark:text-blue-400">{rep.overallScore}/100 Score</td>
                      <td className="px-6 py-4 font-semibold text-slate-500 dark:text-zinc-400">{rep.compliancePercentage}% score</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownloadPdf(rep.title)}
                          className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold rounded-lg px-2.5 py-1 text-[10px] ml-auto hover:bg-blue-100 transition-colors"
                        >
                          Download <Download className="h-3 w-3" />
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


      {/* ====================================================
          CERTIFICATES
          ==================================================== */}
      {clientTab === 'certificates' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">EHS Verification Badges</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Physical stamps and QR validation codes showing absolute compliance standards.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {myCertificates.map(cert => (
              <div key={cert.id} className="bg-white rounded-xl border border-blue-100 p-6 space-y-4 shadow-sm relative overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/5 blur-xl" />
                <div className="flex justify-between items-start">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded dark:bg-blue-950 dark:text-blue-300 uppercase">
                    Validated Stamp
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-xs leading-normal">{cert.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Registry ID: {cert.code}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-zinc-850/80 text-[10px] text-slate-400">
                  <div>
                    <p>Issued Date</p>
                    <p className="font-bold text-slate-800 dark:text-zinc-200 mt-0.5">{cert.issued}</p>
                  </div>
                  <div>
                    <p>Expiration Date</p>
                    <p className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">{cert.expires}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadPdf(cert.name)}
                  className="w-full rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold py-2.5 text-xs text-center transition-colors dark:bg-blue-950 dark:text-blue-300"
                >
                  Download Certificate PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ====================================================
          AUDIT HISTORY
          ==================================================== */}
      {clientTab === 'audits' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 animate-fade-in">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800/85">
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Facility Inspection Ledger</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Historical list of both scheduled and completed onsite safety checks.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold dark:bg-zinc-800/40 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Facility Site</th>
                  <th className="px-6 py-3.5">Auditing Standard</th>
                  <th className="px-6 py-3.5">Accredited Lead Auditor</th>
                  <th className="px-6 py-3.5">Scheduled Date</th>
                  <th className="px-6 py-3.5">Safety Rating</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {myAudits.map(aud => (
                  <tr key={aud.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{aud.facilityName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-500 dark:text-zinc-400">{aud.templateName}</td>
                    <td className="px-6 py-4 text-slate-400">{aud.auditorName}</td>
                    <td className="px-6 py-4 text-slate-400">{aud.scheduledDate}</td>
                    <td className="px-6 py-4">
                      {aud.score ? (
                        <span className="font-mono font-bold text-blue-700 dark:text-blue-400">{aud.score}/100 score</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 font-bold rounded text-[10px] ${
                        aud.status === 'Completed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40' : 'bg-amber-50 text-amber-700'
                      }`}>{aud.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ====================================================
          CORRECTIVE ACTIONS (FINDINGS)
          ==================================================== */}
      {clientTab === 'corrective' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Corrective Action Plans (EHS-CAP)</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Please review safety findings and upload resolution logs before the target dates.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {myFindings.map(find => (
              <div key={find.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    find.severity === 'Critical' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-amber-50 text-amber-700'
                  }`}>{find.severity} Severity</span>

                  <span className={`text-[9px] font-bold rounded px-2 py-0.5 ${
                    find.status === 'Resolved' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40' : 'bg-rose-50 text-rose-700'
                  }`}>{find.status}</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-850 dark:text-white text-xs leading-normal">{find.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Facility: {find.facilityName}</p>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal bg-slate-50/50 p-2.5 rounded-lg dark:bg-zinc-950/50">{find.description}</p>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 dark:border-zinc-850/80 text-[10px] text-slate-400">
                  <div>
                    <p>Responsible Officer</p>
                    <p className="font-bold text-slate-850 dark:text-zinc-200 mt-0.5">{find.responsiblePerson}</p>
                  </div>
                  <div>
                    <p>Target Resolution Due</p>
                    <p className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">{find.dueDate}</p>
                  </div>
                </div>

                {find.status !== 'Resolved' ? (
                  <button
                    onClick={() => {
                      find.status = 'Resolved';
                      triggerToast('Document Upload Complete: Compliance evidence submitted for AHDO review.');
                    }}
                    className="w-full flex items-center justify-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 text-xs transition-colors"
                  >
                    Upload Corrective Evidence
                  </button>
                ) : (
                  <span className="w-full block py-2.5 text-center text-xs font-bold text-blue-600 bg-blue-50 rounded-lg dark:bg-blue-950/40">
                    ✓ Closed &amp; Approved by EHS
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ====================================================
          TRAINING MODULES
          ==================================================== */}
      {clientTab === 'training' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Accredited Training Dashboard</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Ensure your frontline kitchen and EHS supervisors complete these certifications.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {trainingModules.map(mod => (
              <div key={mod.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded dark:bg-blue-950/40 dark:text-blue-300">
                  <span>{mod.code}</span>
                  <span>{mod.status}</span>
                </div>

                <h4 className="font-bold text-slate-850 dark:text-white text-xs leading-normal">{mod.name}</h4>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>Completeness progress</span>
                    <span>{mod.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-zinc-800">
                    <div className="h-full bg-blue-600" style={{ width: `${mod.progress}%` }} />
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerToast(`Launching simulated course: ${mod.name}...`);
                  }}
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 text-xs transition-colors"
                >
                  {mod.progress === 100 ? 'Review Slides' : mod.progress === 0 ? 'Start Course' : 'Resume Lectures'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ====================================================
          INVOICES MODULE
          ==================================================== */}
      {clientTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 animate-fade-in">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800/80">
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Corporate Billing Statement</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Pay scheduled audit fees and download printable tax invoices.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold dark:bg-zinc-800/40 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Invoice Description</th>
                  <th className="px-6 py-3.5">Amount Due</th>
                  <th className="px-6 py-3.5">Due/Paid Date</th>
                  <th className="px-6 py-3.5">Payment Status</th>
                  <th className="px-6 py-3.5 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{inv.title}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-white">{inv.amount}</td>
                    <td className="px-6 py-4 text-slate-400">{inv.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 font-bold rounded text-[10px] ${
                        inv.status === 'Paid' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40' : 'bg-rose-50 text-rose-700'
                      }`}>{inv.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status === 'Paid' ? (
                        <span className="text-[10px] font-semibold text-blue-600">✓ Received</span>
                      ) : (
                        <button
                          onClick={() => handlePayInvoice(inv.id)}
                          className="flex items-center gap-1 bg-blue-600 text-white font-bold rounded-lg px-3 py-1.5 text-[10px] hover:bg-blue-700 transition-colors ml-auto"
                        >
                          <CreditCard className="h-3 w-3" /> Pay Now
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


      {/* ====================================================
          SUPPORT & HELP
          ==================================================== */}
      {clientTab === 'support' && (
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
          
          <div className="md:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-xs">Direct EHS Expert Hotline</h4>
            <p className="text-[10px] text-slate-500 leading-normal font-medium">
              Need physical calibration support, pre-audit consultations, or certifiedPathology guidelines? Ask our lead scientists.
            </p>
            <div className="space-y-1.5 text-[10px] text-slate-500 pt-3 border-t border-slate-100 dark:border-zinc-850">
              <p>• Hotline: <span className="font-semibold text-slate-800 dark:text-zinc-200">+1 (800) 555-AHDO</span></p>
              <p>• Emergency Pathologist Email: <span className="font-semibold text-slate-800 dark:text-zinc-200">scientists@ahdo.org</span></p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6 dark:bg-zinc-900 dark:border-zinc-800">
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Submit Priority EHS Inquiry</h4>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Inquiry Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule pre-audit for Oceanside Main Spa"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-blue-500 dark:border-zinc-850 dark:bg-zinc-950 text-xs"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Provide Operational Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain facility sizing, chemical types, or target standards..."
                  value={newTicketBody}
                  onChange={(e) => setNewTicketBody(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-blue-500 dark:border-zinc-850 dark:bg-zinc-950 text-xs"
                ></textarea>
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-xs transition-colors">
                <Send className="h-3.5 w-3.5" /> Dispatch Inquiry
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 dark:border-zinc-800/80 space-y-3">
              <h5 className="font-bold text-[10px] text-slate-400">Past Support Log</h5>
              {supportTickets.map(ticket => (
                <div key={ticket.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 dark:bg-zinc-950 dark:border-zinc-850">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-850 dark:text-white">{ticket.subject}</p>
                    <span className="text-[8px] font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded uppercase">{ticket.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 dark:text-zinc-400 leading-relaxed font-medium">{ticket.body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
