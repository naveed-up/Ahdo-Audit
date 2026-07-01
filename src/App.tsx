/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CorporateWebsite from './components/CorporateWebsite';
import AdminPortal from './components/AdminPortal';
import ClientPortal from './components/ClientPortal';
import { Company, Service, AuditTemplate, Audit, Finding, Report, CalendarEvent, Task } from './types';
import {
  MOCK_COMPANIES,
  MOCK_SERVICES,
  MOCK_AUDIT_TEMPLATES,
  MOCK_AUDITS,
  MOCK_FINDINGS,
  MOCK_REPORTS,
  MOCK_CALENDAR_EVENTS,
  MOCK_TASKS
} from './data';

export default function App() {
  // Global Database State
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [templates, setTemplates] = useState<AuditTemplate[]>(MOCK_AUDIT_TEMPLATES);
  const [audits, setAudits] = useState<Audit[]>(MOCK_AUDITS);
  const [findings, setFindings] = useState<Finding[]>(MOCK_FINDINGS);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  // Layout & View State
  // Views: 'website' (Public corporate), 'admin' (Enterprise operations), 'client' (Customer portal)
  const [currentView, setView] = useState<'website' | 'admin' | 'client'>('admin');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [clientTab, setClientTab] = useState<string>('dashboard');
  const [isOpenSidebarMobile, setIsOpenSidebarMobile] = useState<boolean>(false);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('admin@ahdo.org');
  const [userRole, setUserRole] = useState<'admin' | 'client'>('admin');

  // Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sync Tailwind Dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = (email: string, role: 'admin' | 'client') => {
    setUserEmail(email);
    setUserRole(role);
    setIsLoggedIn(true);
    setView(role === 'admin' ? 'admin' : 'client');
    setAdminTab('dashboard');
    setClientTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('website');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200`}>
      {/* 
        If user wants to see the public corporate website or is logged out,
        render the full public SGS-style webpage inside the workspace.
      */}
      {(!isLoggedIn || currentView === 'website') ? (
        <CorporateWebsite
          onLoginSuccess={handleLoginSuccess}
          onRequestConsultation={() => {
            // Simulated action
            alert('Consultation dispatch: Site visit parameters initialized.');
          }}
        />
      ) : (
        /* 
          Otherwise, render the full premium Operations Portal
          framed by our left sidebar and top navbar.
        */
        <div className="flex flex-1 relative">
          
          {/* Navigation left sidebar */}
          <Sidebar
            currentView={currentView}
            setView={setView}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            clientTab={clientTab}
            setClientTab={setClientTab}
            isOpenMobile={isOpenSidebarMobile}
            setIsOpenMobile={setIsOpenSidebarMobile}
          />

          {/* Right Area: Navbar + Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar
              currentView={currentView}
              setView={setView}
              adminTab={adminTab}
              clientTab={clientTab}
              theme={theme}
              toggleTheme={toggleTheme}
              userEmail={userEmail}
              onLogout={handleLogout}
              onSearch={setGlobalSearchQuery}
              toggleSidebarMobile={() => setIsOpenSidebarMobile(!isOpenSidebarMobile)}
            />

            {/* Main content body render slot */}
            <main className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-zinc-950/40 relative">
              {currentView === 'admin' && (
                <AdminPortal
                  adminTab={adminTab}
                  setAdminTab={setAdminTab}
                  companies={companies}
                  setCompanies={setCompanies}
                  services={services}
                  setServices={setServices}
                  templates={templates}
                  setTemplates={setTemplates}
                  audits={audits}
                  setAudits={setAudits}
                  findings={findings}
                  setFindings={setFindings}
                  reports={reports}
                  setReports={setReports}
                  calendarEvents={calendarEvents}
                  setCalendarEvents={setCalendarEvents}
                  tasks={tasks}
                  setTasks={setTasks}
                  globalSearchQuery={globalSearchQuery}
                />
              )}

              {currentView === 'client' && (
                <ClientPortal
                  clientTab={clientTab}
                  setClientTab={setClientTab}
                  reports={reports}
                  audits={audits}
                  findings={findings}
                />
              )}
            </main>
          </div>

        </div>
      )}
    </div>
  );
}
