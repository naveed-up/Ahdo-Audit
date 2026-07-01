/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Search, User, LogOut, CheckCircle, AlertTriangle, Shield, Globe, ExternalLink, Moon, Sun, Menu } from 'lucide-react';
import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../data';

interface NavbarProps {
  currentView: 'website' | 'admin' | 'client';
  setView: (view: 'website' | 'admin' | 'client') => void;
  adminTab: string;
  clientTab: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userEmail: string;
  onLogout: () => void;
  onSearch: (query: string) => void;
  toggleSidebarMobile: () => void;
}

export default function Navbar({
  currentView,
  setView,
  adminTab,
  clientTab,
  theme,
  toggleTheme,
  userEmail,
  onLogout,
  onSearch,
  toggleSidebarMobile
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchVal, setSearchVal] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  // Human-friendly title mapping for breadcrumbs
  const getBreadcrumbTitle = () => {
    if (currentView === 'website') {
      return 'Corporate Portal';
    }
    if (currentView === 'client') {
      const tabNames: Record<string, string> = {
        dashboard: 'Client Space',
        reports: 'Quality Reports',
        certificates: 'Official Certifications',
        audits: 'Verification History',
        corrective: 'Corrective Action Plans',
        training: 'Employee Training',
        invoices: 'Financial Statements',
        support: 'Priority Support'
      };
      return `Client Portal › ${tabNames[clientTab] || clientTab}`;
    }
    const adminNames: Record<string, string> = {
      dashboard: 'Operational Insights',
      companies: 'Client Entities',
      services: 'Service Catalogue',
      templates: 'Standard Templates',
      audits: 'Inspection Execution',
      reports: 'Compliance Diagnostics',
      calendar: 'Inspector Agenda',
      tasks: 'Task Management',
      settings: 'System Configuration'
    };
    return `Admin Ops › ${adminNames[adminTab] || adminTab}`;
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 transition-colors">
      
      {/* Mobile Menu & Left Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebarMobile}
          id="btn-toggle-sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
            AHDO Enterprise Platform
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-zinc-100">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Global Interactive Context Switcher */}
      <div className="hidden lg:flex items-center gap-1.5 rounded-xl bg-slate-50 p-1 dark:bg-zinc-800/60 border border-slate-200/40 animate-fade-in">
        <button
          onClick={() => setView('website')}
          id="btn-view-website"
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            currentView === 'website'
              ? 'bg-white text-blue-700 shadow-sm dark:bg-zinc-700 dark:text-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          Public Site (SGS style)
        </button>
        <button
          onClick={() => setView('admin')}
          id="btn-view-admin"
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            currentView === 'admin'
              ? 'bg-white text-blue-700 shadow-sm dark:bg-zinc-700 dark:text-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          Admin Ops Portal
        </button>
        <button
          onClick={() => setView('client')}
          id="btn-view-client"
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            currentView === 'client'
              ? 'bg-white text-blue-700 shadow-sm dark:bg-zinc-700 dark:text-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Client Portal
        </button>
      </div>

      {/* Right Side Utility Elements */}
      <div className="flex items-center gap-4">
        
        {/* Search Bar - only shown inside portals */}
        {currentView !== 'website' && (
          <div className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 dark:text-zinc-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={handleSearchChange}
              id="global-search-input"
              className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-1.5 text-xs w-64 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          id="btn-theme-toggle"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            id="btn-notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 dark:border-zinc-800/80">
                <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    id="btn-mark-all-read"
                    className="text-[10px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">No new alerts.</div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors ${
                        !notif.read ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && <span className="flex h-2 w-2 rounded-full bg-emerald-500" />}
                        {notif.type === 'warning' && <span className="flex h-2 w-2 rounded-full bg-amber-500" />}
                        {notif.type === 'alert' && <span className="flex h-2 w-2 rounded-full bg-rose-500" />}
                        {notif.type === 'info' && <span className="flex h-2 w-2 rounded-full bg-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] leading-snug text-slate-800 dark:text-zinc-200 ${!notif.read ? 'font-medium' : ''}`}>
                          {notif.title}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-snug text-slate-400 dark:text-zinc-500">
                          {notif.message}
                        </p>
                        <span className="mt-1 block text-[9px] text-slate-300 dark:text-zinc-600">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Trigger */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            id="btn-profile-menu"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 pr-2.5 text-left hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-[11px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              AH
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-slate-800 dark:text-zinc-200 leading-none">Naveed J.</p>
              <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5 leading-none">Enterprise Director</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="px-4 py-2 border-b border-gray-50 dark:border-zinc-800/80">
                <p className="text-xs font-semibold text-gray-900 dark:text-zinc-100">Naveed Jawaid</p>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 truncate">{userEmail}</p>
              </div>
              <div className="py-1">
                <div className="block lg:hidden border-b border-gray-50 dark:border-zinc-800/80 pb-1 mb-1">
                  <div className="px-3 py-1 text-[9px] font-semibold text-gray-400 dark:text-zinc-500 uppercase">View Modes</div>
                  <button onClick={() => { setView('website'); setShowProfile(false); }} className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <Globe className="h-3.5 w-3.5" /> Corporate Website
                  </button>
                  <button onClick={() => { setView('admin'); setShowProfile(false); }} className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <Shield className="h-3.5 w-3.5" /> Admin Ops Portal
                  </button>
                  <button onClick={() => { setView('client'); setShowProfile(false); }} className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <CheckCircle className="h-3.5 w-3.5" /> Client Portal
                  </button>
                </div>

                <button
                  onClick={() => { setView('admin'); setShowProfile(false); }}
                  className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Shield className="h-3.5 w-3.5" /> Control Panel
                </button>
                <button
                  onClick={onLogout}
                  id="btn-logout"
                  className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50/50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="h-3.5 w-3.5" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
