const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/portofolio', { waitUntil: 'networkidle0' });
  
  // click 2024 filter
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.trim() === '2024');
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.content();
  fs.writeFileSync('dom-after-click.html', html);
  
  // Get track position and cards
  const info = await page.evaluate(() => {
    const track = document.querySelector('.flex.items-end.gap-0.w-max');
    const cards = document.querySelectorAll('.archive-card');
    return {
      trackRect: track ? track.getBoundingClientRect() : null,
      trackStyles: track ? track.style.cssText : null,
      cardsCount: cards.length,
      cardsInfo: Array.from(cards).slice(0, 5).map(c => ({
        rect: c.getBoundingClientRect(),
        style: c.style.cssText
      }))
    };
  });
  
  fs.writeFileSync('dom-info.json', JSON.stringify(info, null, 2));
  
  await browser.close();
})();
