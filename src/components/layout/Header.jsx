import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { ROLE_MAP } from '../../constants/contract';

export function Header({ account, myProfile, network, onSwitchNetwork, onConnectWallet }) {
  return (
    <>
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight block">AquaChain</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block -mt-1">
                Aquaculture Supply Chain Ledger
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {network && (
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${
                network.isSepolia
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-400/10 border-amber-400/30 text-amber-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${network.isSepolia ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                {network.name}
              </div>
            )}

            {myProfile && (
              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold block text-slate-200">{myProfile.name}</span>
                <span className="text-[10px] font-bold block text-blue-400 uppercase tracking-wider">
                  {ROLE_MAP[myProfile.role]}
                </span>
              </div>
            )}

            {account ? (
              <div className="bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-slate-300 max-w-[110px] truncate">{account}</span>
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Wrong-network banner */}
      {network && !network.isSepolia && (
        <div className="bg-amber-400/10 border-b border-amber-400/20 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-500 text-xs font-semibold">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>
                Wrong network: <strong>{network.name}</strong>. Transactions require Sepolia Testnet.
              </span>
            </div>
            <button
              onClick={onSwitchNetwork}
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-bold transition shadow-md"
            >
              Switch to Sepolia
            </button>
          </div>
        </div>
      )}
    </>
  );
}
