import React from 'react';
import {
  Shield, Fish, Users, Truck, ShoppingBag, Search, UserCheck,
  ArrowRight, Layers, Info
} from 'lucide-react';

const ROLES = [
  {
    id: 'register',
    icon: UserCheck,
    label: 'Node Enrollment',
    subtitle: 'Register a wallet onto the blockchain',
    color: 'blue',
    step: null,
    desc: 'Any stakeholder registers their MetaMask wallet address with their name, location, and role. Required before any chain transaction.',
  },
  {
    id: 'farmer',
    icon: Fish,
    label: 'Crayfish Farmer',
    subtitle: 'Register batches & transfer ownership',
    color: 'teal',
    step: 1,
    desc: 'Farmers harvest crayfish and mint an on-chain Batch ID. They then initiate ownership transfer to a Distributor.',
  },
  {
    id: 'distributor',
    icon: Users,
    label: 'Distributor',
    subtitle: 'Receive batch & view owned assets',
    color: 'violet',
    step: 2,
    desc: 'Intermediary who receives ownership from the Farmer and hands off batches to the Transporter for physical delivery.',
  },
  {
    id: 'transporter',
    icon: Truck,
    label: 'Transporter',
    subtitle: 'Mark shipment as In Transit',
    color: 'amber',
    step: 3,
    desc: 'Logistics partner picks up the batch and updates its on-chain status to "In Transit" for live tracking.',
  },
  {
    id: 'vendor',
    icon: ShoppingBag,
    label: 'Vendor / Restaurant',
    subtitle: 'Confirm or reject delivery',
    color: 'emerald',
    step: 4,
    desc: 'Final recipient who accepts or rejects the arriving shipment, completing the supply chain cycle on-chain.',
  },
  {
    id: 'trace',
    icon: Search,
    label: 'Public Traceability',
    subtitle: 'Verify any batch by ID',
    color: 'slate',
    step: null,
    desc: 'Any consumer or regulator can input a Batch ID to inspect the full immutable audit trail of that shipment.',
  },
];

const COLOR_MAP = {
  blue:    { card: 'border-blue-200 hover:border-blue-400 hover:shadow-blue-100',    icon: 'bg-blue-100 text-blue-600',    badge: 'bg-blue-600 text-white',    btn: 'bg-blue-600 hover:bg-blue-700' },
  teal:    { card: 'border-teal-200 hover:border-teal-400 hover:shadow-teal-100',    icon: 'bg-teal-100 text-teal-600',    badge: 'bg-teal-600 text-white',    btn: 'bg-teal-600 hover:bg-teal-700' },
  violet:  { card: 'border-violet-200 hover:border-violet-400 hover:shadow-violet-100', icon: 'bg-violet-100 text-violet-600', badge: 'bg-violet-600 text-white', btn: 'bg-violet-600 hover:bg-violet-700' },
  amber:   { card: 'border-amber-200 hover:border-amber-400 hover:shadow-amber-100', icon: 'bg-amber-100 text-amber-600',  badge: 'bg-amber-500 text-white',   btn: 'bg-amber-500 hover:bg-amber-600' },
  emerald: { card: 'border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100', icon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-600 text-white', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  slate:   { card: 'border-slate-300 hover:border-slate-500 hover:shadow-slate-100', icon: 'bg-slate-100 text-slate-600',  badge: 'bg-slate-700 text-white',   btn: 'bg-slate-800 hover:bg-slate-900' },
};

export function HomePage({ onSelectRole }) {
  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" /> FRE403 Blockchain Project Demo
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          AquaChain
          <span className="text-blue-600"> Supply Chain Ledger</span>
        </h1>
        <p className="text-slate-500 mt-3 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          A blockchain-driven aquaculture traceability system for farmed crayfish. 
          Select a stakeholder role below to explore its interface and on-chain capabilities.
        </p>
      </div>

      {/* Workflow path indicator */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-3xl mx-auto">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> Section IX — Supply Chain Workflow Path
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-600">
          {['Farmer', 'Distributor', 'Transporter', 'Vendor/Restaurant'].map((s, i, arr) => (
            <React.Fragment key={s}>
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg">{s}</span>
              {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Role selector grid */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          Select a role to demo its interface:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map(({ id, icon: Icon, label, subtitle, color, step, desc }) => {
            const c = COLOR_MAP[color];
            return (
              <button
                key={id}
                onClick={() => onSelectRole(id)}
                className={`text-left border-2 rounded-2xl p-5 bg-white transition-all duration-200 hover:shadow-lg group ${c.card}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${c.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {step !== null ? (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${c.badge}`}>
                      STEP {step}
                    </span>
                  ) : (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${c.badge}`}>
                      {id === 'trace' ? 'PUBLIC' : 'SETUP'}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-base">{label}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5 mb-3">{subtitle}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{desc}</p>
                <div className={`w-full text-center text-xs font-bold py-2 rounded-lg text-white transition ${c.btn} group-hover:shadow-md`}>
                  Open {label} Panel →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
