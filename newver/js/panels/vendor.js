/**
 * js/panels/vendor.js
 * Vendor Panel - Final Delivery Settlement & Automatic Custody Transfer
 */

function renderVendorView() {
    const container = document.getElementById("panel-vendor");
    container.innerHTML = `
        <div class="space-y-8 animate-fadeIn">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-emerald-100 rounded-xl text-emerald-600"><i data-lucide="shopping-bag" class="w-5 h-5"></i></div>
                <div>
                    <h2 class="text-2xl font-bold tracking-tight text-slate-900">Vendor / Restaurant Panel</h2>
                    <p class="text-sm text-slate-500 mt-0.5">Step 4 of the AquaChain supply chain workflow</p>
                </div>
            </div>

            <div class="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 flex items-start gap-4">
                <i data-lucide="info" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"></i>
                <div>
                    <h3 class="font-bold text-emerald-900 text-sm">Vendor Intake & Settlement</h3>
                    <p class="text-sm text-emerald-700 mt-1 leading-relaxed">
                        Once the Transporter marks the items as <strong>"Delivered"</strong>, audit the history log below. Confirming receipt closes the supply chain workflow cycle and automatically transfers on-chain asset ownership to your wallet.
                    </p>
                </div>
            </div>

            <section class="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
                <div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Intake Inspection & Confirmation</h3>
                    <p class="text-sm text-slate-500">Enter a numeric Batch ID to inspect its on-chain history and accept/reject the shipment lot.</p>
                </div>
                
                <div class="space-y-4">
                    <div class="flex flex-col sm:flex-row gap-3">
                        <div class="flex-grow">
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Arriving Batch ID</label>
                            <input type="number" id="vendorBatchId" class="form-input-field" placeholder="Enter Batch ID to inspect or process...">
                        </div>
                        <div class="flex items-end">
                            <button id="btnVendorInspect" type="button" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                                <i data-lucide="search" class="w-4 h-4 text-blue-400"></i> Inspect & Audit Batch
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button id="btnVendorAccept" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                            <i data-lucide="check-circle-2" class="w-4 h-4"></i> Confirm Delivery (Claim Ownership)
                        </button>
                        <button id="btnVendorReject" class="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                            <i data-lucide="x-circle" class="w-4 h-4"></i> Reject Shipment
                        </button>
                    </div>
                </div>

                <div id="vendorAuditDisplayWrapper" class="hidden pt-4 border-t border-slate-100"></div>
            </section>

            <section class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">My Claimed & Settled Assets</h3>
                        <p class="text-xs text-slate-500">List of all product lots currently owned by your wallet address following delivery confirmation.</p>
                    </div>
                    <button id="btnRefreshVendorInventory" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                        <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Sync My Inventory
                    </button>
                </div>

                <div class="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-3xs">
                    <table class="w-full text-sm text-left text-slate-600 border-collapse">
                        <thead class="text-xs uppercase tracking-wider text-slate-400 bg-slate-50/70 border-b border-slate-200">
                            <tr>
                                <th class="p-4 font-bold">Batch ID</th>
                                <th class="p-4 font-bold">Variety / Species</th>
                                <th class="p-4 font-bold">Net Mass Weight</th>
                                <th class="p-4 font-bold">Harvest Date</th>
                                <th class="p-4 font-bold">Logistics Status</th>
                                <th class="p-4 font-bold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody id="tblVendorInventoryBody">
                            <tr>
                                <td colspan="6" class="p-8 text-center text-slate-400 font-medium">
                                    Click "Sync My Inventory" to scan the blockchain ledger for your settled assets.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `;
    lucide.createIcons();

    document.getElementById("btnVendorInspect").addEventListener('click', loadVendorTargetBatchAuditLogs);
    document.getElementById("btnRefreshVendorInventory").addEventListener('click', loadAllVendorOwnedReceivedItems);
    document.getElementById("btnVendorAccept").addEventListener('click', () => submitVendorStatusUpdateTx(true));
    document.getElementById("btnVendorReject").addEventListener('click', () => submitVendorStatusUpdateTx(false));
}

async function resolveAccountIdentityRoleText(address) {
    try {
        if (!address || address === "0x0000000000000000000000000000000000000000") return "Unassigned / Carrier Stock";
        const identityProfile = await contract.participants(address);
        if (identityProfile && identityProfile.isRegistered) {
            return `${identityProfile.name} <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold ml-1.5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">${ROLE_MAP[identityProfile.role]}</span>`;
        }
        return `External Wallet <span class="bg-slate-100 text-slate-500 border border-slate-200 font-semibold ml-1.5 px-2 py-0.5 rounded text-[10px] uppercase">Guest Node</span>`;
    } catch (err) { return `Unknown Signer Reference`; }
}

