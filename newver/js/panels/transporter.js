/**
 * js/panels/transporter.js
 * Transporter Control Panel with Dynamic Vendor Selection Menu Dropdown
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
                        You temporarily own the item on-chain while it is physically moved. Select a destination Vendor from the dropdown menu, click <strong>"Set In Transit"</strong> upon pickup, and click <strong>"Set Delivered"</strong> once it arrives.
                    </p>
                </div>
            </div>

            <section class="bg-white border border-slate-200 p-6 rounded-2xl shadow-3xs space-y-4">
                <h3 class="text-lg font-bold text-slate-800 mb-1">Manage Shipment Transit Lifecycle</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Shipment Batch ID</label>
                        <input type="number" id="transporterBatchId" class="form-input-field" placeholder="Enter the Batch ID to update status for..." required>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Destination Vendor / Restaurant Destination</label>
                        <select id="ddlTargetVendorSelection" class="form-input-field bg-white font-semibold text-slate-700">
                            <option value="">-- Fetching Registered Vendors from Blockchain... --</option>
                        </select>
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

    // Trigger vendor discovery loop on initialization
    if (contract) {
        discoverAndPopulateVendorNodes();
    }

    /**
     * Node Discovery Loop: Queries participantAddresses array inside contract 
     * to filter out entities with role context index 4 (Vendors)
     */
    async function discoverAndPopulateVendorNodes() {
        const dropdown = document.getElementById("ddlTargetVendorSelection");
        try {
            const rawCount = await contract.getParticipantAddressesCount();
            const totalAddresses = Number(rawCount);
            let dropDownOptionsHTML = '<option value="">-- Choose Target Destination Vendor --</option>';
            let vendorCount = 0;

            for (let i = 0; i < totalAddresses; i++) {
                const addr = await contract.participantAddresses(i);
                const profile = await contract.participants(addr);
                
                // Role '4' corresponds to the Vendor/Restaurant stakeholder index
                if (Number(profile.role) === 4) {
                    vendorCount++;
                    dropDownOptionsHTML += `<option value="${addr}">${profile.name} (${addr.substring(0,6)}...${addr.substring(38)})</option>`;
                }
            }

            if (vendorCount === 0) {
                dropdown.innerHTML = '<option value="">No registered vendors found on-chain</option>';
            } else {
                dropdown.innerHTML = dropDownOptionsHTML;
            }
        } catch (err) {
            console.error(err);
            dropdown.innerHTML = '<option value="">Error loading vendor nodes registry</option>';
        }
    }

    // Direct interface connection mappings to specific pipeline endpoints
    async function executeStartTransitTx() {
        if (!contract) return alert("MetaMask interface disconnected.");
        const id = document.getElementById("transporterBatchId").value;
        const selectedVendor = document.getElementById("ddlTargetVendorSelection").value;

        if (!id) return alert("Please clarify target batch index parameters.");
        if (!selectedVendor) return alert("Please select a valid destination Vendor from the menu dropdown.");

        const btn = document.getElementById("btnTransitStart");
        try {
            btn.disabled = true;
            const tx = await contract.startTransit(id, selectedVendor);
            await tx.wait();
            alert(`Success: Batch #${id} marked as In Transit. Assigned recipient: ${selectedVendor}`);
            document.getElementById("transporterBatchId").value = '';
            document.getElementById("ddlTargetVendorSelection").value = '';
        } catch (err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            btn.disabled = false;
        }
    }

    async function executeMarkAsDeliveredTx() {
        if (!contract) return alert("MetaMask interface disconnected.");
        const id = document.getElementById("transporterBatchId").value;
        if (!id) return alert("Please clarify target batch index parameters.");

        const btn = document.getElementById("btnTransitArrived");
        try {
            btn.disabled = true;
            const tx = await contract.markAsDelivered(id);
            await tx.wait();
            alert(`Success: Batch #${id} marked as Delivered. Awaiting Vendor confirmation.`);
            document.getElementById("transporterBatchId").value = '';
        } catch (err) {
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            btn.disabled = false;
        }
    }

    document.getElementById("btnTransitStart").addEventListener('click', executeStartTransitTx);
    document.getElementById("btnTransitArrived").addEventListener('click', executeMarkAsDeliveredTx);
}