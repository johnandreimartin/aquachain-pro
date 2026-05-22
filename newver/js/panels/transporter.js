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
                        You temporarily own the item on-chain while it is being physically moved. Update the shipment status to <strong>"In Transit"</strong> upon pickup, and to <strong>"Delivered"</strong> once it arrives at the destination.
                    </p>
                </div>
            </div>

            <section class="space-y-4">
                <h3 class="text-lg font-bold text-slate-800 mb-1">Manage Shipment Transit Lifecycle</h3>
                <p class="text-sm text-slate-500 mb-5">Broadcast logistical state changes to alert the receiving Vendor downstream.</p>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Shipment Batch ID</label>
                        <input type="number" id="transporterBatchId" class="form-input-field" placeholder="Enter the Batch ID to update status for..." required>
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
        </div>
    `;
    lucide.createIcons();

    async function handleTransporterStatusChange(statusCode) {
        if(!contract) return alert("Wallet identity pipeline missing mapping context.");
        const id = document.getElementById("transporterBatchId").value;
        if(!id) return alert("Please specify a valid Batch ID.");

        const btnStart = document.getElementById("btnTransitStart");
        const btnArrived = document.getElementById("btnTransitArrived");

        try {
            btnStart.disabled = true; btnArrived.disabled = true;
            const tx = await contract.updateShipmentStatus(id, statusCode);
            await tx.wait();
            
            alert(`Success: Batch #${id} status verified as: ${statusCode === 1 ? '"In Transit"' : '"Delivered"'}.`);
            document.getElementById("transporterBatchId").value = '';
        } catch(err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            btnStart.disabled = false; btnArrived.disabled = false;
        }
    }

    document.getElementById("btnTransitStart").addEventListener('click', () => handleTransporterStatusChange(1));
    document.getElementById("btnTransitArrived").addEventListener('click', () => handleTransporterStatusChange(2));
}