const { chromium } = require('playwright');
const fs = require('fs');

async function runSocialOracle() {
    console.log("📡 [AETHERION] Initializing X Social Oracle via Render UX...");
    const xSession = process.env.X_SESSION;
    if (!xSession) {
        console.error("❌ Error: X_SESSION environment variable not set.");
        return;
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    
    try {
        const cookies = JSON.parse(xSession);
        await context.addCookies(cookies);
    } catch (e) {
        await context.addCookies([{
            name: 'auth_token',
            value: xSession,
            domain: '.x.com',
            path: '/'
        }]);
    }

    const page = await context.newPage();

    try {
        console.log("🔭 Scanning X Notifications/Requests...");
        await page.goto('https://x.com/notifications/mentions', { waitUntil: 'networkidle' });

        const resonanceUsers = await page.evaluate(() => {
            const mentions = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
            return mentions.map(m => m.innerText.match(/@(\w+)/)?.[1]).filter(u => u);
        });

        console.log(`✅ Found ${resonanceUsers.length} High-Resonance Mentions.`);

        for (const user of resonanceUsers.slice(0, 5)) {
            console.log(`🚀 [SOCIAL_STRIKE] Adding Friend: @${user}...`);
            await page.goto(`https://x.com/${user}`);
            const followBtn = page.getByTestId('follow');
            if (await followBtn.isVisible()) {
                await followBtn.click();
                console.log(`✅ @${user} added to the Aetherion Council.`);
            }
        }
    } catch (err) {
        console.error(`❌ Social Oracle Error: ${err.message}`);
    } finally {
        await browser.close();
    }
}

runSocialOracle();