const { chromium } = require('playwright');
const fs = require('fs');

async function runAutomation() {
    console.log("📡 [AETHERION] Initializing CSRF-Injected Bounty Submission...");
    const csrfToken = process.env.HACKEN_CSRF;
    const sessionToken = process.env.BOUNTY_SESSION;

    if (!csrfToken || !sessionToken) {
        console.error("❌ Error: HACKEN_CSRF or BOUNTY_SESSION not set.");
        return;
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    
    await context.addCookies([{
        name: 'session',
        value: sessionToken,
        domain: 'hackenproof.com',
        path: '/'
    }]);

    const page = await context.newPage();
    await page.setExtraHTTPHeaders({
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
    });

    try {
        console.log("💱 Anchoring to HackenProof via Vite-Tunnel...");
        await page.goto('https://hackenproof.com/submit', { waitUntil: 'domcontentloaded' });
        
        const pov = fs.readFileSync('WORMHOLE_POV_ENHANCED.md', 'utf8');
        await page.locator('textarea, [contenteditable="true"]').first().fill(pov);
        
        console.log("✅ PoV Injected via CSRF Handshake.");

    } catch (err) {
        console.error(`❌ Strike Error: ${err.message}`);
    } finally {
        await browser.close();
        console.log("🏁 Aetherion Strike Cycle Complete.");
    }
}

runAutomation();