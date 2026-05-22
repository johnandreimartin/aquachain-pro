function renderHomeView() {
    const container = document.getElementById("panel-home");
    container.innerHTML = `
        <div class="text-center max-w-2xl mx-auto pt-4">
            <div class="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                <i data-lucide="shield" class="w-3.5 h-3.5"></i> FRE403 Blockchain Project Demo
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                AquaChain <span class="text-blue-600">Supply Chain Ledger</span>
            </h1>
            <p class="text-slate-500 mt-3 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                A blockchain-driven aquaculture traceability system for farmed crayfish. 
                Select a stakeholder role on the sidebar to explore its interface and on-chain capabilities.
            </p>
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-3xl mx-auto">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <i data-lucide="layers" class="w-3.5 h-3.5"></i> Supply Chain Workflow Path
            </p>
            <div class="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-600">
                <span class="bg-white border border-slate-200 px-3 py-1.5 rounded-lg">Farmer</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-300"></i>
                <span class="bg-white border border-slate-200 px-3 py-1.5 rounded-lg">Distributor</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-300"></i>
                <span class="bg-white border border-slate-200 px-3 py-1.5 rounded-lg">Vendor / Restaurant</span>
            </div>
        </div>

        <div>
            <p class="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4 text-blue-500"></i> Select a dashboard module shortcut view channel:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button onclick="switchActiveDisplayPanelTab('register')" class="text-left border-2 border-blue-200 hover:border-blue-400 bg-white p-5 rounded-2xl transition duration-200 hover:shadow-lg group cursor-pointer">
                    <div class="flex items-start justify-between mb-3">
                        <div class="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><i data-lucide="user-check" class="w-5 h-5"></i></div>
                        <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-600 text-white">SETUP</span>
                    </div>
                    <h3 class="font-bold text-slate-900 text-base">Node Enrollment</h3>
                    <p class="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">Register your decentralized wallet credentials parameter mappings index profile data onto the blockchain core index registry context ledger.</p>
                    <div class="w-full text-center text-xs font-bold py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 group-hover:shadow-md transition">Open Onboarding Panel →</div>
                </button>

                <button onclick="switchActiveDisplayPanelTab('farmer')" class="text-left border-2 border-teal-200 hover:border-teal-400 bg-white p-5 rounded-2xl transition duration-200 hover:shadow-lg group cursor-pointer">
                    <div class="flex items-start justify-between mb-3">
                        <div class="p-2.5 bg-teal-100 text-teal-600 rounded-xl"><i data-lucide="fish" class="w-5 h-5"></i></div>
                        <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-600 text-white">STEP 1</span>
                    </div>
                    <h3 class="font-bold text-slate-900 text-base">Crayfish Farmer</h3>
                    <p class="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">Mint harvested batch lots structural metadata directly into smart contract chains variables records tracking storage elements blocks tracking allocations.</p>
                    <div class="w-full text-center text-xs font-bold py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-700 group-hover:shadow-md transition">Open Farmer Panel →</div>
                </button>

                <button onclick="switchActiveDisplayPanelTab('distributor')" class="text-left border-2 border-violet-200 hover:border-violet-400 bg-white p-5 rounded-2xl transition duration-200 hover:shadow-lg group cursor-pointer">
                    <div class="flex items-start justify-between mb-3">
                        <div class="p-2.5 bg-violet-100 text-violet-600 rounded-xl"><i data-lucide="users" class="w-5 h-5"></i></div>
                        <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-violet-600 text-white">STEP 2</span>
                    </div>
                    <h3 class="font-bold text-slate-900 text-base">Distributor</h3>
                    <p class="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">Accept allocations custody validations paths handshakes transferring digital access tracking indices upstream toward restaurant configurations.</p>
                    <div class="w-full text-center text-xs font-bold py-2 rounded-lg text-white bg-violet-600 hover:bg-violet-700 group-hover:shadow-md transition">Open Distributor Panel →</div>
                </button>
            </div>
        </div>
    `;
}