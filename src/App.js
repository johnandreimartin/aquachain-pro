import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';

// Layout
import { Header }  from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { HomePage }       from './pages/HomePage';
import { RegisterPage }   from './roles/register/RegisterPage';
import { FarmerPage }     from './roles/farmer/FarmerPage';
import { DistributorPage } from './roles/distributor/DistributorPage';
import { TransporterPage } from './roles/transporter/TransporterPage';
import { VendorPage }     from './roles/vendor/VendorPage';
import { TracePage }      from './roles/trace/TracePage';

// Tab → Component map
const PAGES = {
  home:        (props) => <HomePage       onSelectRole={props.onSelectRole} />,
  register:    (props) => <RegisterPage   contract={props.contract} myProfile={props.myProfile} />,
  farmer:      (props) => <FarmerPage     contract={props.contract} />,
  distributor: (props) => <DistributorPage contract={props.contract} />,
  transporter: (props) => <TransporterPage contract={props.contract} />,
  vendor:      (props) => <VendorPage     contract={props.contract} />,
  trace:       (props) => <TracePage      contract={props.contract} />,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { account, contract, myProfile, network, connectWallet, switchNetwork } = useWallet();

  const pageProps = {
    contract,
    myProfile,
    onSelectRole: (role) => setActiveTab(role),
  };

  const ActivePage = PAGES[activeTab] || PAGES['home'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased font-sans">

      <Header
        account={account}
        myProfile={myProfile}
        network={network}
        onSwitchNetwork={switchNetwork}
        onConnectWallet={connectWallet}
      />

      {/* Main grid */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">

        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative">
          <ActivePage {...pageProps} />
        </main>

      </div>

      <footer className="bg-white border-t border-slate-200/60 mt-auto py-4 text-center text-xs font-medium text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 AquaChain Supply Chain Registries.</p>
          <p className="font-mono text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-500">
            FRE403 · Blockchain Project Demo Build
          </p>
        </div>
      </footer>

    </div>
  );
}
