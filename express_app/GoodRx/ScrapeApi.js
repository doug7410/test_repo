const {minBy} = require('lodash')
const baseUrl = 'https://www.goodrx.com';
const { getDrugUrl } = require('./utils')
const PuppeteerService = require('../http/PuppeteerService')
const currentTimeStamp = require('../utils/CurrentTimeStamp')
const { targetedPharmacies, coordinatesByZipcode } = require('./config')

module.exports = async (zipcode, drugFromDB) => {
  console.log('scraping API')

  if(!coordinatesByZipcode[zipcode]) {
    return {
      type: 'error',
      message: 'Zipcode must be 98030 or 23320'
    }
  }

  const puppeteer = await PuppeteerService.init()
  const browser = puppeteer.browser
  const page = puppeteer.page

  const coordinates = coordinatesByZipcode[zipcode]

  const priceRetrievalUrl = `https://www.goodrx.com/api/v4/drugs/${drugFromDB.goodrx_id}/prices`
    + `?location=${coordinates.latitude},${coordinates.longitude}`
    + `&location_type=LAT_LNG`
    + `&quantity=${drugFromDB.goodrx_qty}`;

  try {
    // for testing
    // await loadPageFromFile(page, __dirname + '/storage/scrape_api_good_page.html')

    // for real request
    console.log('requesting ' + priceRetrievalUrl)
    await page.goto(priceRetrievalUrl);
    console.log('successfully got page')

    const data = await page.evaluate(() => {
      return JSON.parse(document.querySelector("body").innerText);
    });

    if(data.error) {
      console.log('error getting page')
      console.log(data.error)
      return {
        type: 'error',
        message: data.error
      }
    }

    await browser.close();
    const results = data.results
      .filter((result) => {
        let formattedPharmacyName = result.pharmacy.name.toLowerCase().replace('-', '').trim()
        return targetedPharmacies.includes(formattedPharmacyName)
      }).map(result => {
        const pharmacyName = result.pharmacy.name;
        const priceData = minBy(result.prices, 'price');
        const couponUrl = (priceData.type === 'COUPON') ? `${baseUrl}${priceData.url}` : null

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
          pharmacy: pharmacyName,
          price: parseFloat(priceData.price, 10),
          url: getDrugUrl(drugFromDB),
          goodrx_gb: 'G',
          created_at: currentTimeStamp(),
          member_id: null, //record.member_id,
          goodrx_group: null, //record.goodrx_group,
          BIN: null, //record.BIN,
          PCN: null, //record.PCN,
          zipcode,
          couponUrl,
        }
      })

    return {
      type: 'success',
      data: results
    }

  } catch (e) {
    await browser.close();
    console.log('error scraping ' + priceRetrievalUrl)
    console.log(e)
    return {
      type: 'error',
      message: e
    }
  }
}