function renderTransporterView() {
    const container = document.getElementById("panel-transporter");
    container.innerHTML = `
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
                    You are the logistics partner responsible for physical delivery. Once you take shipment of product assets, call updateShipmentStatus with metrics matching value '1' to update state metrics to <strong>"In Transit"</strong>.
                </p>
            </div>
        </div>

        <section class="space-y-4">
            <h3 class="text-lg font-bold text-slate-800 mb-1">Start Shipment Transit</h3>
            <p class="text-sm text-slate-500 mb-5">Broadcast transit lifecycle phase execution properties across the active network infrastructure.</p>
            <form id="frmTransporterTransit" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Shipment Batch ID</label>
                    <input type="number" id="transporterBatchId" class="form-input-field" placeholder="Enter the Batch ID to start transit for..." required>
                </div>
                <button type="submit" id="btnSubmitTransit" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center cursor-pointer">
                    updateShipmentStatus() — Set Status to "In Transit"
                </button>
            </form>
        </section>
    `;

    document.getElementById("frmTransporterTransit").addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!contract) return alert("Wallet identity pipeline missing mapping context.");
        const btn = document.getElementById("btnSubmitTransit");
        const id = document.getElementById("transporterBatchId").value;

        try {
            constructAwaitBlockConfirmationButtonLoader(btn, "");
            // Value 1 equates to "In Transit" status mapping
            const tx = await contract.updateShipmentStatus(id, 1);
            await tx.wait();
            alert(`Batch Tracking Reference Status #${id} successfully validated as In Transit.`);
            document.getElementById("frmTransporterTransit").reset();
        } catch(err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            constructAwaitBlockConfirmationButtonLoader(btn, "updateShipmentStatus() — Set Status to \"In Transit\"");
        }
    });
}