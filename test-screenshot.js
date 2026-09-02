const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/portofolio', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'before_click.png' });
  
  // click 2024 filter
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.trim() === '2024');
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'after_click.png' });
  
  await browser.close();
})();
