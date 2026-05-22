import React, { useState } from 'react';
import { Search, HelpCircle, Clock, Layers, Calendar, MapPin, Package } from 'lucide-react';
import { STATUS_MAP } from '../../constants/contract';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { FormField, inputCls } from '../../components/shared/FormField';
import { TxButton } from '../../components/shared/TxButton';

export function TracePage({ contract }) {
  const [searchId, setSearchId]         = useState('');
  const [batch, setBatch]               = useState(null);
  const [history, setHistory]           = useState([]);
  const [loading, setLoading]           = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!contract || !searchId) return;
    setLoading(true);
    setBatch(null);
    setHistory([]);
    try {
      // FIX: Used window.BigInt to satisfy older ESLint configurations
      const data = await contract.batches(window.BigInt(searchId));
      if (data.crayfishType === '') {
        return alert('No record found for this Batch ID in the ledger.');
      }
      setBatch({
        id:          Number(data.id),
        type:        data.crayfishType,
        harvestDate: data.harvestDate,
        origin:      data.pondOrigin,
        quantity:    Number(data.quantity),
        owner:       data.currentOwner,
        transporter: data.currentTransporter,
        status:      Number(data.status),
      });
      const logs = await contract.getBatchHistory(window.BigInt(searchId));
      setHistory(logs);
    } catch (err) {
      console.error(err);
      alert('Error fetching on-chain records. Is the contract connected?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-600"><Search className="w-5 h-5 text-blue-500" /></div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Public Traceability Engine</h2>
        </div>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Verify the origin, ownership, and full transaction history of any crayfish batch. 
          No wallet required — this is a public audit feature for consumers and regulators.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="number"
            placeholder="Enter Batch ID..."
            className={inputCls + ' flex-grow'}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            required
          />
          <TxButton
            loading={loading}
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 whitespace-nowrap"
          >
            <Search className="w-4 h-4 text-blue-400" />
            Pull On-Chain Record
          </TxButton>
        </form>
      </div>

      {/* Results */}
      {batch ? (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40 animate-slideUp">
          
          {/* Batch header */}
          <div className="p-6 bg-white border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 border border-blue-200 rounded-md">
                  BATCH ID #{batch.id}
                </span>
                <h3 className="font-bold text-lg text-slate-900">{batch.type}</h3>
              </div>
              <p className="text-xs font-mono text-slate-400 truncate max-w-md">
                Owner: {batch.owner}
              </p>
              {batch.transporter !== '0x0000000000000000000000000000000000000000' && (
                <p className="text-xs font-mono text-slate-400 truncate max-w-md">
                  Transporter: {batch.transporter}
                </p>
              )}
            </div>
            <StatusBadge status={batch.status} />
          </div>

          {/* Batch details */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white">
            {[
              { icon: Layers,   label: 'Quantity',        value: `${batch.quantity} kg` },
              { icon: Calendar, label: 'Harvest Date',    value: batch.harvestDate },
              { icon: MapPin,   label: 'Pond/Farm Origin',value: batch.origin },
              { icon: Package,  label: 'Ledger',          value: 'AquaChain' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                  <strong className="text-sm text-slate-800 block truncate max-w-[110px]">{value}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Audit trail */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Immutable Event Audit Trail ({history.length} events)
            </h4>

            <div className="space-y-4 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {history.map((log, i) => {
                const s = Number(log.status);
                const dotColor = ['bg-blue-500','bg-amber-500','bg-emerald-500','bg-rose-500'][s];
                return (
                  <div key={i} className="flex gap-4 items-start relative pl-8 animate-fadeIn">
                    <div className={`absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-4 border-slate-50 shadow-xs ${dotColor}`}>
                      <div className="w-1 h-1 rounded-full bg-white m-auto mt-[3px]" />
                    </div>
                    <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-xs flex-grow hover:border-slate-300 transition">
                      <span className="text-[10px] font-semibold text-slate-400 float-right bg-slate-100 px-2 py-0.5 rounded-md">
                        {STATUS_MAP[s]}
                      </span>
                      <p className="font-bold text-sm text-slate-900">{log.notes}</p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
                        <span className="truncate max-w-[180px] text-slate-500">
                          <strong>Actor:</strong> {log.actor}
                        </span>
                        <span className="text-slate-200">|</span>
                        <span>
                          <strong>Timestamp:</strong>{' '}
                          {new Date(Number(log.timestamp) * 1000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-lg mx-auto bg-slate-50/30">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">No Records Loaded</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Enter a numeric Batch ID in the search field above to pull its full on-chain history.
          </p>
        </div>
      )}
    </div>
  );
}