// Template: screenshot a PM5 app running against its Mock transport, for a
// www-ergarcade tool card thumbnail. Adapt the selectors/wait condition to
// the target app's own DOM -- this exact version matches virtual-monitor's
// fixed-slot screen (#transport, #mock-speed, #connect, #slot-time).
//
// Usage (from a scratch dir with `playwright` installed via
// `npm install --no-save playwright` + `npx playwright install chromium`):
//   node screenshot-mock.mjs <url> <output.png>
import { chromium } from 'playwright';

const url = process.argv[2];
const outPath = process.argv[3];

const browser = await chromium.launch();
const context = await browser.newContext({
    viewport: { width: 800, height: 450 },
    colorScheme: 'dark',
});
const page = await context.newPage();

const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto(url, { waitUntil: 'load' });

// Don't rely on Mock being the pre-selected default -- navigator.bluetooth/
// navigator.hid often exist in headless Chromium, so a real transport can
// win the "first supported" default instead.
await page.selectOption('#transport', 'mock');
await page.selectOption('#mock-speed', '16');
await page.click('#connect');

// Let the replay run a few simulated minutes in, so the screenshot shows
// real, populated numbers instead of the 0:00 startup state. Adjust the
// selector/text check to whatever this app's DOM actually exposes.
await page.waitForFunction(
    () => document.querySelector('#slot-time')?.textContent?.startsWith('00:04'),
    { timeout: 30000 },
);
await page.waitForTimeout(500);

await page.screenshot({ path: outPath });

console.log('console/page errors:', JSON.stringify(errors));
await browser.close();
