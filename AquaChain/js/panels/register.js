function renderRegisterView() {
    const container = document.getElementById("panel-register");
    container.innerHTML = `
        <div class="flex items-center gap-3 mb-1">
            <div class="p-2 bg-blue-100 rounded-xl text-blue-600"><i data-lucide="user-check" class="w-5 h-5"></i></div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-900">Node Enrollment</h2>
        </div>
        <p class="text-sm text-slate-500 mb-6">
            Register your wallet address as a participant in the AquaChain ecosystem. 
            This must be done before any supply chain transactions can be executed.
        </p>

        <div id="registrationStateBox" class="space-y-5">
            <form id="frmOnboardingEnrollment" class="space-y-5">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Business / Farm Entity Name</label>
                    <input type="text" id="regName" class="form-input-field" placeholder="e.g. Dela Cruz Aquaculture Farm" required>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Ecosystem Role Assignment</label>
                    <select id="regRole" class="form-input-field font-semibold text-slate-700 bg-white">
                        <option value="1">Crayfish Farmer</option>
                        <option value="2">Distributor</option>
                        <option value="4">Vendor / Restaurant</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Physical Location / Address</label>
                    <input type="text" id="regLocation" class="form-input-field" placeholder="e.g. Bulacan, Philippines" required>
                </div>
                <button type="submit" id="btnSubmitOnboarding" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-md flex items-center justify-center cursor-pointer">
                    Sign Registry Parameters to Ledger
                </button>
            </form>
        </div>
    `;

    // Intercept submit routine
    document.getElementById("frmOnboardingEnrollment").addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contract) return alert("Please establish a secure wallet connection first.");
        
        const name = document.getElementById("regName").value;
        const role = parseInt(document.getElementById("regRole").value, 10);
        const location = document.getElementById("regLocation").value;
        const btn = document.getElementById("btnSubmitOnboarding");

        try {
            constructAwaitBlockConfirmationButtonLoader(btn, "");
            const tx = await contract.registerParticipant(name, role, location);
            await tx.wait();
            alert("Success: Identity committed to blockchain registration index!");
            window.location.reload();
        } catch(err) {
            alert("Transaction failed: " + (err.reason || err.message));
            constructAwaitBlockConfirmationButtonLoader(btn, "Sign Registry Parameters to Ledger");
        }
    });
}

function evaluateParticipantProfileUIContext() {
    const box = document.getElementById("registrationStateBox");
    if (activeUserProfile && activeUserProfile.role > 0) {
        box.innerHTML = `
            <div class="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 flex items-start gap-4">
                <i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-600 shrink-0 mt-0.5"></i>
                <div>
                    <h3 class="font-bold text-emerald-900">Wallet Authorized & Synced</h3>
                    <p class="text-sm text-emerald-700 mt-1">This node is already registered. Profile details below:</p>
                    <div class="mt-3 space-y-1 text-xs text-emerald-800 font-mono bg-emerald-100/50 rounded-xl p-3">
                        <p><strong>Entity Name:</strong> ${activeUserProfile.name}</p>
                        <p><strong>Location:</strong> ${activeUserProfile.location}</p>
                        <p><strong>Assigned Role:</strong> ${ROLE_MAP[activeUserProfile.role]}</p>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
}