async function loadVendorTargetBatchAuditLogs() {
    if (!contract) return alert("MetaMask provider identity anchor missing.");
    const targetBatchId = document.getElementById("vendorBatchId").value;
    const auditWrapper = document.getElementById("vendorAuditDisplayWrapper");
    if (!targetBatchId) return alert("Please specify an active Batch ID to audit first.");
    
    auditWrapper.classList.remove('hidden');
    auditWrapper.innerHTML = `<div class="p-6 text-sm text-slate-500 text-center font-medium">Compiling Cryptographic Signatures & Role Logs...</div>`;

    try {
        const batchMetadata = await contract.batches(targetBatchId);
        if (batchMetadata.id.toString() === "0") return alert(`Error: Reference Batch #${targetBatchId} does not exist.`);

        const historicalAddressesArray = await contract.getBatchHistory(targetBatchId);
        let dynamicHistoryTimelineHTML = '';

        for (let i = 0; i < historicalAddressesArray.length; i++) {
            const currentWallet = historicalAddressesArray[i];
            const identityDetailsString = await resolveAccountIdentityRoleText(currentWallet);
            dynamicHistoryTimelineHTML += `
                <div class="flex gap-3 items-start relative pl-6">
                    <div class="absolute left-1 top-1.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-500 shadow-xs"></div>
                    <div class="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex-grow text-xs">
                        <span class="float-right font-mono text-[9px] bg-slate-200/60 px-1.5 py-0.5 text-slate-500 rounded font-bold">NODE STEP ${i + 1}</span>
                        <p class="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-0.5">Verified Custody Signatory</p>
                        <div class="flex items-center flex-wrap gap-1 text-slate-800 font-bold text-sm">${identityDetailsString}</div>
                        <code class="block font-mono text-[10px] text-slate-400 mt-1 break-all">${currentWallet}</code>
                    </div>
                </div>`;
        }

        auditWrapper.innerHTML = `
            <div class="bg-slate-50/40 border border-slate-200/80 rounded-xl p-4 space-y-4 animate-fadeIn">
                <p class="text-sm font-bold text-slate-800">On-Chain Audit Records: Lot Reference #${batchMetadata.id.toString()}</p>
                <div class="space-y-3 relative before:absolute before:inset-y-1 before:left-2.5 before:w-0.5 before:bg-slate-200">${dynamicHistoryTimelineHTML}</div>
            </div>`;
    } catch (err) { auditWrapper.innerHTML = `<p class="text-xs font-bold text-rose-600 p-2">Failed to load detailed role audit logs.</p>`; } finally { lucide.createIcons(); }
}

async function loadAllVendorOwnedReceivedItems() {
    if (!contract || !activeUserAccount) return alert("Please link your authorized MetaMask wallet profile credentials first.");
    const tbody = document.getElementById("tblVendorInventoryBody");
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 font-medium">Scanning Ledger Index Blocks...</td></tr>`;

    let compiledRowsHTML = ''; let batchIndexCounter = 1; let itemsFoundCounter = 0;
    const statusBadgeStyles = [
        '<span class="bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Created</span>',
        '<span class="bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">In Transit</span>',
        '<span class="bg-slate-100 border border-slate-300 text-slate-600 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Delivered</span>',
        '<span class="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Accepted</span>',
        '<span class="bg-rose-50 border border-rose-200 text-rose-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Rejected</span>'
    ];

    try {
        while (batchIndexCounter <= 50) {
            const data = await contract.batches(batchIndexCounter);
            if (data.id.toString() === "0") break;

            if (data.currentOwner.toLowerCase() === activeUserAccount.toLowerCase()) {
                itemsFoundCounter++;
                compiledRowsHTML += `
                    <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150">
                        <td class="p-4 font-mono font-bold text-slate-900">#${data.id.toString()}</td>
                        <td class="p-4 font-semibold text-slate-800">${data.crayfishType}</td>
                        <td class="p-4 font-medium text-slate-600">${data.quantity.toString()} kg</td>
                        <td class="p-4 text-xs font-medium text-slate-500">${data.harvestDate}</td>
                        <td class="p-4">${statusBadgeStyles[data.shipmentStatus]}</td>
                        <td class="p-4 text-center">
                            <button type="button" onclick="loadBatchToVendorActionField(${data.id.toString()})" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-2xs transition shadow-2xs cursor-pointer">Select Lot</button>
                        </td>
                    </tr>`;
            }
            batchIndexCounter++;
        }
        tbody.innerHTML = itemsFoundCounter === 0 ? `<tr><td colspan="6" class="p-8 text-center text-slate-400 font-medium italic">No settled batch assets found matching your active wallet address.</td></tr>` : compiledRowsHTML;
    } catch (err) { tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-600 font-bold text-xs">Failed to fetch inventory.</td></tr>`; }
}

window.loadBatchToVendorActionField = function(batchId) {
    document.getElementById("vendorBatchId").value = batchId;
    loadVendorTargetBatchAuditLogs();
};

async function submitVendorStatusUpdateTx(isAcceptedBoolean) {
    if (!contract) return alert("Web3 secure signing gateway disconnected.");
    const id = document.getElementById("vendorBatchId").value;
    if (!id) return alert("Please specify a valid numeric Batch ID to process.");

    const btnAccept = document.getElementById("btnVendorAccept");
    const btnReject = document.getElementById("btnVendorReject");

    try {
        btnAccept.disabled = true; btnReject.disabled = true;
        
        // Call explicit confirmDelivery method passing true or false boolean logic parameters
        const tx = await contract.confirmDelivery(id, isAcceptedBoolean);
        await tx.wait();
        
        alert(isAcceptedBoolean ? `Success: Delivery confirmed! Ownership has automatically transferred to you.` : `Shipment marked as Rejected.`);
        document.getElementById("vendorBatchId").value = "";
        document.getElementById("vendorAuditDisplayWrapper").classList.add('hidden');
        loadAllVendorOwnedReceivedItems();
    } catch (err) { alert("Transaction failed: " + (err.reason || err.message)); } finally { btnAccept.disabled = false; btnReject.disabled = false; }
}