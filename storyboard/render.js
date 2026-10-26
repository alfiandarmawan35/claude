// storyboard.html -> out/Storyboard_Konsep_Kapal.pdf + out/storyboard_<n>.png (satu per konsep)
const {chromium} = require('playwright');
const fs = require('fs');
(async () => {
  fs.mkdirSync(__dirname + '/out', {recursive: true});
  const b = await chromium.launch();
  const p = await b.newPage({viewport: {width: 1600, height: 1320}, deviceScaleFactor: 1.5});
  await p.goto('file://' + __dirname + '/storyboard.html');
  await p.evaluate(() => document.fonts.ready);
  const hal = await p.$$('.hal');
  for (let i = 0; i < hal.length; i++) await hal[i].screenshot({path: `${__dirname}/out/storyboard_${i + 1}.png`});
  await p.pdf({path: __dirname + '/out/Storyboard_Konsep_Kapal.pdf', width: '1600px', height: '1320px', printBackground: true});
  await b.close();
  console.log(hal.length, 'halaman');
})();
