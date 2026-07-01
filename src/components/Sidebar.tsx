/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  FileSpreadsheet,
  CheckSquare,
  FileBarChart,
  Calendar,
  Layers,
  Settings,
  Users,
  Award,
  Clock,
  ShieldCheck,
  GraduationCap,
  FileText,
  LifeBuoy,
  X,
  Globe,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: 'website' | 'admin' | 'client';
  setView: (view: 'website' | 'admin' | 'client') => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  clientTab: string;
  setClientTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export default function Sidebar({
  currentView,
  setView,
  adminTab,
  setAdminTab,
  clientTab,
  setClientTab,
  isOpenMobile,
  setIsOpenMobile
}: SidebarProps) {

  const handleAdminTabClick = (tabId: string) => {
    setAdminTab(tabId);
    setIsOpenMobile(false);
  };

  const handleClientTabClick = (tabId: string) => {
    setClientTab(tabId);
    setIsOpenMobile(false);
  };

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'templates', label: 'Audit Templates', icon: FileSpreadsheet },
    { id: 'audits', label: 'Audits & Checklists', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const clientMenuItems = [
    { id: 'dashboard', label: 'My Portal', icon: LayoutDashboard },
    { id: 'reports', label: 'My Reports', icon: FileBarChart },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'audits', label: 'Audit History', icon: Clock },
    { id: 'corrective', label: 'Corrective Actions', icon: Layers },
    { id: 'training', label: 'Training Modules', icon: GraduationCap },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'support', label: 'Support & Tickets', icon: LifeBuoy },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-950 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-sans text-base font-bold text-white">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-800 dark:text-white">
                AHDO
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase leading-none mt-0.5">
                Advanced Health
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpenMobile(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 md:hidden dark:border-zinc-800 dark:hover:bg-zinc-900"
            title="Close Menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current View Label & Back to Web Quick-Link */}
        <div className="mb-4 px-2">
          {currentView === 'website' ? (
            <div className="rounded-lg bg-blue-50/50 p-2 text-center text-[11px] font-medium text-blue-800 dark:bg-blue-950/20 dark:text-blue-300">
              🌍 Public Corporate View
            </div>
          ) : (
            <button
              onClick={() => { setView('website'); setIsOpenMobile(false); }}
              className="group flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-[11px] text-slate-600 hover:border-blue-100 hover:bg-blue-50/20 hover:text-blue-700 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:border-blue-900 dark:hover:bg-blue-950/20 dark:hover:text-blue-300 transition-all"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Globe className="h-3.5 w-3.5" />
                Return to Public Site
              </span>
              <ChevronRight className="h-3 w-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-1 py-2">
          {currentView === 'website' && (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500">
              Website page links are available in the public navbar.
            </div>
          )}

          {currentView === 'admin' && (
            <>
              <div className="mb-2 px-2 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                Operations
              </div>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = adminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAdminTabClick(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                    {item.label}
                  </button>
                );
              })}
            </>
          )}

          {currentView === 'client' && (
            <>
              <div className="mb-2 px-2 text-[10px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-widest">
                Client Space
              </div>
              {clientMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = clientTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleClientTabClick(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                    {item.label}
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer Area - Connected Account */}
        <div className="mt-auto border-t border-slate-200 pt-4 px-2 dark:border-zinc-900">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg dark:bg-zinc-900/40">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 shrink-0">
              NJ
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate leading-none">
                Naveed Jawaid
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 truncate mt-1">
                Senior Director
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
