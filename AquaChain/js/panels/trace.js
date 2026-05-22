/**
 * js/panels/trace.js
 * Enhanced Public Traceability Engine with Batch Monitoring Table
 * and On-Chain Node Role Verification.
 */

function renderTraceView() {
    const container = document.getElementById("panel-trace");
    container.innerHTML = `
        <div class="space-y-6">
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

            <div id="traceResultsWrapper">
                <div class="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-lg mx-auto bg-slate-50/30">
                    <i data-lucide="help-circle" class="w-8 h-8 text-slate-300 mx-auto mb-3"></i>
                    <p class="text-sm font-semibold text-slate-600">No Target Records Loaded</p>
                    <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Enter a numeric Batch ID or select a row from the monitoring board console below to audit.</p>
                </div>
            </div>

            <div class="pt-6 border-t border-slate-200 space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Global Batch Monitoring Console</h3>
                        <p class="text-xs text-slate-500">Live network monitor board aggregating all ledger assets emitted on-chain.</p>
                    </div>
                    <button id="btnFetchAllBatches" type="button" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                        <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Refresh Monitor Table
                    </button>
                </div>

                <div class="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-2xs">
                    <table class="w-full text-sm text-left text-slate-600 border-collapse">
                        <thead class="text-xs uppercase tracking-wider text-slate-400 bg-slate-50/70 border-b border-slate-200">
                            <tr>
                                <th class="p-4 font-bold">ID</th>
                                <th class="p-4 font-bold">Product Variety</th>
                                <th class="p-4 font-bold">Net Mass Weight</th>
                                <th class="p-4 font-bold">Active Custodian Node Entity & Role</th>
                                <th class="p-4 font-bold">Logistics State</th>
                                <th class="p-4 font-bold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody id="tblAllBatchesBody">
                            <tr>
                                <td colspan="6" class="p-8 text-center text-slate-400 font-medium">
                                    Click "Refresh Monitor Table" to synchronize live records from the Sepolia network.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Reinitialize graphic design visual engine icons alignment
    lucide.createIcons();

    // Attach active runtime element action intercept routing hooks
    document.getElementById("frmTraceSearchQuery").addEventListener('submit', executeTargetTraceQueryAuditSearch);
    document.getElementById("btnFetchAllBatches").addEventListener('click', loadAllLedgerBatchesIntoTableMonitor);
}

/**
 * On-Chain Utility Helper Routine: Resolves name and role parameters 
 * for any given address using the participant mapping array.
 */
async function fetchNodeProfileInfo(address) {
    try {
        if (!address || address === "0x0000000000000000000000000000000000000000") {
            return "Unassigned / None";
        }
        const profile = await contract.participants(address);
        if (profile && profile.role > 0) {
            // Returns formatted text displaying: Business Name [Role Title]
            return `${profile.name} <span class="text-blue-500 font-bold ml-1 px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded text-[10px] uppercase tracking-wide">${ROLE_MAP[profile.role]}</span>`;
        }
        return `External Actor <span class="text-slate-400 font-semibold ml-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] uppercase">Guest Node</span>`;
    } catch (e) {
        return `Unknown Signer Address`;
    }
}

/**
 * Execution Engine: Sequentially loops and builds a list summary 
 * of all registered items until finding an uninitialized batch index.
 */
async function loadAllLedgerBatchesIntoTableMonitor() {
    if (!contract) return alert("Please hook up and authorize your MetaMask secure wallet interface first.");
    
    const tbody = document.getElementById("tblAllBatchesBody");
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="p-8 text-center text-slate-500 font-medium">
                <div class="flex items-center justify-center gap-2">
                    <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full loading-spinner"></div>
                    Scanning Decentralized Ledger Storage Blocks...
                </div>
            </td>
        </tr>
    `;

    let htmlContent = '';
    let idCounter = 1;
    let recordsFound = 0;

    const statusBadges = [
        '<span class="bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Created</span>',
        '<span class="bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">In Transit</span>',
        '<span class="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Delivered</span>',
        '<span class="bg-rose-50 border border-rose-200 text-rose-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Rejected</span>'
    ];

    try {
        // Sequentially inspect ledger parameters; safety boundary capped at 50 loops to avoid network timeouts
        while (idCounter <= 50) {
            const data = await contract.batches(idCounter);
            
            // If mapping returns id = 0, the sequential register chain boundary has been reached
            if (data.id.toString() === "0") {
                break;
            }

            recordsFound++;
            const custodianDetails = await fetchNodeProfileInfo(data.currentOwner);

            htmlContent += `
                <tr class="border-b border-slate-100 hover:bg-slate-50/60 transition duration-150">
                    <td class="p-4 font-mono font-bold text-slate-900">#${data.id.toString()}</td>
                    <td class="p-4 font-semibold text-slate-800">${data.crayfishType}</td>
                    <td class="p-4 font-medium text-slate-600">${data.quantity.toString()} kg</td>
                    <td class="p-4 text-xs">
                        <div class="flex items-center gap-1.5 mb-0.5">${custodianDetails}</div>
                        <code class="text-slate-400 font-mono text-[10px] break-all block">${data.currentOwner}</code>
                    </td>
                    <td class="p-4">${statusBadges[data.shipmentStatus]}</td>
                    <td class="p-4 text-center">
                        <button type="button" onclick="quickQueryBatchTrace(${data.id.toString()})" class="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-2xs transition shadow-2xs cursor-pointer">
                            Trace Audit
                        </button>
                    </td>
                </tr>
            `;
            idCounter++;
        }

        if (recordsFound === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-slate-400 font-medium">
                        No active product batches currently committed onto the deployed smart contract instance registry.
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = htmlContent;
        }

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-8 text-center text-rose-600 font-bold text-xs">
                    Failed to sync database monitor blocks: ${err.message}
                </td>
            </tr>
        `;
    }
}

/**
 * Interactive Routine Shortcut Link Trigger: Enables quick analysis directly 
 * from selecting lines on the live monitor board grid display view.
 */
window.quickQueryBatchTrace = function(batchId) {
    document.getElementById("txtTraceInputId").value = batchId;
    // Emulate form submission action
    document.getElementById("btnSubmitTraceSearch").click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Search Routine Logic Handler: Audits specific isolated ledger targets 
 * while dynamically printing verifying identities roles credentials alongside histories.
 */
async function executeTargetTraceQueryAuditSearch(e) {
    e.preventDefault();
    if (!contract) return alert("Establish system identity linking context.");
    
    const searchId = document.getElementById("txtTraceInputId").value;
    const resultsArea = document.getElementById("traceResultsWrapper");
    const btn = document.getElementById("btnSubmitTraceSearch");

    try {
        btn.disabled = true;
        btn.innerHTML = "Querying Database...";

        const data = await contract.batches(searchId);
        if (data.id.toString() === "0") {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="search" class="w-4 h-4 text-blue-400"></i> Pull On-Chain Record`;
            lucide.createIcons();
            return alert("The requested search batch trace structural record matching that index cannot be found.", "error");
        }

        // Fetch the raw history trail string map array matrices from blockchain logs storage
        const historyTimelineAddresses = await contract.getBatchHistory(searchId);
        
        // Resolve target owner profile parameters dynamically next to identity string arrays mapping
        const currentOwnerProfileText = await fetchNodeProfileInfo(data.currentOwner);

        // Standard sequential parsing loop allows asynchronous network fetching context inside chronological maps
        let chronologicalTimelineOutput = '';
        for (let stepIndex = 0; stepIndex < historyTimelineAddresses.length; stepIndex++) {
            const nodeAddr = historyTimelineAddresses[stepIndex];
            const actorProfileText = await fetchNodeProfileInfo(nodeAddr);

            chronologicalTimelineOutput += `
                <div class="flex gap-4 items-start relative pl-8">
                    <div class="absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-4 border-slate-50 bg-blue-500 shadow-2xs"></div>
                    <div class="bg-white border border-slate-200/60 p-4 rounded-xl shadow-3xs flex-grow transition hover:border-slate-300">
                        <span class="text-[10px] font-semibold text-slate-400 float-right bg-slate-100 px-2 py-0.5 rounded-md">Log Step #${stepIndex + 1}</span>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Authorized Signatory Profile</p>
                        <div class="flex items-center gap-1.5 text-sm font-bold text-slate-900">${actorProfileText}</div>
                        <code class="text-[11px] font-mono break-all text-slate-400 mt-1 block">${nodeAddr}</code>
                    </div>
                </div>
            `;
        }

        const badgesColorClasses = [
            'bg-blue-50 border-blue-200 text-blue-800',
            'bg-amber-50 border-amber-200 text-amber-800',
            'bg-emerald-50 border-emerald-200 text-emerald-800',
            'bg-rose-50 border-rose-200 text-rose-800'
        ];
        const bulletColorClasses = ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'];
        const idx = data.shipmentStatus;

        resultsArea.innerHTML = `
            <div class="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40 animate-fadeIn shadow-3xs">
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
                            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pond Origin</span>
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
                    
                    <div class="col-span-2 md:col-span-4 bg-slate-50 border border-slate-200/70 p-4 rounded-xl shadow-3xs">
                        <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current On-Chain Custodian Node Details</span>
                        <div class="flex items-center gap-1.5 text-sm font-bold text-slate-800">${currentOwnerProfileText}</div>
                        <code class="text-xs font-mono text-slate-500 mt-1 block break-all">${data.currentOwner}</code>
                    </div>
                </div>

                <div class="p-6 bg-slate-50/50 border-t border-slate-100">
                    <h4 class="text-xs font-bold uppercase text-slate-400 tracking-widest mb-5 flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5"></i> Chain of Custody Verification Audit Trail</h4>
                    <div class="space-y-4 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-slate-200">
                        ${chronologicalTimelineOutput || '<p class="text-xs text-slate-400 italic pl-8">No transfer handshakes recorded for this batch lot asset.</p>'}
                    </div>
                </div>
            </div>
        `;

    } catch (err) {
        console.error(err);
        alert("Error executing query: Check RPC provider state connectivity.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="search" class="w-4 h-4 text-blue-400"></i> Pull On-Chain Record`;
        lucide.createIcons();
    }
}