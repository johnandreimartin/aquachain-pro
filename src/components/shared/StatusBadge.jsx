import React from 'react';
import { STATUS_MAP } from '../../constants/contract';

const STATUS_STYLES = [
  'bg-blue-50 border-blue-200 text-blue-800 dot-blue',
  'bg-amber-50 border-amber-200 text-amber-800 dot-amber',
  'bg-emerald-50 border-emerald-200 text-emerald-800 dot-emerald',
  'bg-rose-50 border-rose-200 text-rose-800 dot-rose',
];

const DOT_COLORS = ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'];

export function StatusBadge({ status }) {
  const idx = Number(status);
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 border w-fit ${STATUS_STYLES[idx]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[idx]}`} />
      {STATUS_MAP[idx]}
    </span>
  );
}
