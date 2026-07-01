/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
  Globe,
  Award,
  Users,
  ChevronRight,
  BookOpen,
  FileText,
  Activity,
  Zap,
  Server,
  Fingerprint,
  TrendingUp,
  X,
  Compass
} from 'lucide-react';

interface CorporateWebsiteProps {
  onLoginSuccess: (email: string, role: 'admin' | 'client') => void;
  onRequestConsultation: () => void;
}

export default function CorporateWebsite({
  onLoginSuccess,
  onRequestConsultation
}: CorporateWebsiteProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'industries' | 'training' | 'resources' | 'contact' | 'login'>('home');
  const [email, setEmail] = useState('admin@ahdo.org');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showConsultDialog, setShowConsultDialog] = useState(false);
  const [consultationSuccess, setConsultationSuccess] = useState(false);

  // Form states for contact and consult
  const [consultForm, setConsultForm] = useState({ name: '', company: '', email: '', industry: 'Healthcare', message: '' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto detect role based on email domain
    const role = email.includes('client') ? 'client' : 'admin';
    onLoginSuccess(email, role);
  };

  const servicesList = [
    { id: 'fs', name: 'Food Safety Audit', code: 'ISO 22000', icon: Shield, desc: 'Complete review of culinary facilities, kitchens, storage structures, and ingredient logs to certify compliance with global HACCP guidelines.', details: 'Ensuring pristine supply chains and chemical/microbial containment fields.' },
    { id: 'ws', name: 'Water Quality & Safety', code: 'WHO standards', icon: Activity, desc: 'Advanced microbiological and chemical composition testing of facility tap networks, filtration chambers, and effluent drainage.', details: 'Continuous flow testing, legionella screening, and trace metal scanning.' },
    { id: 'pc', name: 'Integrated Pest Management', code: 'IPM-V1', icon: Zap, desc: 'Proactive detection mapping, structural shielding assessments, and eco-certified pest exclusion audits tailored for production facilities.', details: 'Digital trap telemetry integrations, trend analysis, and perimeter logs.' },
    { id: 'fa', name: 'Facility Safety & OSHA', code: 'OSHA 1910', icon: Server, desc: 'Full mechanical engineering audits, electrical safety inspection, emergency egress validation, and fire hazard zoning.', details: 'Strict review of safety guards on heavy machinery and equipment maintenance certificates.' },
    { id: 'cs', name: 'Compliance Consulting', code: 'GAP Analysis', icon: Compass, desc: 'Bespoke strategic assessments and pre-audit dry-runs to map out pathways toward official certifications and premium safety scores.', details: 'Comprehensive GAP reports, corrective workflows, and liaison assistance.' },
    { id: 'tr', name: 'EHS Enterprise Training', code: 'Certified Courses', icon: BookOpen, desc: 'Interactive classroom and laboratory training modules on biohazard containment, food pathogens, and workplace ergonomics.', details: 'Digital certificate issuance, course tracking, and localized onsite seminars.' },
    { id: 'cr', name: 'Safety Certification', code: 'AHDO Gold Shield', icon: Award, desc: 'The industry-standard premium badge displaying flawless compliance across chemical, biological, and structural inspection domains.', details: 'Public-facing certificate registry, quarterly maintenance checkups, and logo rights.' },
    { id: 've', name: 'Independent Verification', code: 'Unscheduled ISO 9001', icon: Fingerprint, desc: 'Third-party, surprise validation protocols on sterile labs, pharmaceutical clean rooms, and surgical centers.', details: 'Tamper-proof log updates, blockchain records, and senior inspector sign-offs.' }
  ];

  const industriesList = [
    { name: 'Food & Agriculture', desc: 'Silos, cold storage complexes, food processing packaging plants, and global dining locations.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80' },
    { name: 'Healthcare & Biotech', desc: 'Intensive care units, clinical sterile laboratories, research clean rooms, and outpatient surgical centers.', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80' },
    { name: 'Hospitality & Leisure', desc: 'Luxury resorts, commercial kitchens, multi-tier buffets, high-density spas, and recreational zones.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80' },
    { name: 'Manufacturing & Heavy Industry', desc: 'Metal foundries, chemical processors, high-temperature fabrication shops, and assembly facilities.', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80' },
    { name: 'Construction & Mining', desc: 'Civil infrastructure worksites, excavation blocks, and chemical staging corridors under OSHA rules.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80' },
    { name: 'Government & Public Transit', desc: 'Subway networks, transit maintenance depots, federal office quarters, and water filtration facilities.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80' }
  ];

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationSuccess(true);
    setTimeout(() => {
      setShowConsultDialog(false);
      setConsultationSuccess(false);
      setConsultForm({ name: '', company: '', email: '', industry: 'Healthcare', message: '' });
    }, 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-200 flex flex-col font-sans transition-colors">
      
      {/* 1. PUBLIC HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 font-mono text-lg font-black text-white">
              AH
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-gray-900 dark:text-white leading-none">
                AHDO
              </span>
              <span className="text-[10px] font-bold tracking-widest text-sky-600 dark:text-sky-400 uppercase mt-0.5">
                ADVANCED HEALTH
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {['home', 'about', 'services', 'industries', 'training', 'resources', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-xs font-semibold capitalize tracking-wide transition-colors ${
                  activeTab === tab
                    ? 'text-sky-700 dark:text-sky-400'
                    : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('login')}
              id="btn-nav-login"
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setShowConsultDialog(true)}
              id="btn-nav-consult"
              className="rounded-lg bg-sky-700 px-4 py-2 text-xs font-bold text-white hover:bg-sky-800 shadow-sm transition-all"
            >
              Consultation
            </button>
          </div>

        </div>
      </header>

      {/* 2. BODY VIEWS */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              key="home"
              className="space-y-24 pb-20"
            >
              
              {/* SECTION 1: HERO */}
              <section className="relative overflow-hidden bg-radial from-slate-900 via-slate-950 to-black text-white px-6 py-28 md:py-36 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
                <div className="absolute inset-0 opacity-15">
                  <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-sky-500 blur-3xl" />
                  <div className="absolute top-1/2 right-10 h-80 w-80 rounded-full bg-emerald-500 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-5xl text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-300 border border-sky-500/20 mb-6">
                    <Shield className="h-3.5 w-3.5" /> Globally Trusted EHS Compliance Operations
                  </span>
                  
                  <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl text-white max-w-4xl mx-auto leading-tight md:leading-[1.1]">
                    Advanced Health &amp; Operational Decontamination Standards
                  </h1>
                  
                  <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                    AHDO provides enterprise SaaS compliance auditing, independent laboratory validation, and corrective workflow infrastructure for the world’s most secure facilities.
                  </p>

                  <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => setShowConsultDialog(true)}
                      className="group flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-xs font-bold text-white hover:bg-sky-500 shadow-lg shadow-sky-950/50 hover:shadow-sky-500/10 transition-all"
                    >
                      Request Onsite Consultation
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="rounded-xl border border-slate-700 bg-slate-900/40 px-6 py-3.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                    >
                      Connect with EHS Expert
                    </button>
                  </div>

                  <div className="mt-20 border-t border-slate-800 pt-10 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto text-left">
                    <div>
                      <h4 className="text-3xl font-black text-sky-400">12,400+</h4>
                      <p className="text-xs text-slate-400 mt-1">Facility Audits Executed</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-sky-400">99.94%</h4>
                      <p className="text-xs text-slate-400 mt-1">Microbiological Clearance</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-sky-400">45 Countries</h4>
                      <p className="text-xs text-slate-400 mt-1">International EHS Ingress</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-sky-400">ISO-17025</h4>
                      <p className="text-xs text-slate-400 mt-1">Certified Clean-Lab Systems</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: ABOUT */}
              <section className="mx-auto max-w-7xl px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                      Scientific Leadership
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                      Strengthening Operational Integrity For Over 20 Years
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                      AHDO (Advanced Health Development Organization) operates at the vital nexus of biotechnology, food systems, clinical hygiene, and environmental engineering. We help modern conglomerates safeguard their operations, mitigate chemical hazards, and verify cleanliness using secure SaaS tracking systems.
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-gray-950 dark:text-white">Autonomous Laboratory Audits</p>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-500 mt-0.5">Physical and records-based diagnostics run by certified chemists and biohazard personnel.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-gray-950 dark:text-white">Durable Corrective Ledgering</p>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-500 mt-0.5">Secure, real-time logging of workplace hazards, assigning EHS leads, and logging compliance closure.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80"
                      alt="AHDO Clean Laboratory"
                      className="rounded-2xl shadow-xl w-full object-cover h-96 border border-gray-100 dark:border-zinc-800"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white rounded-xl p-5 shadow-lg max-w-xs hidden sm:block">
                      <p className="text-xs font-bold">"AHDO’s audit systems saved our facility from 3 crucial OSHA shutdowns in 2025."</p>
                      <p className="text-[10px] text-emerald-200 mt-2">— VP of EHS, Vertex Foods</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: WHY CHOOSE AHDO */}
              <section className="bg-gray-100/50 py-20 px-6 dark:bg-zinc-900/40">
                <div className="mx-auto max-w-7xl text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                    Proven Efficacy
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-2">
                    Engineered For High-Risk Enterprise Ecosystems
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto">
                    Corporate audit failures don’t just cause financial loss—they threaten lives. Here is why premium operators trust AHDO:
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto text-left">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs dark:bg-zinc-900 dark:border-zinc-800/80">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 mb-4">
                        <Users className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-950 dark:text-white">Elite Auditor Ingress</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 leading-relaxed">
                        Every AHDO audit team is led by a registered EHS Lead Auditor with a minimum of 10 years experience in clinical sanitization and regulatory defense.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs dark:bg-zinc-900 dark:border-zinc-800/80">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 mb-4">
                        <Compass className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-950 dark:text-white">Active Regulatory Tracking</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 leading-relaxed">
                        Our templates are automatically updated with the latest FDA, HACCP, OSHA, and global ISO guidelines, eliminating legal compliance gaps.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs dark:bg-zinc-900 dark:border-zinc-800/80">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 mb-4">
                        <Award className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-950 dark:text-white">Durable Blockchain Stamp</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 leading-relaxed">
                        Final safety certificates and score logs carry an encrypted signature stamp, protecting your organization during regulatory reviews.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: SERVICES */}
              <section className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-12">
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                    SGS-Inspired Verification
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-2">
                    Corporate Verification &amp; Certification Services
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto">
                    Select any enterprise domain to request physical onsite checkups and audit templates:
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {servicesList.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <div key={srv.id} className="group flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:hover:border-zinc-700">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono tracking-wider text-sky-700 dark:text-sky-400 font-bold uppercase bg-sky-50 px-2 py-0.5 rounded dark:bg-sky-950/40">
                              {srv.code}
                            </span>
                            <IconComp className="h-4 w-4 text-gray-400 dark:text-zinc-500 group-hover:text-sky-600 transition-colors" />
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-4">{srv.name}</h4>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-2 leading-relaxed">{srv.desc}</p>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-3 border-t border-gray-50 pt-2 dark:border-zinc-800">
                            {srv.details}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setConsultForm({ ...consultForm, message: `Requesting service: ${srv.name}` });
                            setShowConsultDialog(true);
                          }}
                          className="mt-5 flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                          Book Service <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SECTION 5: INDUSTRIES */}
              <section className="bg-slate-900 text-white py-20 px-6 dark:bg-zinc-950">
                <div className="mx-auto max-w-7xl">
                  <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                      Sector Focus
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white mt-2">
                      Securing Diverse Industrial Ecosystems
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {industriesList.map((ind, i) => (
                      <div key={i} className="group relative overflow-hidden rounded-2xl h-80 shadow-lg border border-slate-800">
                        <img
                          src={ind.image}
                          alt={ind.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/45 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h4 className="text-base font-bold text-white">{ind.name}</h4>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{ind.desc}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Standards <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 6: OUR PROCESS */}
              <section className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-12">
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                    Execution Framework
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-2">
                    Pragmatic Quality Assurance In 6 Steps
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 relative mt-16">
                  {[
                    { nr: '01', title: 'Consultation', text: 'Onsite interview to map facility parameters and scope critical EHS areas.' },
                    { nr: '02', title: 'Planning', text: 'Tailoring compliance audit checklist, assigning accredited lead auditor.' },
                    { nr: '03', title: 'Audit Execution', text: 'Real-time on-field facility scan using tablet-optimized checklists.' },
                    { nr: '04', title: 'Reporting', text: 'Immediate compilation of safety scores, non-conformance logs, and photos.' },
                    { nr: '05', title: 'Certification', text: 'Issuing official AHDO compliance certificate with encrypted stamp.' },
                    { nr: '06', title: 'Follow-up', text: 'Tracking corrective actions, restocking alerts, and repeat safety audits.' }
                  ].map((step, idx) => (
                    <div key={idx} className="relative bg-white p-6 rounded-2xl border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800/80">
                      <span className="text-3xl font-black text-sky-100 dark:text-zinc-800 block">
                        {step.nr}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-2">{step.title}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 leading-normal">{step.text}</p>
                      
                      {idx < 5 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-gray-300 dark:text-zinc-800">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 7: TESTIMONIALS */}
              <section className="mx-auto max-w-5xl px-6">
                <div className="rounded-3xl bg-sky-950 p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
                  
                  <div className="relative text-center space-y-6">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-sky-300">Enterprise Feedback</span>
                    <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                      "With AHDO’s dynamic checklist system, our outpatient staff cleared microbiological safety testing in record time. The reports are audit-ready, preventing regulatory delays and protecting our patient safety reputation."
                    </p>
                    <div>
                      <h5 className="font-bold text-sm text-white">Chief Medical Officer</h5>
                      <p className="text-[11px] text-sky-300">St. Jude Regional Healthcare System</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 8: PARTNERS / SPONSORS */}
              <section className="mx-auto max-w-7xl px-6 border-t border-gray-100 pt-12 dark:border-zinc-900">
                <p className="text-center text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-8">
                  Cooperating Standards Organizations
                </p>
                <div className="flex flex-wrap items-center justify-center gap-12 opacity-65 dark:opacity-40">
                  <span className="font-mono text-xs font-bold tracking-widest text-slate-500">WHO_COMPLIANT</span>
                  <span className="font-mono text-xs font-bold tracking-widest text-slate-500">ISO_22000_REG</span>
                  <span className="font-mono text-xs font-bold tracking-widest text-slate-500">OSHA_AFFILIATE</span>
                  <span className="font-mono text-xs font-bold tracking-widest text-slate-500">HACCP_VERIFIED</span>
                  <span className="font-mono text-xs font-bold tracking-widest text-slate-500">EHS_LEAD_COUNCIL</span>
                </div>
              </section>

              {/* SECTION 9: CONTACT CTA */}
              <section className="mx-auto max-w-4xl px-6 text-center">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Secure Your Enterprise Operations Today</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 max-w-lg mx-auto">
                  Schedule an on-site facility health and biological risk audit with AHDO’s accredited inspectors.
                </p>
                <button
                  onClick={() => setShowConsultDialog(true)}
                  className="mt-6 rounded-xl bg-sky-700 px-6 py-3 text-xs font-bold text-white hover:bg-sky-800 shadow-sm transition-all"
                >
                  Schedule Site Consultation
                </button>
              </section>

            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="about"
              className="mx-auto max-w-4xl px-6 py-12 space-y-8"
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">About AHDO</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                Advanced Health Development Organization (AHDO) was founded to deliver absolute clarity in environmental and biological safety audits. We work as independent verifiers for healthcare systems, food factories, manufacturing giants, and transit operators, ensuring pristine hygiene and hazard control.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="p-5 border border-gray-100 rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-sky-700 dark:text-sky-400">Our Mission</h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 leading-normal">
                    To eliminate operational health hazards through scientific excellence, structured inspect templates, and rapid corrective action tracking.
                  </p>
                </div>
                <div className="p-5 border border-gray-100 rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-sky-700 dark:text-sky-400">Our Network</h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 leading-normal">
                    Over 500 accredited EHS inspectors strategically stationed globally to carry out unscheduled cold-chain and clinical sanitization checks.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="services"
              className="mx-auto max-w-7xl px-6 py-12"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">Comprehensive EHS Catalogue</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesList.map((srv) => {
                  const IconComp = srv.icon;
                  return (
                    <div key={srv.id} className="bg-white p-6 rounded-2xl border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-sky-600 dark:text-sky-400">{srv.code}</span>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{srv.name}</h4>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-3 leading-relaxed">{srv.desc}</p>
                      <ul className="mt-4 space-y-1.5 border-t border-gray-50 pt-3 dark:border-zinc-800 text-[10px] text-gray-400 dark:text-zinc-500">
                        <li>• Certified standards auditing</li>
                        <li>• Tablet-optimized active inspector checklists</li>
                        <li>• Automatic digital finding logs and corrective schedules</li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'industries' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="industries"
              className="mx-auto max-w-7xl px-6 py-12"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">Custom Sector Protocols</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {industriesList.map((ind, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                    <img src={ind.image} alt={ind.name} className="w-full h-48 object-cover" />
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{ind.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 leading-relaxed">{ind.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'training' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="training"
              className="mx-auto max-w-4xl px-6 py-12 space-y-6"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Accredited EHS Certification Training</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                Empower your operational staff with certified training programs led by AHDO’s principal scientists and inspectors.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'HACCP Principle Masterclass', duration: '3 Days Onsite', code: 'TR-HACCP-1' },
                  { title: 'Chemical Biohazard Isolation Protocol', duration: '1 Day Lab Session', code: 'TR-CHEM-3' },
                  { title: 'Emergency Egress & Fire Prevention Zoning', duration: 'Online Modules', code: 'TR-OSHA-9' }
                ].map((course, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
                    <div>
                      <span className="text-[9px] font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded dark:bg-sky-950 dark:text-sky-300 font-bold">{course.code}</span>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1">{course.title}</h4>
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">Duration: {course.duration}</p>
                    </div>
                    <button onClick={() => setShowConsultDialog(true)} className="rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 px-3.5 py-1.5 text-xs font-bold dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/40">
                      Register
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="resources"
              className="mx-auto max-w-4xl px-6 py-12 space-y-6 text-center"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Compliance Resource Center</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Download whitepapers, draft checklists, and chemical inventory excel models created by our EHS specialists.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto pt-6">
                <div className="p-5 border border-gray-100 rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
                  <FileText className="h-6 w-6 text-sky-600 mb-2" />
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">ISO 22000 Draft Checklist</h4>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1">Free 50-point draft covering basic cold-storage integrity.</p>
                  <button className="text-[11px] font-bold text-sky-700 hover:underline mt-4 dark:text-sky-400 block">Download Template PDF</button>
                </div>
                <div className="p-5 border border-gray-100 rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
                  <FileText className="h-6 w-6 text-sky-600 mb-2" />
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">OSHA Structural Hazard Guide</h4>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1">Manual on factory machinery safety clearances and egress widths.</p>
                  <button className="text-[11px] font-bold text-sky-700 hover:underline mt-4 dark:text-sky-400 block">Download Whitepaper PDF</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="contact"
              className="mx-auto max-w-4xl px-6 py-12"
            >
              <div className="grid md:grid-cols-3 gap-12">
                <div className="space-y-6 md:col-span-1">
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Get In Touch</h2>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                    Contact our scientific operations team directly for rapid response safety checks or custom audit software setups.
                  </p>
                  <div className="space-y-3 pt-4 text-xs text-gray-600 dark:text-zinc-400">
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-sky-600" /> compliance@ahdo.org</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-sky-600" /> +1 (800) 555-AHDO</p>
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-sky-600" /> Boston Innovation District, MA</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 md:col-span-2 dark:bg-zinc-900 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Send a Message</h3>
                  
                  {contactSubmitted ? (
                    <div className="py-12 text-center text-xs text-emerald-600 font-semibold space-y-2">
                      <CheckCircle className="h-8 w-8 mx-auto" />
                      <p>Your message has been dispatched safely.</p>
                      <p className="text-gray-400 font-normal">An EHS specialist will contact you within 2 business hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1">Corporate Email</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1">Subject</label>
                        <input
                          type="text"
                          required
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-400 mb-1">Operational Requirements</label>
                        <textarea
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                        ></textarea>
                      </div>
                      <button type="submit" className="w-full rounded-xl bg-sky-700 py-3 text-xs font-bold text-white hover:bg-sky-800 transition-all">
                        Send Secure Message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'login' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              key="login"
              className="mx-auto max-w-4xl px-6 py-12"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
                
                {/* Visual Illustration Panel */}
                <div className="relative h-full hidden md:block bg-gradient-to-br from-sky-900 to-slate-950 text-white p-10 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
                  <div className="z-10">
                    <span className="text-[9px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-400/20">
                      SECURED NODE
                    </span>
                    <h3 className="text-2xl font-black text-white mt-4 leading-tight">Advanced Health Development Organization</h3>
                    <p className="text-xs text-slate-300 mt-2">Enterprise operations ledger &amp; auditing workspace.</p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-6 mt-16 z-10">
                    <p className="text-[10px] text-slate-400">Quick Credentials for Testing:</p>
                    <div className="mt-2 space-y-1 font-mono text-[9px] text-slate-300">
                      <p>• Admin Portal: <span className="text-sky-300 font-bold">admin@ahdo.org</span></p>
                      <p>• Client Portal: <span className="text-emerald-300 font-bold">client@hyatt.com</span></p>
                      <p>• Password: <span className="text-white font-bold">anything</span></p>
                    </div>
                  </div>
                </div>

                {/* Form Panel */}
                <div className="p-8 sm:p-12">
                  <div className="flex items-center gap-2 mb-6 md:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-700 text-xs font-black text-white">
                      AH
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">AHDO Operations</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Workspace Sign-In</h3>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Please enter your verified credentials.</p>

                  <form onSubmit={handleLoginSubmit} className="space-y-4 mt-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-zinc-500 mb-1">Corporate Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <User className="h-3.5 w-3.5" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 pl-9 pr-3 py-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-zinc-500 mb-1">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Lock className="h-3.5 w-3.5" />
                        </span>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-100 bg-gray-50 pl-9 pr-3 py-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <label className="flex items-center gap-1.5 text-gray-500 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-zinc-800"
                        />
                        Remember this workstation
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Demo System: Verification bypass. You can use any password to log in.')}
                        className="text-sky-600 hover:underline dark:text-sky-400 font-medium"
                      >
                        Forgot credentials?
                      </button>
                    </div>

                    <button
                      type="submit"
                      id="btn-login-submit"
                      className="w-full rounded-xl bg-sky-700 py-3 text-xs font-bold text-white hover:bg-sky-800 shadow-sm transition-all mt-2"
                    >
                      Authenticate Access
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-gray-100 bg-white py-12 px-6 dark:border-zinc-900 dark:bg-zinc-950 text-xs">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-700 text-xs font-black text-white">AH</div>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white">AHDO International</span>
            </div>
            <p className="text-gray-400 dark:text-zinc-500 leading-normal">
              Scientific EHS diagnostics, facility sanitization audits, and blockchain certified safety registries.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-gray-900 dark:text-white mb-3">Enterprise Services</h5>
            <ul className="space-y-2 text-gray-500 dark:text-zinc-500">
              <li><button onClick={() => { setActiveTab('services') }} className="hover:text-sky-600">Food Safety HACCP</button></li>
              <li><button onClick={() => { setActiveTab('services') }} className="hover:text-sky-600">Clinical Isolation Checkups</button></li>
              <li><button onClick={() => { setActiveTab('services') }} className="hover:text-sky-600">OSHA Structural Surveys</button></li>
              <li><button onClick={() => { setActiveTab('services') }} className="hover:text-sky-600">Water Quality Auditing</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-gray-900 dark:text-white mb-3">Corporate Information</h5>
            <ul className="space-y-2 text-gray-500 dark:text-zinc-500">
              <li><button onClick={() => { setActiveTab('about') }} className="hover:text-sky-600">About Our Scientists</button></li>
              <li><button onClick={() => { setActiveTab('industries') }} className="hover:text-sky-600">Industries Served</button></li>
              <li><button onClick={() => { setActiveTab('resources') }} className="hover:text-sky-600">EHS Free Whitepapers</button></li>
              <li><button onClick={() => { setActiveTab('contact') }} className="hover:text-sky-600">Connect with Inspector</button></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl border-t border-gray-50 mt-12 pt-6 flex flex-wrap justify-between items-center text-gray-400 dark:border-zinc-900 dark:text-zinc-500 text-[10px]">
          <p>© 2026 AHDO Inc. Inspired by corporate EHS safety frameworks. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Security Ledger Rules</span>
            <span className="hover:underline cursor-pointer">Compliance Policy</span>
            <span className="hover:underline cursor-pointer">EHS Accreditation Logs</span>
          </div>
        </div>
      </footer>

      {/* 4. DIALOG: CONSULTATION REQUEST */}
      {showConsultDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg border border-gray-100 shadow-2xl dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-4 dark:border-zinc-800">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Request Onsite EHS Consultation</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Accredited biological &amp; physical safety review.</p>
              </div>
              <button
                onClick={() => setShowConsultDialog(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {consultationSuccess ? (
              <div className="py-12 text-center text-xs text-emerald-600 font-bold space-y-2">
                <CheckCircle className="h-10 w-10 mx-auto" />
                <p>Consultation Request Logged Successfully.</p>
                <p className="text-gray-400 font-normal">Our EHS lead scheduler will email you to confirm travel times.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={consultForm.name}
                      onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">Company Entity</label>
                    <input
                      type="text"
                      required
                      value={consultForm.company}
                      onChange={(e) => setConsultForm({ ...consultForm, company: e.target.value })}
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">Accredited Contact Email</label>
                  <input
                    type="email"
                    required
                    value={consultForm.email}
                    onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">Primary Industrial Sector</label>
                  <select
                    value={consultForm.industry}
                    onChange={(e) => setConsultForm({ ...consultForm, industry: e.target.value })}
                    className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <option value="Healthcare">Healthcare &amp; Biotech Labs</option>
                    <option value="Food">Food Processing &amp; Kitchens</option>
                    <option value="Hospitality">Hospitality &amp; Luxury Dining</option>
                    <option value="Manufacturing">Manufacturing Foundries</option>
                    <option value="Government">Transit &amp; Water Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">Special Site Parameters / Details</label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Cold storage room square footage, chemical inventory, etc."
                    value={consultForm.message}
                    onChange={(e) => setConsultForm({ ...consultForm, message: e.target.value })}
                    className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                  ></textarea>
                </div>

                <button type="submit" className="w-full rounded-xl bg-sky-700 py-3 text-xs font-bold text-white hover:bg-sky-800 shadow-sm transition-all">
                  Dispatch Consult Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
