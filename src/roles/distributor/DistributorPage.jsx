import React, { useState } from 'react';
import { Users, ArrowRight, Info } from 'lucide-react';
import { FormField, inputCls } from '../../components/shared/FormField';
import { TxButton } from '../../components/shared/TxButton';

// ─── Sub-form: Transfer Ownership to Vendor ──────────────────────────────────
// Per the workflow, Distributor can also initiate transferOwnership → Vendor
function TransferToVendorForm({ contract }) {
  const [batchId, setBatchId]   = useState('');
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.transferOwnership(batchId, receiver);
      await tx.wait();
      alert('Success: Batch ownership transferred to Vendor/Restaurant node.');
      setBatchId(''); setReceiver('');
    } catch (err) {
      alert('Transaction failed: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormField label="Owned Batch ID">
        <input
          type="number"
          placeholder="Batch #"
          className={inputCls}
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          required
        />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Vendor / Restaurant Wallet Address">
          <input
            type="text"
            placeholder="0x... destination vendor wallet"
            className={inputCls + ' font-mono'}
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            required
          />
        </FormField>
      </div>
      <div className="sm:col-span-3">
        <TxButton loading={loading} type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
          transferOwnership() → Vendor/Restaurant
        </TxButton>
      </div>
    </form>
  );
}

export function DistributorPage({ contract }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-violet-100 rounded-xl text-violet-600"><Users className="w-5 h-5" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Distributor Panel</h2>
          <p className="text-sm text-slate-500 mt-0.5">Step 2 of the AquaChain supply chain workflow</p>
        </div>
      </div>

      {/* Workflow Context Card */}
      <div className="bg-violet-50 border border-violet-200/60 rounded-2xl p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-violet-900 text-sm">Distributor Role in the Workflow</h3>
          <p className="text-sm text-violet-700 mt-1 leading-relaxed">
            Once the Farmer calls <code className="bg-violet-100 px-1 rounded font-mono text-xs">transferOwnership()</code> 
            {' '}to your wallet address, you become the current owner of the batch on-chain. 
            Your action is to forward that ownership to the Vendor/Restaurant to complete the distribution leg.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-violet-600 font-semibold">
            <span className="bg-white border border-violet-200 px-2 py-1 rounded-lg">Farmer</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="bg-violet-200 border border-violet-300 px-2 py-1 rounded-lg font-bold">Distributor ← You</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="bg-white border border-violet-200 px-2 py-1 rounded-lg">Vendor</span>
          </div>
        </div>
      </div>

      {/* Forward Ownership */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Forward Batch to Vendor</h3>
        <p className="text-sm text-slate-500 mb-5">
          As a batch owner, transfer custody downstream to the Vendor/Restaurant that will receive the shipment.
        </p>
        <TransferToVendorForm contract={contract} />
      </section>
    </div>
  );
}
