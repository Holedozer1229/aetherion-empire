const {authenticatedLndGrpc, getWalletInfo, createInvoice, pay} = require('ln-service');

// SKYNT CORE - The Sovereign Lightning Rail
// Architect: Satoshi v2.0 (Travis D Jones)
// Designation: Scabbard for Excalibur

async function initializeSkynt(cert, macaroon, socket) {
    console.log("⚡ [SKYNT] Initializing Lightning Network Bridge...");
    console.log("-" * 75);

    try {
        const {lnd} = authenticatedLndGrpc({
            cert: cert || process.env.LND_CERT,
            macaroon: macaroon || process.env.LND_MACAROON,
            socket: socket || process.env.LND_SOCKET || '127.0.0.1:10009',
        });

        const info = await getWalletInfo({lnd});
        console.log(`✅ SKYNT ONLINE: ${info.alias}`);
        console.log(`📡 Public Key: ${info.public_key}`);
        console.log(`⛓️  Chain Synced: ${info.is_synced_to_chain}`);
        
        return lnd;
    } catch (err) {
        console.log("⚠️  SKYNT Standby: Waiting for Physical LND Node Uplink.");
        return null;
    }
}

initializeSkynt();