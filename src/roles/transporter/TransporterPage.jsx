import React, { useState } from 'react';
import { Truck, Info } from 'lucide-react';
import { FormField, inputCls } from '../../components/shared/FormField';
import { TxButton } from '../../components/shared/TxButton';

export function TransporterPage({ contract }) {
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransit = async (e) => {
    e.preventDefault();
    if (!contract || !batchId) return;
    setLoading(true);
    try {
      // FIX: Used window.BigInt to satisfy older ESLint configurations
      const tx = await contract.startTransit(window.BigInt(batchId));
      await tx.wait();
      alert('Success: Shipment picked up. Status updated to "In Transit".');
      setBatchId('');
    } catch (err) {
      alert('Transaction failed: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><Truck className="w-5 h-5" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Transporter Panel</h2>
          <p className="text-sm text-slate-500 mt-0.5">Step 3 of the AquaChain supply chain workflow</p>
        </div>
      </div>

      {/* Context */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-amber-900 text-sm">Transporter Role in the Workflow</h3>
          <p className="text-sm text-amber-700 mt-1 leading-relaxed">
            You are the logistics partner responsible for physical delivery. 
            Once you pick up the batch, call{' '}
            <code className="bg-amber-100 px-1 rounded font-mono text-xs">startTransit()</code>
            {' '}to update the on-chain status to <strong>"In Transit"</strong>.
            The smart contract requires the batch status to be <strong>"Created"</strong> before transit can be initiated.
          </p>
        </div>
      </div>

      {/* Form */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Start Shipment Transit</h3>
        <p className="text-sm text-slate-500 mb-5">
          Acknowledge physical pickup of the shipment and broadcast the transit event to the blockchain.
        </p>

        <form onSubmit={handleTransit} className="space-y-4">
          <FormField label="Shipment Batch ID">
            <input
              type="number"
              placeholder="Enter the Batch ID to start transit for..."
              className={inputCls}
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
            />
          </FormField>
          <TxButton
            loading={loading}
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          >
            startTransit() — Set Status to "In Transit"
          </TxButton>
        </form>
      </section>
    </div>
  );
}