import React from 'react';

export function TxButton({ loading, children, className = '', ...props }) {
  return (
    <button
      disabled={loading}
      className={`font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Awaiting Block Confirmation…
        </>
      ) : children}
    </button>
  );
}
