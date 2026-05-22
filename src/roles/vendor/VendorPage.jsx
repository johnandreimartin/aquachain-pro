import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, XCircle, Info } from 'lucide-react';
import { FormField, inputCls } from '../../components/shared/FormField';
import { TxButton } from '../../components/shared/TxButton';

export function VendorPage({ contract }) {
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (accepted) => {
    if (!contract || !batchId) return alert('Enter a valid Batch ID first.');
    setLoading(true);
    try {
      // FIX: Used window.BigInt to satisfy older ESLint configurations
      const tx = await contract.confirmDelivery(window.BigInt(batchId), accepted);
      await tx.wait();
      alert(`Batch #${batchId} finalized as: ${accepted ? '"Delivered" ✓' : '"Rejected" ✗'}`);
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
        <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><ShoppingBag className="w-5 h-5" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Vendor / Restaurant Panel</h2>
          <p className="text-sm text-slate-500 mt-0.5">Step 4 of the AquaChain supply chain workflow</p>
        </div>
      </div>

      {/* Context */}
      <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-emerald-900 text-sm">Vendor Role in the Workflow</h3>
          <p className="text-sm text-emerald-700 mt-1 leading-relaxed">
            You are the final node in the supply chain. Once the shipment arrives, 
            inspect the product and call{' '}
            <code className="bg-emerald-100 px-1 rounded font-mono text-xs">confirmDelivery()</code>.
            {' '}Accepting sets status to <strong>"Delivered"</strong>; 
            rejecting (quality failure) sets it to <strong>"Rejected"</strong>. 
            The contract requires the batch to be <strong>"In Transit"</strong> and 
            your wallet to be the current owner.
          </p>
        </div>
      </div>

      {/* Form */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Intake Confirmation</h3>
        <p className="text-sm text-slate-500 mb-5">
          Enter the Batch ID of the arriving shipment and confirm or reject based on your quality inspection.
        </p>

        <div className="space-y-5">
          <FormField label="Arriving Batch ID">
            <input
              type="number"
              placeholder="Enter Batch ID to confirm..."
              className={inputCls}
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            />
          </FormField>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <TxButton
              loading={loading}
              onClick={() => handleConfirm(true)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept Delivery (Delivered)
            </TxButton>
            <TxButton
              loading={loading}
              onClick={() => handleConfirm(false)}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              <XCircle className="w-4 h-4" />
              Reject Shipment (Rejected)
            </TxButton>
          </div>
        </div>
      </section>
    </div>
  );
}