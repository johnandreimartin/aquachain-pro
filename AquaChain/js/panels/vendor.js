/**
 * js/panels/vendor.js
 * Vendor Panel - Downstream Custody Confirmation, Audit Inspection Engine,
 * and Final Handshake Lifecycle Manager
 */

function renderVendorView() {
    const container = document.getElementById("panel-vendor");
    container.innerHTML = `
        <div class="space-y-8 animate-fadeIn">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-emerald-100 rounded-xl text-emerald-600"><i data-lucide="store" class="w-5 h-5"></i></div>
                <div>
                    <h2 class="text-2xl font-bold tracking-tight text-slate-900">Vendor / Restaurant Panel</h2>
                    <p class="text-sm text-slate-500 mt-0.5">Step 4 of the AquaChain supply chain workflow (Final Handshake)</p>
                </div>
            </div>

            <div class="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 flex items-start gap-4">
                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i>
                <div>
                    <h3 class="font-bold text-emerald-900 text-sm">On-Chain Custody Verification</h3>
                    <p class="text-sm text-emerald-700 mt-1 leading-relaxed">
                        The transporter has physically delivered the cargo and transferred digital title to your wallet. 
                        <strong>Make sure your MetaMask is connected to your Vendor wallet address</strong> before confirming receipt to avoid ownership verification reverts.
                    </p>
                </div>
            </div>

            <!-- Receipt Confirmation Form -->
            <section class="bg-white border border-slate-200 p-6 rounded-2xl shadow-3xs space-y-4">
                <h3 class="text-lg font-bold text-slate-800 mb-1">Acknowledge & Confirm Cargo Receipt</h3>
                <p class="text-sm text-slate-500 mb-5">Inspect your delivery, then sign the final receipt block to close the custody tracking pipeline.</p>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Batch ID to Finalize</label>
                        <input type="number" id="vendorBatchId" class="form-input-field w-full md:w-1/2" placeholder="Enter Batch ID (e.g. 1)">
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3 pt-1">
                        <button type="button" id="btnVendorConfirm" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                            <i data-lucide="check-circle" class="w-4 h-4"></i> Confirm Delivery & Accept Cargo
                        </button>
                        <button type="button" id="btnVendorReject" class="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                            <i data-lucide="x-circle" class="w-4 h-4"></i> Flag / Reject Shipment Issue
                        </button>
                    </div>
                </div>
            </section>

            <!-- Inventory Intake Monitoring Sheet -->
            <section class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Incoming Deliveries & Custody Lots</h3>
                        <p class="text-xs text-slate-500">List of product batches where digital ownership has been transferred to you by the Transporter.</p>
                    </div>
                    <button id="btnRefreshVendorInventory" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                        <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Scan Intake Assets
                    </button>
                </div>

                <div class="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-3xs">
                    <table class="w-full text-sm text-left text-slate-600 border-collapse">
                        <thead class="text-xs uppercase tracking-wider text-slate-400 bg-slate-50/70 border-b border-slate-200">
                            <tr>
                                <th class="p-4 font-bold">Batch ID</th>
                                <th class="p-4 font-bold">Product Variety</th>
                                <th class="p-4 font-bold">Weight Block</th>
                                <th class="p-4 font-bold">Current Custodian Owner</th>
                                <th class="p-4 font-bold">Status</th>
                                <th class="p-4 font-bold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody id="tblVendorInventoryBody">
                            <tr>
                                <td colspan="6" class="p-8 text-center text-slate-400 font-medium">
                                    Click "Scan Intake Assets" to find batches transferred to your address.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>

        <!-- Pop-up Vendor Confirmation Success Certificate Modal -->
        <div id="vendorSuccessModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 hidden opacity-0 transition-opacity duration-300">
            <div class="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden transform scale-95 transition-transform duration-300" id="vendorSuccessModalCard">
                <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="p-1.5 bg-white/20 rounded-lg"><i data-lucide="award" class="w-4 h-4 text-white"></i></div>
                        <h4 class="font-bold tracking-tight">Final Intake Receipt Secured</h4>
                    </div>
                    <button type="button" onclick="closeVendorSuccessModal()" class="text-white/80 hover:text-white cursor-pointer transition">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                
                <div class="p-6 space-y-5 text-sm text-slate-600" id="vendorSuccessModalContent"></div>
                
                <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button type="button" onclick="closeVendorSuccessModal()" class="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer">
                        Dismiss Certificate
                    </button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();

    // Core Function: Handle State Confirmations (Status 3 = Confirmed, 4 = Rejected)
    async function handleVendorResolution(statusCode) {
        if (!contract) return alert("Web3 identity layer missing context link mappings.");
        
        const batchId = document.getElementById("vendorBatchId").value;
        if (!batchId) return alert("Please clarify which Batch ID you are signing off for.");

        const btnConfirm = document.getElementById("btnVendorConfirm");
        const btnReject = document.getElementById("btnVendorReject");

        try {
            btnConfirm.disabled = true; btnReject.disabled = true;

            // CRITICAL FIX: Since transporter.js ALREADY called transferOwnership to the vendor,
            // your wallet must match the new currentOwner. We ONLY call updateShipmentStatus here.
            alert(`Sending signed resolution block for Batch #${batchId}...`);
            const tx = await contract.updateShipmentStatus(batchId, statusCode);
            await tx.wait();

            // Fetch the updated smart contract variables to display on the receipt popup card
            const updatedBatch = await contract.batches(batchId);

            if (statusCode === 3) {
                displayVendorPopupCertificate(batchId, updatedBatch);
            } else {
                alert(`Batch #${batchId} has been successfully flagged/rejected on the blockchain ledger.`);
            }

            document.getElementById("vendorBatchId").value = '';
            loadVendorIncomingInventory();
        } catch (err) {
            console.error(err);
            // Informative error correction advice for presentation day
            if (err.message.includes("reverted") || err.reason?.includes("owner")) {
                alert("Execution Reverted: You are not recognized as the batch owner. Ensure MetaMask is switched to your Vendor wallet address, and that the Transporter has fully completed their step first.");
            } else {
                alert("Transaction processing failed: " + (err.reason || err.message));
            }
        } finally {
            btnConfirm.disabled = false; btnReject.disabled = false;
        }
    }

    // Engine: Scan for Items Owned by Vendor
    async function loadVendorIncomingInventory() {
        if (!contract || !activeUserAccount) return;

        const tbody = document.getElementById("tblVendorInventoryBody");
        if (!tbody) return;

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-8 text-center text-slate-500 font-medium">
                    <div class="flex items-center justify-center gap-2">
                        <div class="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full loading-spinner"></div>
                        Querying Blockchain Storage Matrices for Transferred Lots...
                    </div>
                </td>
            </tr>
        `;

        let compiledRowsHTML = ''; let index = 1; let itemsCounter = 0;
        const statusBadgeStyles = [
            '<span class="bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Created</span>',
            '<span class="bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">In Transit</span>',
            '<span class="bg-slate-100 border border-slate-300 text-slate-600 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Delivered</span>',
            '<span class="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Confirmed</span>',
            '<span class="bg-rose-50 border border-rose-200 text-rose-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Rejected</span>'
        ];

        try {
            while (index <= 50) {
                const data = await contract.batches(index);
                if (data.id.toString() === "0") break;

                // Match items where the vendor is now the true owner on-chain
                if (data.currentOwner.toLowerCase() === activeUserAccount.toLowerCase()) {
                    itemsCounter++;
                    compiledRowsHTML += `
                        <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150">
                            <td class="p-4 font-mono font-bold text-slate-900">#${data.id.toString()}</td>
                            <td class="p-4 font-semibold text-slate-800">${data.crayfishType}</td>
                            <td class="p-4 font-medium text-slate-600">${data.quantity.toString()} kg</td>
                            <td class="p-4 font-mono text-xs text-slate-400 truncate max-w-[130px]" title="${data.currentOwner}">${data.currentOwner}</td>
                            <td class="p-4">${statusBadgeStyles[data.shipmentStatus]}</td>
                            <td class="p-4 text-center">
                                <button type="button" onclick="loadBatchToVendorActionField(${data.id.toString()})" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-2xs transition shadow-2xs cursor-pointer">
                                    Select
                                </button>
                            </td>
                        </tr>
                    `;
                }
                index++;
            }
            tbody.innerHTML = itemsCounter === 0 
                ? `<tr><td colspan="6" class="p-8 text-center text-slate-400 font-medium italic">No batches matching your current Vendor wallet address custody mapping. Ensure the Transporter has triggered delivery transfer.</td></tr>` 
                : compiledRowsHTML;
        } catch (err) {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-600 font-bold text-xs">Ledger tracking inquiry failed: ${err.message}</td></tr>`;
        }
    }

    // Attach Interactions
    document.getElementById("btnVendorConfirm").addEventListener('click', () => handleVendorResolution(3));
    document.getElementById("btnVendorReject").addEventListener('click', () => handleVendorResolution(4));
    document.getElementById("btnRefreshVendorInventory").addEventListener('click', loadVendorIncomingInventory);

    if (activeUserAccount) {
        loadVendorIncomingInventory();
    }
}

