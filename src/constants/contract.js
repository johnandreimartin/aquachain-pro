// ─── AquaChain Contract Configuration ───────────────────────────────────────
// Replace CONTRACT_ADDRESS with your compiled address from Remix IDE

export const CONTRACT_ADDRESS = "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d";

export const CONTRACT_ABI = [
  "function registerParticipant(string name, string location, uint8 role) external",
  "function participants(address) external view returns (string name, string businessLocation, uint8 role, bool isRegistered)",
  "function registerBatch(string _type, string _harvestDate, string _pondOrigin, uint256 _quantity) external",
  "function transferOwnership(uint256 _batchId, address _newOwner) external",
  "function startTransit(uint256 _batchId) external",
  "function confirmDelivery(uint256 _batchId, bool _accept) external",
  "function batches(uint256) external view returns (uint256 id, string crayfishType, string harvestDate, string pondOrigin, uint256 quantity, address currentOwner, address currentTransporter, uint8 status, uint256 timestamp)",
  "function getBatchHistory(uint256 _batchId) external view returns (tuple(address actor, uint8 status, uint256 timestamp, string notes)[])",
  "function batchCounter() external view returns (uint256)"
];

// ─── Aligned with Section VI & IX: Roles and Status ─────────────────────────
// Index 0 = None/Guest, indices 1-4 match the Solidity enum Role { None, Farmer, Distributor, Transporter, Vendor }
export const ROLE_MAP = [
  "Guest / Visitor",
  "Crayfish Farmer",
  "Distributor",
  "Transporter",
  "Vendor / Restaurant",
];

// Aligned with Solidity enum Status { Created, InTransit, Delivered, Rejected }
export const STATUS_MAP = ["Created", "In Transit", "Delivered", "Rejected"];

export const SEPOLIA_CHAIN_ID = 11155111;
