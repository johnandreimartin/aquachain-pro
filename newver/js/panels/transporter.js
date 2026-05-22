/**
 * js/panels/transporter.js
 * Transporter Panel - Two-Button Logistics Pipeline Controller with Live Monitoring List
 */

function renderTransporterView() {
    const container = document.getElementById("panel-transporter");
    container.innerHTML = `
        <div class="space-y-8 animate-fadeIn">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-amber-100 rounded-xl text-amber-600"><i data-lucide="truck" class="w-5 h-5"></i></div>
                <div>
                    <h2 class="text-2xl font-bold tracking-tight text-slate-900">Transporter Panel</h2>
                    <p class="text-sm text-slate-500 mt-0.5">Step 3 of the AquaChain supply chain workflow</p>
                </div>
            </div>

            <div class="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4">
                <i data-lucide="info" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5"></i>
                <div>
                    <h3 class="font-bold text-amber-900 text-sm">Transporter Role in the Workflow</h3>
                    <p class="text-sm text-amber-700 mt-1 leading-relaxed">
                        You temporarily own the item on-chain while it is being physically moved. Provide the destination Vendor's address, update the shipment status to <strong>"In Transit"</strong> upon pickup, and to <strong>"Delivered"</strong> once it arrives.
                    </p>
                </div>
            </div>

            <section class="bg-white border border-slate-200 p-6 rounded-2xl shadow-3xs space-y-4">
                <h3 class="text-lg font-bold text-slate-800 mb-1">Manage Shipment Transit Lifecycle</h3>
                <p class="text-sm text-slate-500 mb-5">Broadcast logistical state changes and assign the destination Vendor on-chain.</p>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Shipment Batch ID</label>
                        <input type="number" id="transporterBatchId" class="form-input-field" placeholder="Enter the Batch ID to update status for..." required>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Destination Vendor Wallet Address</label>
                        <input type="text" id="transporterVendorTarget" class="form-input-field font-mono" placeholder="0x... public key coordinates" required>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3 pt-1">
                        <button type="button" id="btnTransitStart" class="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                            <i data-lucide="play" class="w-4 h-4"></i> Set "In Transit"
                        </button>
                        <button type="button" id="btnTransitArrived" class="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                            <i data-lucide="check" class="w-4 h-4"></i> Set "Delivered"
                        </button>
                    </div>
                </div>
            </section>

            <section class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">My Assigned Shipments & Cargo</h3>
                        <p class="text-xs text-slate-500">Live monitoring console tracking batches currently dispatched to your wallet address custody.</p>
                    </div>
                    <button id="btnRefreshTransporterInventory" type="button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                        <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Sync Active Shipments
                    </button>
                </div>

                <div class="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-3xs">
                    <table class="w-full text-sm text-left text-slate-600 border-collapse">
                        <thead class="text-xs uppercase tracking-wider text-slate-400 bg-slate-50/70 border-b border-slate-200">
                            <tr>
                                <th class="p-4 font-bold">Batch ID</th>
                                <th class="p-4 font-bold">Variety / Species</th>
                                <th class="p-4 font-bold">Net Weight</th>
                                <th class="p-4 font-bold">Harvest Date</th>
                                <th class="p-4 font-bold">Logistics Status</th>
                                <th class="p-4 font-bold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody id="tblTransporterInventoryBody">
                            <tr>
                                <td colspan="6" class="p-8 text-center text-slate-400 font-medium">
                                    Click "Sync Active Shipments" to scan the blockchain ledger for your assigned consignments.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `;
    lucide.createIcons();

    // Core Status Driver Handlers
    async function handleTransporterStatusChange(statusCode) {
        if(!contract) return alert("Wallet identity pipeline missing mapping context.");
        const id = document.getElementById("transporterBatchId").value;
        const vendorTarget = document.getElementById("transporterVendorTarget").value;

        if(!id) return alert("Please specify a valid Batch ID.");
        
        // Validation guard: If marking as "In Transit" (1), require the target vendor address field
        if(statusCode === 1 && !vendorTarget) {
            return alert("Please input the destination Vendor wallet address to set this shipment In Transit.");
        }

        const btnStart = document.getElementById("btnTransitStart");
        const btnArrived = document.getElementById("btnTransitArrived");

        try {
            btnStart.disabled = true; btnArrived.disabled = true;
            
            let tx;
            if (statusCode === 1) {
                // Option A: If your smart contract function supports passing the vendor target on transit start:
                // tx = await contract.startTransit(id, vendorTarget);
                
                // Option B: If using updateShipmentStatus, pass the parameters required by your contract compilation:
                tx = await contract.updateShipmentStatus(id, statusCode, vendorTarget);
            } else {
                // Marking as delivered doesn't require resending the vendor address
                tx = await contract.updateShipmentStatus(id, statusCode);
            }
            
            await tx.wait();
            
            alert(`Success: Batch #${id} status verified as: ${statusCode === 1 ? '"In Transit"' : '"Delivered"'}.`);
            document.getElementById("transporterBatchId").value = '';
            document.getElementById("transporterVendorTarget").value = '';
            
            // Auto-refresh monitor dashboard lists data
            loadAllTransporterAssignedItems();
        } catch(err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            btnStart.disabled = false; btnArrived.disabled = false;
        }
    }

    // Monitoring Board Ledger Loop Scanner Engine
    async function loadAllTransporterAssignedItems() {
        if (!contract || !activeUserAccount) {
            return alert("Please link your authorized MetaMask wallet profile credentials first.");
        }

        const tbody = document.getElementById("tblTransporterInventoryBody");
        if (!tbody) return;
        
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-8 text-center text-slate-500 font-medium">
                    <div class="flex items-center justify-center gap-2">
                        <div class="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full loading-spinner"></div>
                        Scanning Ledger Index Blocks for Your Cargo Transactions...
                    </div>
                </td>
            </tr>
        `;

        let compiledRowsHTML = '';
        let batchIndexCounter = 1;
        let itemsFoundCounter = 0;

        const statusBadgeStyles = [
            '<span class="bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Created</span>',
            '<span class="bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">In Transit</span>',
            '<span class="bg-slate-100 border border-slate-300 text-slate-600 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Delivered</span>',
            '<span class="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded text-2xs uppercase tracking-wide">Confirmed</span>',
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
                                <button type="button" onclick="loadBatchToTransporterActionField(${data.id.toString()})" class="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-2xs transition shadow-2xs cursor-pointer">
                                    Select Lot
                                </button>
                            </td>
                        </tr>
                    `;
                }
                batchIndexCounter++;
            }

            tbody.innerHTML = itemsFoundCounter === 0 
                ? `<tr><td colspan="6" class="p-8 text-center text-slate-400 font-medium italic">No active shipments or cargo custody assets found matching your transporter address.</td></tr>` 
                : compiledRowsHTML;

        } catch (err) {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-600 font-bold text-xs">Failed to fetch logistics matrix: ${err.message}.</td></tr>`;
        }
    }

    // Attach Event Handling Handshakes
    document.getElementById("btnTransitStart").addEventListener('click', () => handleTransporterStatusChange(1));
    document.getElementById("btnTransitArrived").addEventListener('click', () => handleTransporterStatusChange(2));
    document.getElementById("btnRefreshTransporterInventory").addEventListener('click', loadAllTransporterAssignedItems);
    
    if (activeUserAccount) {
        loadAllTransporterAssignedItems();
    }
}

/**
 * Global Inter-Component Variable Reference Bridge
 */
window.loadBatchToTransporterActionField = function(batchId) {
    const fieldInput = document.getElementById("transporterBatchId");
    if (fieldInput) {
        fieldInput.value = batchId;
        window.scrollTo({ top: 150, behavior: 'smooth' });
    }
};