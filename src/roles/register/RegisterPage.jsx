import React, { useState } from 'react';
import { CheckCircle2, UserCheck } from 'lucide-react';
import { ROLE_MAP } from '../../constants/contract';
import { FormField, inputCls } from '../../components/shared/FormField';
import { TxButton } from '../../components/shared/TxButton';

export function RegisterPage({ contract, myProfile }) {
  const [name, setName]         = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole]         = useState(1);
  const [loading, setLoading]   = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!contract) return alert('Connect your MetaMask wallet first!');
    setLoading(true);
    try {
      const tx = await contract.registerParticipant(name, location, role);
      await tx.wait();
      alert('Success: Identity committed to blockchain registration index!');
      window.location.reload();
    } catch (err) {
      alert('Transaction failed: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl animate-fadeIn">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><UserCheck className="w-5 h-5" /></div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Node Enrollment</h2>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Register your wallet address as a participant in the AquaChain ecosystem. 
        This must be done before any supply chain transactions can be executed.
      </p>

      {myProfile ? (
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-emerald-900">Wallet Authorized & Synced</h3>
            <p className="text-sm text-emerald-700 mt-1">
              This node is already registered. Profile details below:
            </p>
            <div className="mt-3 space-y-1 text-xs text-emerald-800 font-mono bg-emerald-100/50 rounded-xl p-3">
              <p><strong>Entity Name:</strong> {myProfile.name}</p>
              <p><strong>Location:</strong> {myProfile.location}</p>
              <p><strong>Assigned Role:</strong> {ROLE_MAP[myProfile.role]}</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-5">
          <FormField label="Business / Farm Entity Name">
            <input
              type="text"
              placeholder="e.g. Dela Cruz Aquaculture Farm"
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Physical Location / Address">
            <input
              type="text"
              placeholder="e.g. Bulacan, Pampanga, or Iloilo"
              className={inputCls}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Ecosystem Role Assignment">
            {/* FIX: Handled with base-10 parsing to match strict enum mapping definitions without float leakage */}
            <select
              className={inputCls + ' font-semibold text-slate-700'}
              value={role}
              onChange={(e) => setRole(parseInt(e.target.value, 10))}
            >
              <option value={1}>Crayfish Farmer</option>
              <option value={2}>Distributor</option>
              <option value={3}>Transporter</option>
              <option value={4}>Vendor / Restaurant</option>
            </select>
          </FormField>

          <TxButton
            loading={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          >
            Sign Registry Parameters to Ledger
          </TxButton>
        </form>
      )}
    </div>
  );
}