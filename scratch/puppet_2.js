const puppeteer = require('puppeteer');
const fs = require('fs');
const cheerio = require('cheerio')
const _ = require('lodash');
const shouldScrapeCoupons = true;
const baseUrl = 'https://www.goodrx.com';
const zipcode = '98030'
const goodrxDrugIdRetrievalUrl = "https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=10mg-10mg&quantity=30"

const drugFromDB =
  {
    "POTENTIS_GSN": "020241",
    "GCN": "02318",
    "GSN": "20241",
    "GCN2": "2318",
    "DrugName": "ACARBOSE 100 MG TABLET",
    "DrugBrandGenericFlag": "1",
    "DrugNDC": "64380076006",
    "NDC": "64380076006",
    "goodrx_name": "Acarbose",
    "goodrx_form": "tablet",
    "goodrx_dosage": "100mg",
    "goodrx_qty": "90",
    "potentis_form": "TABLET",
    "potentis_dosage": "100 MG",
    "potentis_qty": 90,
    "api_name": "acarbose",
    "api_form": "tablet",
    "api_dosage": "100mg",
    "api_qty": "90",
    "unavailable": null,
    "_px2": null,
    "_ga": null,
    "fastly_unique_id": null
  }


process.setMaxListeners(25);

const drugs = [
  // 'http://ies.angelatoddphotography.com/test.php',
  // 'http://ies.angelatoddphotography.com/test.php',
  // 'http://ies.angelatoddphotography.com/test.php',
  // 'http://ies.angelatoddphotography.com/test.php',
  // 'http://ies.angelatoddphotography.com/test.php',
  // 'http://ies.angelatoddphotography.com/test.php',
  // 'http://ies.angelatoddphotography.com/test.php',
  // 'http://ies.angelatoddphotography.com/test.php',
  // 'http://ies.angelatoddphotography.com/test.php',
  "https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=10mg-10mg&quantity=30",
  // "https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=10mg-20mg&quantity=90",
  // "https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=5mg-10mg&quantity=30",
  // "https://www.goodrx.com/acarbose/?drug-name=ACARBOSE&form=tablet&dosage=50mg&quantity=180",
  // "https://www.goodrx.com/acarbose/?drug-name=ACARBOSE&form=tablet&dosage=25mg&quantity=90",
  // "https://www.goodrx.com/acebutolol/?drug-name=ACEBUTOLOL&form=capsule&dosage=200mg&quantity=30",
  // "https://www.goodrx.com/acetaminophen-codeine/?drug-name=ACETAMINOPHEN+CODEINE&form=tablet&dosage=300mg-30mg&quantity=10",
  // "https://www.goodrx.com/acetaminophen-codeine/?drug-name=ACETAMINOPHEN+CODEINE&form=tablet&dosage=300mg-30mg&quantity=16",
  // "https://www.goodrx.com/acetaminophen-codeine/?drug-name=ACETAMINOPHEN+CODEINE&form=tablet&dosage=300mg-60mg&quantity=90",
  // "https://www.goodrx.com/acarbose/?drug-name=ACARBOSE&form=tablet&dosage=25mg&quantity=90",
];