// Interactive Sign-Off Popup Card Renderer
function displayVendorPopupCertificate(batchId, metadata) {
    const modal = document.getElementById("vendorSuccessModal");
    const container = document.getElementById("vendorSuccessModalContent");
    const timestamp = new Date().toLocaleString();

    container.innerHTML = `
        <div class="text-center pb-3 border-b border-dashed border-slate-200">
            <div class="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-2">
                <i data-lucide="badge-check" class="w-6 h-6"></i>
            </div>
            <h5 class="text-base font-bold text-slate-800">Supply Chain Ledger Complete</h5>
            <p class="text-xs text-slate-400">Intake validated and recorded on-chain at ${timestamp}</p>
        </div>
        
        <div class="space-y-2 py-1 text-xs text-slate-600">
            <div class="flex justify-between"><span class="text-slate-400 font-medium">Batch Reference</span><span class="font-mono font-bold text-slate-900">#${batchId}</span></div>
            <div class="flex justify-between"><span class="text-slate-400 font-medium">Final State Code</span><span class="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">STATUS: CONFIRMED</span></div>
            <div class="flex justify-between"><span class="text-slate-400 font-medium">Product Item Details</span><span class="font-bold text-slate-800">${metadata.crayfishType}</span></div>
            <div class="flex justify-between"><span class="text-slate-400 font-medium">Consignment Weight</span><span class="font-bold text-slate-800">${metadata.quantity.toString()} kg</span></div>
            <div class="flex justify-between"><span class="text-slate-400 font-medium">On-Chain Custodian</span><span class="font-mono text-emerald-600 font-bold truncate max-w-[220px]">${metadata.currentOwner}</span></div>
        </div>

        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div class="p-2 bg-slate-900 rounded-lg text-amber-400 shrink-0"><i data-lucide="sparkles" class="w-4 h-4"></i></div>
            <div class="text-[11px] text-slate-400 leading-normal">
                <strong>Project Verification Note:</strong> The supply lifecycle loop has cleanly resolved. Consumer audit tracking panels will now tag this batch as trusted inventory.
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        document.getElementById("vendorSuccessModalCard").classList.remove("scale-95");
    }, 20);

    lucide.createIcons();
}

window.closeVendorSuccessModal = function() {
    const modal = document.getElementById("vendorSuccessModal");
    const card = document.getElementById("vendorSuccessModalCard");
    
    modal.classList.add("opacity-0");
    card.classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
};

/**
 * Global Bridge Reference
 */
window.loadBatchToVendorActionField = function(batchId) {
    const fieldInput = document.getElementById("vendorBatchId");
    if (fieldInput) {
        fieldInput.value = batchId;
        window.scrollTo({ top: 100, behavior: 'smooth' });
    }
};