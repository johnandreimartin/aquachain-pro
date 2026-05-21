import React from 'react';

export function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  'w-full border border-slate-200 bg-slate-50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition';