function get_drug_url(drug) {
  const without_slashes = drug.goodrx_name.replace(/ \/ |\//g, '#');
  const lower_case_with_hyphens = without_slashes.toLowerCase().replace(/\s+|#/g, '-');
  const upper_case_with_plus = without_slashes.toUpperCase().replace(/\s+|#/g, '+');
  const hyphenated_dosage = drug.goodrx_dosage.replace('/', '-');

  return `https://www.goodrx.com/${lower_case_with_hyphens}/?` +
    `drug-name=${upper_case_with_plus}&` +
    `form=${drug.goodrx_form}&` +
    `dosage=${hyphenated_dosage}&` +
    `quantity=${drug.goodrx_qty}`;
}

(async () => {
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
  page.setDefaultTimeout('20000');

  try {
    // use this for testing
    const pageContent = fs.readFileSync('page.html', 'utf8')
    await page.setContent(pageContent)

    // use this to load a real page
    // let uri = get_drug_url(drugFromDB);
    // await page.goto(uri);

    // Check if we're being blocked and thow an exception
    const body = await page.evaluate(() => document.querySelector('body').textContent);
    const blockedText = 'Access to this page has been denied because we believe you are using automation tools to browse the website'
    if (body.includes(blockedText)) {
      console.log(`Blocked: ${uri}`)
      console.log(`Blocked: ${blockedText}`)
      await browser.close();
      return
    }


    await page.waitFor('#uat-drug-title');
    const pageHtml = await page.evaluate(() => document.querySelector('html').outerHTML);


    // fs.writeFile("page.html", pageHtml, function(err) {
    //   if(err) {
    //     return console.log(err);
    //   }
    //
    //   browser.close()
    //   dd("The file was saved!");
    // });


    // Parse the page
    //////////////////////////////////////////////////////////////////////

    const domParser = cheerio.load(pageHtml);
    const bodyHtml = domParser('body').html();
    const bodyParser = cheerio.load(bodyHtml);

    const scripts = bodyParser('script')
      .map(function (index, element) {
        return bodyParser(element).html();
      })
      .get()
      .filter((html) => html.includes('window.__state__'));


    const script = _.head(scripts);

    const window = {};

    eval(script);

    const goodrxDrugId = window
      .__state__
      .reduxAsyncConnect
      .catchAllPageData
      .currentChoice
      .id;


    `https://www.goodrx.com/api/v4/drugs/33671/prices?location=47.383225,-122.212973&location_type=LAT_LNG&quantity=30`;
    const coordinates_by_zipcode = {
      '98030': {latitude: '47.383225,', longitude: '-122.212973'},
      '23320': {latitude: '36.7434', longitude: '-76.22574',},
    };

    const coordinates = coordinates_by_zipcode['98030']

    const priceRetrievalUrl = `https://www.goodrx.com/api/v4/drugs/${goodrxDrugId}/prices`
      + `?location=${coordinates.latitude},${coordinates.longitude}`
      + `&location_type=LAT_LNG`
      + `&quantity=30`;

    try {
      await page.goto(priceRetrievalUrl);
    } catch (e) {
      await page.screenshot({path: 'to_long.png'});
      console.log('API Page ', e)
      browser.close()
      process.exit()
    }


    const data = await page.evaluate(() => {
      return JSON.parse(document.querySelector("body").innerText);
    });

    const pharmacyRows = data.results;
    const results = []
    for (let i = 0; i < pharmacyRows.length; i++) {
      results.push(await scrapeCoupon(pharmacyRows[i]))
    }

    dd(results)


    // console.log(page)
    process.exit()

    //////////////////////////////////////////////////////////////////////


  }
  catch (e) {
    await page.screenshot({path: 'to_long.png'});
    console.log('ERROR! first page ', e);
    await browser.close();
    // process.exit()
  }


  function dd(arg) {
    console.log(arg)
    process.exit()
  }

  async function scrapeCoupon(row) {
    const pharmacyName = row.pharmacy.name;
    const priceData = _.minBy(row.prices, 'price');
    const price = priceData.price;
    const record = {pharmacyName, price};

    const formattedPharmacyName = pharmacyName
      .toLowerCase()
      .replace('-', '')
      .trim();

    let shouldSkipPharmacy = true;

    _.each([
      'cvs',
      'walgreens',
      'walmart',
      'wal-mart',
      'wal mart',
      'kroger',
      'rite aid',
      'rite-aid',
      'riteaid',
      'safeway',
      'safe way',
      'safe-way',
    ], (targetedPharmacyName) => {
      if (formattedPharmacyName.includes(targetedPharmacyName)) {
        shouldSkipPharmacy = false;
        return false;
      }
    });

    if (shouldSkipPharmacy) {
      console.log(`Skip this pharmacy ${formattedPharmacyName}`)
    }

    // wait a little bit, new arcetecture won't need this
    // await wait(throttleDelay);

    if ((priceData.type === 'COUPON') && shouldScrapeCoupons) {
      let couponUrl = `${baseUrl}${priceData.url}`

      try {
        await page.goto(couponUrl);

        await page.waitFor('.prescription-info');
        const couponHtml = await page.evaluate(() => document.querySelector('html').outerHTML);
        const couponParser = cheerio.load(couponHtml);
        const dataParts = couponParser('dd');
        record.member_id = dataParts.eq(0).text().trim();
        record.goodrx_group = dataParts.eq(1).text().trim();
        record.BIN = dataParts.eq(2).text().trim();
        record.PCN = dataParts.eq(3).text().trim();

      } catch (e) {
        record.BIN = null;
        record.PCN = null;
        record.member_id = null;
        record.goodrx_group = null;
        await page.screenshot({path: 'to_long.png'});
        console.log('ERROR! Coupon Page ', e);
        await browser.close();
      }
    } else {
      record.BIN = null;
      record.PCN = null;
      record.member_id = null;
      record.goodrx_group = null;
    }

    const date = new Date();
    const timeStamp = `${date.getFullYear()}-` +
      `${date.getMonth() + 1}-` +
      `${date.getDate()}` +
      ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return {
      website: 'GoodRX',
      goodrx_name: drugFromDB.goodrx_name,
      goodrx_form: drugFromDB.goodrx_form,
      goodrx_dosage: drugFromDB.goodrx_dosage,
      goodrx_qty: drugFromDB.goodrx_qty,
      DrugName: drugFromDB.DrugName,
      GCN2: drugFromDB.GCN2,
      GCN: drugFromDB.GCN,
      potentis_qty: drugFromDB.potentis_qty,
      potentis_form: drugFromDB.potentis_form,
      potentis_dosage: drugFromDB.potentis_dosage,
      POTENTIS_GSN: drugFromDB.POTENTIS_GSN,
      GSN: drugFromDB.GSN,
      DrugNDC: drugFromDB.DrugNDC,
      NDC: drugFromDB.NDC,
      DrugBrandGenericFlag: drugFromDB.DrugBrandGenericFlag,
      pharmacy: record.pharmacyName,
      price: parseFloat(record.price, 10),
      url: goodrxDrugIdRetrievalUrl,
      goodrx_gb: record.manufacturer == 'brand' ? 'B' : 'G',
      created_at: timeStamp,
      member_id: record.member_id,
      goodrx_group: record.goodrx_group,
      BIN: record.BIN,
      PCN: record.PCN,
      zipcode: zipcode
    }
  }

})();