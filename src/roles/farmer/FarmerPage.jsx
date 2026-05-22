import React, { useState } from 'react';
import { Fish } from 'lucide-react';
import { FormField, inputCls } from '../../components/shared/FormField';
import { TxButton } from '../../components/shared/TxButton';

// ─── Sub-form: Register Crayfish Batch ───────────────────────────────────────
function RegisterBatchForm({ contract }) {
  const [crayfishType, setCrayfishType] = useState('');
  const [harvestDate, setHarvestDate]   = useState('');
  const [pondOrigin, setPondOrigin]     = useState('');
  const [quantity, setQuantity]         = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return alert('Connect MetaMask first!');
    setLoading(true);
    try {
      // 1. Dispatch transaction
      const tx = await contract.registerBatch(crayfishType, harvestDate, pondOrigin, window.BigInt(quantity));
      
      // 2. Await block confirmation
      const receipt = await tx.wait();
      
      // Print the raw logs to the browser console for debugging
      console.log("=== AQUACHAIN DEBUG: RAW RECEIPT LOGS ===", receipt.logs);
      
      let displayId = "New";

      // 3. Robust parsing check across all common names and positional indexes
      if (receipt && receipt.logs) {
        receipt.logs.forEach((log, index) => {
          try {
            const parsedLog = contract.interface.parseLog(log);
            console.log(`Parsed Log #${index} successfully:`, parsedLog);
            
            if (parsedLog && parsedLog.args) {
              // Look through common variable names emitted by supply chain contracts
              const extractedId = 
                parsedLog.args.batchId ?? 
                parsedLog.args.id ?? 
                parsedLog.args.idCounter ?? 
                parsedLog.args[0]; // Fallback to the very first parameter of the event
              
              if (extractedId !== undefined && extractedId !== null) {
                displayId = `#${extractedId.toString()}`;
              }
            }
          } catch (logErr) {
            console.warn(`Log #${index} could not be parsed with current ABI:`, logErr.message);
          }
        });
      }

      // 4. Ultimate fallback to contract read if log-parsing failed
      if (displayId === "New") {
        try {
          const counter = await contract.batchCounter();
          displayId = `#${counter.toString()}`;
        } catch (counterErr) {
          console.error("Fallback batchCounter call also failed:", counterErr.message);
        }
      }

      alert(`Success: Batch ID ${displayId} created with status "Created"!`);
      setCrayfishType(''); setHarvestDate(''); setPondOrigin(''); setQuantity('');
    } catch (err) {
      alert('Transaction failed: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="sm:col-span-2">
        <FormField label="Crayfish Type / Product">
          <input
            type="text"
            placeholder="e.g. Live Crayfish, Frozen Crayfish, Processed Seafood"
            className={inputCls}
            value={crayfishType}
            onChange={(e) => setCrayfishType(e.target.value)}
            required
          />
        </FormField>
      </div>

      <FormField label="Harvest Date">
        <input
          type="date"
          className={inputCls + ' text-slate-600'}
          value={harvestDate}
          onChange={(e) => setHarvestDate(e.target.value)}
          required
        />
      </FormField>

      <FormField label="Pond / Farm Origin">
        <input
          type="text"
          placeholder="e.g. Sector 3 Cultivation Pen"
          className={inputCls}
          value={pondOrigin}
          onChange={(e) => setPondOrigin(e.target.value)}
          required
        />
      </FormField>

      <div className="sm:col-span-2">
        <FormField label="Quantity (Kilograms)">
          <input
            type="number"
            placeholder="Enter net weight in kg"
            className={inputCls}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </FormField>
      </div>

      <div className="sm:col-span-2 pt-1">
        <TxButton loading={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Mint Batch Record to Ledger (Status: "Created")
        </TxButton>
      </div>
    </form>
  );
}

// ─── Sub-form: Transfer Ownership ────────────────────────────────────────────
function TransferOwnershipForm({ contract }) {
  const [batchId, setBatchId]   = useState('');
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.transferBatchOwnership(window.BigInt(batchId), receiver);
      await tx.wait();
      alert('Success: Digital custody transferred to next ledger node.');
      setBatchId(''); setReceiver('');
    } catch (err) {
      alert('Transaction failed: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormField label="Target Batch ID">
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
        <FormField label="Receiver Wallet Address (Distributor)">
          <input
            type="text"
            placeholder="0x... public key of the distributor"
            className={inputCls + ' font-mono'}
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            required
          />
        </FormField>
      </div>

      <div className="sm:col-span-3">
        <TxButton loading={loading} type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white">
          Trigger transferBatchOwnership() → Distributor
        </TxButton>
      </div>
    </form>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────
export function FarmerPage({ contract }) {
  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-teal-100 rounded-xl text-teal-600"><Fish className="w-5 h-5" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Crayfish Farmer Panel</h2>
          <p className="text-sm text-slate-500 mt-0.5">Step 1 of the AquaChain supply chain workflow</p>
        </div>
      </div>

      {/* Section A */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Batch Registration</h3>
        <p className="text-sm text-slate-500 mb-5">
          Mint a new on-chain Batch ID for a freshly harvested crayfish lot. 
          Status will be initialized to <strong>"Created"</strong> on the blockchain.
        </p>
        <RegisterBatchForm contract={contract} />
      </section>

      <div className="border-t border-slate-200 pt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Ownership Transfer</h3>
        <p className="text-sm text-slate-500 mb-5">
          Transfer digital custody of a registered batch to a Distributor wallet. 
          The receiving address must be a registered participant.
        </p>
        <TransferOwnershipForm contract={contract} />
      </div>
    </div>
  );
}