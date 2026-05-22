function renderTraceView() {
    const container = document.getElementById("panel-trace");
    container.innerHTML = `
        <div>
            <div class="flex items-center gap-3 mb-1">
                <div class="p-2 bg-slate-100 rounded-xl text-slate-600"><i data-lucide="search" class="w-5 h-5 text-blue-500"></i></div>
                <h2 class="text-2xl font-bold tracking-tight text-slate-900">Public Traceability Engine</h2>
            </div>
            <p class="text-sm text-slate-500 mt-1 mb-6">
                Verify origin, ownership, and full chronological logistics logs. No signature context wallet parameters required — open data matrix.
            </p>

            <form id="frmTraceSearchQuery" class="flex flex-col sm:flex-row gap-3 max-w-lg">
                <input type="number" id="txtTraceInputId" class="form-input-field flex-grow" placeholder="Enter Product Batch ID Target..." required>
                <button type="submit" id="btnSubmitTraceSearch" class="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm whitespace-nowrap transition flex items-center justify-center gap-2 cursor-pointer">
                    <i data-lucide="search" class="w-4 h-4 text-blue-400"></i> Pull On-Chain Record
                </button>
            </form>
        </div>

        <div id="traceResultsWrapper" class="space-y-4">
            <div class="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-lg mx-auto bg-slate-50/30">
                <i data-lucide="help-circle" class="w-8 h-8 text-slate-300 mx-auto mb-3"></i>
                <p class="text-sm font-semibold text-slate-600">No Records Loaded</p>
                <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Enter a numeric Batch ID in the search field above to pull its full on-chain history.</p>
            </div>
        </div>
    `;

    document.getElementById("frmTraceSearchQuery").addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!contract) return alert("Connect MetaMask runtime system identity context provider layer link.");
        
        const id = document.getElementById("txtTraceInputId").value;
        const resultsArea = document.getElementById("traceResultsWrapper");
        const btn = document.getElementById("btnSubmitTraceSearch");

        try {
            btn.disabled = true;
            btn.innerHTML = "Querying...";
            
            const data = await contract.batches(id);
            if(data.id.toString() === "0") {
                btn.disabled = false; btn.innerHTML = `<i data-lucide="search" class="w-4 h-4 text-blue-400"></i> Pull On-Chain Record`;
                lucide.createIcons();
                return alert("Target tracking structural record matching index cannot be resolved.");
            }

            const historyTimelineAddresses = await contract.getBatchHistory(id);
            let chronologicalTimelineOutput = '';
            
            historyTimelineAddresses.forEach((nodeAddr, stepIndex) => {
                chronologicalTimelineOutput += `
                    <div class="flex gap-4 items-start relative pl-8">
                        <div class="absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-4 border-slate-50 bg-blue-500 shadow-xs"></div>
                        <div class="bg-white border border-slate-200/60 p-4 rounded-xl shadow-xs flex-grow transition">
                            <span class="text-[10px] font-semibold text-slate-400 float-right bg-slate-100 px-2 py-0.5 rounded-md">Log Node #${stepIndex + 1}</span>
                            <p class="font-bold text-xs text-slate-500 uppercase tracking-wide">Custodian Signature Mapping</p>
                            <code class="text-xs font-mono break-all text-slate-600 mt-1 block">${nodeAddr}</code>
                        </div>
                    </div>
                `;
            });

            // Status style selector parameters arrays definitions matrix
            const badgesColorClasses = [
                'bg-blue-50 border-blue-200 text-blue-800',
                'bg-amber-50 border-amber-200 text-amber-800',
                'bg-emerald-50 border-emerald-200 text-emerald-800',
                'bg-rose-50 border-rose-200 text-rose-800'
            ];
            const bulletColorClasses = ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'];
            const idx = data.shipmentStatus;

            resultsArea.innerHTML = `
                <div class="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40 animate-fadeIn">
                    <div class="p-6 bg-white border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 border border-blue-200 rounded-md">BATCH ID #${data.id.toString()}</span>
                                <h3 class="font-bold text-lg text-slate-900">${data.crayfishType}</h3>
                            </div>
                            <p class="text-xs font-mono text-slate-400 truncate max-w-sm sm:max-w-md">Owner: ${data.currentOwner}</p>
                        </div>
                        <span class="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 border w-fit ${badgesColorClasses[idx]}">
                            <div class="w-1.5 h-1.5 rounded-full ${bulletColorClasses[idx]}"></div>
                            ${STATUS_MAP[idx]}
                        </span>
                    </div>

                    <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400"><i data-lucide="layers" class="w-4 h-4"></i></div>
                            <div>
                                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity</span>
                                <strong class="text-sm text-slate-800 block truncate max-w-[110px]">${data.quantity.toString()} kg</strong>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400"><i data-lucide="calendar" class="w-4 h-4"></i></div>
                            <div>
                                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harvest Date</span>
                                <strong class="text-sm text-slate-800 block truncate max-w-[110px]">${data.harvestDate}</strong>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400"><i data-lucide="map-pin" class="w-4 h-4"></i></div>
                            <div>
                                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pond/Farm Origin</span>
                                <strong class="text-sm text-slate-800 block truncate max-w-[110px]">${data.pondOrigin}</strong>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400"><i data-lucide="package" class="w-4 h-4"></i></div>
                            <div>
                                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ledger</span>
                                <strong class="text-sm text-slate-800 block truncate max-w-[110px]">AquaChain</strong>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 bg-slate-50/50 border-t border-slate-100">
                        <h4 class="text-xs font-bold uppercase text-slate-400 tracking-widest mb-5 flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5"></i> Chain of Custody Verification Audit Trail</h4>
                        <div class="space-y-4 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-slate-200">${chronologicalTimelineOutput}</div>
                    </div>
                </div>
            `;
        } catch(err) {
            console.error(err);
            alert("Error retrieving blockchain database logs context indices structures layout.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="search" class="w-4 h-4 text-blue-400"></i> Pull On-Chain Record`;
            lucide.createIcons();
        }
    });
}