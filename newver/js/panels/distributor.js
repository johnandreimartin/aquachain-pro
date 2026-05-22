function renderDistributorView() {
    const container = document.getElementById("panel-distributor");
    container.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="p-2 bg-violet-100 rounded-xl text-violet-600"><i data-lucide="users" class="w-5 h-5"></i></div>
            <div>
                <h2 class="text-2xl font-bold tracking-tight text-slate-900">Distributor Panel</h2>
                <p class="text-sm text-slate-500 mt-0.5">Step 2 of the AquaChain supply chain workflow</p>
            </div>
        </div>

        <div class="bg-violet-50 border border-violet-200/60 rounded-2xl p-5 flex items-start gap-4">
            <i data-lucide="info" class="w-5 h-5 text-violet-500 shrink-0 mt-0.5"></i>
            <div>
                <h3 class="font-bold text-violet-900 text-sm">Distributor Role in the Workflow</h3>
                <p class="text-sm text-violet-700 mt-1 leading-relaxed">
                    Once the Farmer assigns ownership to your address, you become the tracking node owner. Forward custody downstream to the final Vendor node.
                </p>
                <div class="mt-3 flex items-center gap-2 text-xs text-violet-600 font-semibold">
                    <span class="bg-white border border-violet-200 px-2 py-1 rounded-lg">Farmer</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    <span class="bg-violet-200 border border-violet-300 px-2 py-1 rounded-lg font-bold">Distributor ← You</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    <span class="bg-white border border-violet-200 px-2 py-1 rounded-lg">Vendor</span>
                </div>
            </div>
        </div>

        <section class="space-y-5">
            <div>
                <h3 class="text-lg font-bold text-slate-800 mb-1">Forward Batch to Vendor</h3>
                <p class="text-sm text-slate-500">As a batch owner, transfer custody validation paths downstream to the Restaurant node destination.</p>
            </div>
            <form id="frmDistributorTransfer" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Owned Batch ID</label>
                    <input type="number" id="distBatchId" class="form-input-field" placeholder="Batch #" required>
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Vendor / Restaurant Wallet Address</label>
                    <input type="text" id="distVendorTarget" class="form-input-field font-mono" placeholder="0x... destination vendor wallet" required>
                </div>
                <div class="sm:col-span-3">
                    <button type="submit" id="btnSubmitDistributorTransfer" class="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center cursor-pointer">
                        transferOwnership() → Vendor/Restaurant
                    </button>
                </div>
            </form>
        </section>
    `;

    document.getElementById("frmDistributorTransfer").addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!contract) return alert("Web3 operational provider interface link missing.");
        const btn = document.getElementById("btnSubmitDistributorTransfer");

        const id = document.getElementById("distBatchId").value;
        const target = document.getElementById("distVendorTarget").value;

        try {
            constructAwaitBlockConfirmationButtonLoader(btn, "");
            const tx = await contract.transferOwnership(id, target);
            await tx.wait();
            alert(`Success: Custody assignment matching Reference Lot #${id} passed downstream.`);
            document.getElementById("frmDistributorTransfer").reset();
        } catch(err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            constructAwaitBlockConfirmationButtonLoader(btn, "transferOwnership() → Vendor/Restaurant");
        }
    });
}