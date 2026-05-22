function renderFarmerView() {
    const container = document.getElementById("panel-farmer");
    container.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="p-2 bg-teal-100 rounded-xl text-teal-600"><i data-lucide="fish" class="w-5 h-5"></i></div>
            <div>
                <h2 class="text-2xl font-bold tracking-tight text-slate-900">Crayfish Farmer Panel</h2>
                <p class="text-sm text-slate-500 mt-0.5">Step 1 of the AquaChain supply chain workflow</p>
            </div>
        </div>

        <section class="space-y-5">
            <div>
                <h3 class="text-lg font-bold text-slate-800 mb-1">Batch Registration</h3>
                <p class="text-sm text-slate-500">Mint a new on-chain Batch ID for a freshly harvested crayfish lot.</p>
            </div>
            <form id="frmFarmerMintBatch" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Crayfish Type / Product</label>
                    <input type="text" id="farmSpecies" class="form-input-field" placeholder="e.g. Redclaw Cherax Quadricarinatus" required>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Harvest Date</label>
                    <input type="date" id="farmDate" class="form-input-field text-slate-600" required>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Pond / Farm Origin</label>
                    <input type="text" id="farmPond" class="form-input-field" placeholder="e.g. Sector 3 Cultivation Pen" required>
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Quantity (Kilograms)</label>
                    <input type="number" id="farmQty" class="form-input-field" placeholder="Enter net weight in kg" required>
                </div>
                <div class="sm:col-span-2 pt-1">
                    <button type="submit" id="btnSubmitMintBatch" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center cursor-pointer">
                        Mint Batch Record to Ledger (Status: "Created")
                    </button>
                </div>
            </form>
        </section>

        <div class="border-t border-slate-200 pt-8 space-y-5">
            <div>
                <h3 class="text-lg font-bold text-slate-800 mb-1">Ownership Transfer</h3>
                <p class="text-sm text-slate-500">Transfer digital custody of a registered batch to a Distributor wallet.</p>
            </div>
            <form id="frmFarmerHandshakeTransfer" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Batch ID</label>
                    <input type="number" id="farmTransferId" class="form-input-field" placeholder="Batch #" required>
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Receiver Wallet Address (Distributor)</label>
                    <input type="text" id="farmTransferTarget" class="form-input-field font-mono" placeholder="0x... public key of distributor" required>
                </div>
                <div class="sm:col-span-3">
                    <button type="submit" id="btnSubmitFarmerTransfer" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center cursor-pointer">
                        Trigger transferOwnership() → Distributor
                    </button>
                </div>
            </form>
        </div>
    `;

    // Mint batch execution event listener
    document.getElementById("frmFarmerMintBatch").addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contract) return alert("MetaMask interface disconnected.");
        const btn = document.getElementById("btnSubmitMintBatch");

        const type = document.getElementById("farmSpecies").value;
        const date = document.getElementById("farmDate").value;
        const origin = document.getElementById("farmPond").value;
        const qty = document.getElementById("farmQty").value;

        try {
            constructAwaitBlockConfirmationButtonLoader(btn, "");
            const tx = await contract.registerCrayfishBatch(type, date, origin, qty);
            await tx.wait();
            alert("Success: Crayfish Batch securely written onto tracking ledger initialized as 'Created'.");
            document.getElementById("frmFarmerMintBatch").reset();
        } catch (err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            constructAwaitBlockConfirmationButtonLoader(btn, "Mint Batch Record to Ledger (Status: \"Created\")");
        }
    });

    // Transfer execution event listener
    document.getElementById("frmFarmerHandshakeTransfer").addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contract) return alert("MetaMask connection layer unverified.");
        const btn = document.getElementById("btnSubmitFarmerTransfer");

        const batchId = document.getElementById("farmTransferId").value;
        const recipient = document.getElementById("farmTransferTarget").value;

        try {
            constructAwaitBlockConfirmationButtonLoader(btn, "");
            const tx = await contract.transferOwnership(batchId, recipient);
            await tx.wait();
            alert(`Success: Custody control validation path for Batch #${batchId} successfully reassigned.`);
            document.getElementById("frmFarmerHandshakeTransfer").reset();
        } catch (err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            constructAwaitBlockConfirmationButtonLoader(btn, "Trigger transferOwnership() → Distributor");
        }
    });
}