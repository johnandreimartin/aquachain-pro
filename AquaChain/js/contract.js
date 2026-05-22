// ─── AquaChain Contract Specifications Matrix Configuration ───────────────────
const CONTRACT_ADDRESS = "0xd279721de7FAcca8349b2130Da8f8DF38A992496"; 

const CONTRACT_ABI = [
    {"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint8","name":"_role","type":"uint8"},{"internalType":"string","name":"_location","type":"string"}],"name":"registerParticipant","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"participants","outputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"enum AquaChain.Role","name":"role","type":"uint8"},{"internalType":"string","name":"location","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"_crayfishType","type":"string"},{"internalType":"string","name":"_harvestDate","type":"string"},{"internalType":"string","name":"_pondOrigin","type":"string"},{"internalType":"uint256","name":"_quantity","type":"uint256"}],"name":"registerCrayfishBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_batchId","type":"uint256"},{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_batchId","type":"uint256"},{"internalType":"uint8","name":"_status","type":"uint8"}],"name":"updateShipmentStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"batches","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"crayfishType","type":"string"},{"internalType":"string","name":"harvestDate","type":"string"},{"internalType":"string","name":"pondOrigin","type":"string"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"address","name":"currentOwner","type":"address"},{"internalType":"enum AquaChain.Status","name":"shipmentStatus","type":"uint8"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_batchId","type":"uint256"}],"name":"getBatchHistory","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"}
];

// Structural Enum Array String Identifiers Mappings
const ROLE_MAP = [
    "Guest / Visitor",
    "Crayfish Farmer",
    "Distributor",
    "Transporter",
    "Vendor / Restaurant"
];

const STATUS_MAP = [
    "Created",
    "In Transit",
    "Delivered / Accepted",
    "Rejected / Damaged"
];

const SEPOLIA_CHAIN_ID = 11155111;