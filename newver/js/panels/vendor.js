function renderVendorView() {
    const container = document.getElementById("panel-vendor");
    container.innerHTML = `
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
                <h3 class="font-bold text-emerald-900 text-sm">Vendor Role in the Workflow</h3>
                <p class="text-sm text-emerald-700 mt-1 leading-relaxed">
                    You are the endpoint node. Inspect incoming structural deliveries and broadcast matching finalization states. Accept metrics map value '2' (Delivered); Reject metrics map value '3' (Rejected).
                </p>
            </div>
        </div>

        <section class="space-y-5">
            <h3 class="text-lg font-bold text-slate-800 mb-1">Intake Confirmation</h3>
            <p class="text-sm text-slate-500">Input target identifier parameter keys and commit resolution checks criteria.</p>
            
            <div class="space-y-5">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Arriving Batch ID</label>
                    <input type="number" id="vendorBatchId" class="form-input-field" placeholder="Enter Batch ID to confirm...">
                </div>
                <div class="flex flex-col sm:flex-row gap-3 pt-1">
                    <button id="btnVendorAccept" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                        <i data-lucide="check-circle-2" class="w-4 h-4"></i> Accept Delivery (Delivered)
                    </button>
                    <button id="btnVendorReject" class="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                        <i data-lucide="x-circle" class="w-4 h-4"></i> Reject Shipment (Rejected)
                    </button>
                </div>
            </div>
        </section>
    `;

    async function broadcastVendorResolution(statusValue) {
        if(!contract) return alert("Verify core anchor identity connection.");
        const id = document.getElementById("vendorBatchId").value;
        if(!id) return alert("Please supply index values target index.");

        const btnAccept = document.getElementById("btnVendorAccept");
        const btnReject = document.getElementById("btnVendorReject");

        try {
            btnAccept.disabled = true; btnReject.disabled = true;
            const tx = await contract.updateShipmentStatus(id, statusValue);
            await tx.wait();
            alert(`Batch #${id} finalized configuration successfully on-chain.`);
            document.getElementById("vendorBatchId").value = "";
        } catch(err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            btnAccept.disabled = false; btnReject.disabled = false;
        }
    }

    document.getElementById("btnVendorAccept").addEventListener('click', () => broadcastVendorResolution(2));
    document.getElementById("btnVendorReject").addEventListener('click', () => broadcastVendorResolution(3));
}