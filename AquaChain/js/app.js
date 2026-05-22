// Global Application Runtime Memory State Context Variables
let provider = null;
let signer = null;
let contract = null;
let activeUserAccount = "";
let activeUserProfile = null;
let activeCurrentTabId = "home";

// Central Bootloader Runtime Sequence Initialization Hook
window.addEventListener('DOMContentLoaded', async () => {
    // Inject and instantiate view panels templates to the main runtime containers
    renderHomeView();
    renderRegisterView();
    renderFarmerView();
    renderDistributorView();
    renderVendorView();
    renderTraceView();
    
    setupNavigationInterceptors();
    lucide.createIcons();

    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Setup direct hardware event listeners
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
        
        // Auto-detect and sync on load if connection already persists
        const accessibleAccounts = await provider.listAccounts();
        if (accessibleAccounts.length > 0) {
            connectMetaMaskNode();
        }
    } else {
        configureNetworkStatusBar(false, "Provider Missing");
    }
});

// Wire sidebar tab interactive selection event routines
function setupNavigationInterceptors() {
    const triggerButtons = document.querySelectorAll('.sidebar-btn');
    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chosenTab = e.currentTarget.getAttribute('data-target-tab');
            switchActiveDisplayPanelTab(chosenTab);
        });
    });
}

// Master UI view display switcher controller module
function switchActiveDisplayPanelTab(tabId) {
    activeCurrentTabId = tabId;
    
    // Clear styles on all selection layout tabs
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.className = "sidebar-btn w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all mb-0.5 text-slate-600 hover:bg-slate-200/60";
        btn.querySelector('.arrow-indicator').classList.add('hidden');
    });

    // Reapply targeted context active classes matching colors schema
    const targetBtn = document.querySelector(`[data-target-tab="${tabId}"]`);
    if (targetBtn) {
        if (tabId === 'trace') {
            targetBtn.className = "sidebar-btn w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all mb-0.5 bg-slate-900 text-white shadow-md active-tab";
        } else {
            targetBtn.className = "sidebar-btn w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all mb-0.5 bg-blue-600 text-white shadow-md shadow-blue-600/20 active-tab";
        }
        targetBtn.querySelector('.arrow-indicator').classList.remove('hidden');
    }

    // Toggle corresponding main screen content area window frames
    document.querySelectorAll('.tab-view').forEach(panel => panel.classList.add('hidden'));
    const targetedPanel = document.getElementById(`panel-${tabId}`);
    if (targetedPanel) {
        targetedPanel.classList.remove('hidden');
    }
}

// Network and connection logic wrapper
async function connectMetaMaskNode() {
    if (!provider) return alert("MetaMask extension layer interface missing.");
    const btnText = document.getElementById("btnConnectText");
    
    try {
        btnText.textContent = "Connecting...";
        const requestedWallets = await provider.send("eth_requestAccounts", []);
        activeUserAccount = requestedWallets[0];

        const networkMetadata = await provider.getNetwork();
        if (networkMetadata.chainId !== SEPOLIA_CHAIN_ID) {
            document.getElementById("wrongNetworkBanner").classList.remove('hidden');
            configureNetworkStatusBar(false, networkMetadata.name);
            btnText.textContent = "Connect Wallet";
            return;
        }

        // Successfully matched criteria setup signers
        document.getElementById("wrongNetworkBanner").classList.add('hidden');
        configureNetworkStatusBar(true, "Sepolia Testnet");
        
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Fetch onchain mapping allocations
        activeUserProfile = await contract.participants(activeUserAccount);
        synchronizeGlobalProfileHeaders();

        // Remount active user components panels UI records logic data mapping checks
        evaluateParticipantProfileUIContext();

        // DYNAMIC ROLE BADGE CREATION LOGIC
        let roleBadgeHTML = "";
        if (activeUserProfile && activeUserProfile.role > 0) {
            const roleName = ROLE_MAP[activeUserProfile.role];
            // Render an emerald layout status chip badge if identity exists
            roleBadgeHTML = `<span class="ml-2 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold font-sans tracking-wide uppercase">${roleName}</span>`;
        } else {
            // Render a low-contrast indicator tag context if user is a standard guest
            roleBadgeHTML = `<span class="ml-2 px-1.5 py-0.5 bg-slate-700/50 border border-slate-600 text-slate-400 rounded text-[10px] font-bold font-sans tracking-wide uppercase">Unregistered</span>`;
        }

        const btnContainer = document.getElementById("btnConnect");
        btnContainer.className = "bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center text-white text-xs font-mono cursor-default shadow-xs";
        
        // Output clean aligned layout components using embedded layout structures
        btnText.innerHTML = `
            <div class="flex items-center">
                <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2 shrink-0"></div>
                <span>${activeUserAccount.substring(0,6)}...${activeUserAccount.substring(38)}</span>
                ${roleBadgeHTML}
            </div>
        `;

    } catch (err) {
        console.error(err);
        btnText.textContent = "Connect Wallet";
    }
}

// UI profile update mapping synchronization dispatcher
function synchronizeGlobalProfileHeaders() {
    const profileHeaderBlock = document.getElementById("headerProfileBlock");
    if (activeUserProfile && activeUserProfile.role > 0) {
        document.getElementById("lblHeaderProfileName").textContent = activeUserProfile.name;
        document.getElementById("lblHeaderProfileRole").textContent = ROLE_MAP[activeUserProfile.role];
        profileHeaderBlock.classList.remove('hidden');
    } else {
        profileHeaderBlock.classList.add('hidden');
    }
}

// Modify top system layout connectivity tags metrics indicator status context
function configureNetworkStatusBar(isSepolia, labelText) {
    const badge = document.getElementById("networkBadge");
    const dot = document.getElementById("networkDot");
    const lbl = document.getElementById("lblNetworkName");

    badge.classList.remove('hidden');
    lbl.textContent = labelText;
    
    if (isSepolia) {
        badge.className = "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
        dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-400";
    } else {
        badge.className = "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border bg-amber-400/10 border-amber-400/30 text-amber-400";
        dot.className = "w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse";
    }
}

// Add event handlers for global control buttons
document.getElementById("btnConnect").addEventListener('click', (e) => {
    if(e.currentTarget.classList.contains('cursor-default')) return;
    connectMetaMaskNode();
});

document.getElementById("btnSwitchNetwork").addEventListener('click', async () => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
        });
    } catch(e) { console.error("Manual transmission adjustment failed.", e); }
});

// Await Block Confirmation Loader Transition Controller Helper Routine
function constructAwaitBlockConfirmationButtonLoader(buttonElement, activeStateText) {
    if (buttonElement.disabled) {
        buttonElement.disabled = false;
        buttonElement.innerHTML = activeStateText;
    } else {
        buttonElement.disabled = true;
        buttonElement.innerHTML = `<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full loading-spinner mr-2"></div> Awaiting Block Confirmation…`;
    }
}