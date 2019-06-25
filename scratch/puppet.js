const puppeteer = require('puppeteer');

const batches = [
  [
    "https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=10mg-10mg&quantity=30",
    // "https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=10mg-20mg&quantity=90",
    // "https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=5mg-10mg&quantity=30",
    "https://www.goodrx.com/acarbose/?drug-name=ACARBOSE&form=tablet&dosage=50mg&quantity=180",
    // "https://www.goodrx.com/acarbose/?drug-name=ACARBOSE&form=tablet&dosage=25mg&quantity=90",
  ],
  [
    "https://www.goodrx.com/acebutolol/?drug-name=ACEBUTOLOL&form=capsule&dosage=200mg&quantity=30",
    "https://www.goodrx.com/acetaminophen-codeine/?drug-name=ACETAMINOPHEN+CODEINE&form=tablet&dosage=300mg-30mg&quantity=10",
    // "https://www.goodrx.com/acetaminophen-codeine/?drug-name=ACETAMINOPHEN+CODEINE&form=tablet&dosage=300mg-30mg&quantity=16",
    // "https://www.goodrx.com/acetaminophen-codeine/?drug-name=ACETAMINOPHEN+CODEINE&form=tablet&dosage=300mg-60mg&quantity=90",
  ]
];

const drugs = [
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
  'http://ies.angelatoddphotography.com/test.php',
];

function makeid(length) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

(async () => {
    for (let drug of drugs) {
      let id = makeid(5)
      console.log(drug, id)

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--proxy-server=zproxy.lum-superproxy.io:22225',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          // This will write shared memory files into /tmp instead of /dev/shm,
          // because Docker’s default for /dev/shm is 64MB
          '--disable-dev-shm-usage'
        ]
      });

      const page = await browser.newPage();

      await page.authenticate({
        username: 'lum-customer-hl_e5786cfe-zone-static-country-us',
        password: 'nzdtvdpzaefg'
      });

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36');
      page.setDefaultTimeout('60000');
      await page.setCacheEnabled(false);

      try {
        let uri = `${drug}?id=${id}`;
        await page.goto(uri);
        await page.waitFor('h1');
        const innerText = await page.evaluate(() => document.querySelector('h1').innerText);
        console.log(uri, id, innerText);
        await browser.close();
      } catch (e) {
        await page.screenshot({path: 'to_long.png'});
        console.log('error', id, e);
        await browser.close();
        // process.exit()
      }
    }
  }
)();


// (async () => {
//
//
//   process.exit()
//   drugs.forEach(async (drug) => {
//     console.log(drug)
//     process.exit()
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         '--proxy-server=zproxy.lum-superproxy.io:22225',
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         // This will write shared memory files into /tmp instead of /dev/shm,
//         // because Docker’s default for /dev/shm is 64MB
//         '--disable-dev-shm-usage'
//       ]
//     });
//
//     const page = await browser.newPage();
//
//     await page.authenticate({
//       username: 'lum-customer-hl_e5786cfe-zone-static-country-us',
//       password: 'nzdtvdpzaefg'
//     });
//
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36');
//     page.setDefaultTimeout('60000');
//
//     try {
//       await page.goto(drug);
//       await page.waitFor('h1');
//       const innerText = await page.evaluate(() => document.querySelector('h1').innerText);
//       console.log(drug, innerText);
//       await browser.close();
//     } catch (e) {
//       await page.screenshot({path: 'to_long.png'});
//       console.log(e);
//       await browser.close();
//       // process.exit()
//     }
//   });
// })();
