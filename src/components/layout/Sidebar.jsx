import React from 'react';
import { Fish, Users, Truck, ShoppingBag, Search, UserCheck, ArrowRight, Home } from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'System',
    items: [
      { id: 'home',        icon: Home,        label: 'Demo Home' },
      { id: 'register',    icon: UserCheck,    label: 'Node Enrollment' },
    ],
  },
  {
    label: 'Supply Chain Workflow',
    items: [
      { id: 'farmer',      icon: Fish,         label: '1. Crayfish Farmer' },
      { id: 'distributor', icon: Users,         label: '2. Distributor' },
      { id: 'transporter', icon: Truck,         label: '3. Transporter' },
      { id: 'vendor',      icon: ShoppingBag,   label: '4. Vendor / Restaurant' },
    ],
  },
  {
    label: 'Public Audit',
    items: [
      { id: 'trace',       icon: Search,        label: 'Traceability Engine' },
    ],
  },
];

export function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="lg:col-span-3 flex flex-col gap-1.5">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="mb-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">
            {section.label}
          </p>
          {section.items.map(({ id, icon: Icon, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all mb-0.5 ${
                  active
                    ? id === 'trace'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active && id === 'trace' ? 'text-blue-400' : ''}`} />
                  {label}
                </span>
                {active && <ArrowRight className="w-3.5 h-3.5 opacity-60" />}
              </button>
            );
          })}
          <div className="my-2 border-t border-slate-200" />
        </div>
      ))}
    </aside>
  );
}
