const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:3000/portofolio', { waitUntil: 'networkidle0' });
  console.log('Page loaded');
  
  // click 2024 filter
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.trim() === '2024');
    if (btn) btn.click();
  });
  
  console.log('Clicked 2024');
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
