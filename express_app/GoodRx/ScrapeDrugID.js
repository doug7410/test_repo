const cheerio = require('cheerio')
const _ = require('lodash');
const {checkIfPageIsBlocked, getDrugUrl} = require('./utils')
const writeHtmlToFile = require('../utils/WriteHtmlToFile')
const loadPageFromFile = require('../utils/LoadPageFromFile')
const PuppeteerService = require('../http/PuppeteerService')

module.exports = async (drugFromDB) => {
  console.log('start ScrapeDrugID')
  const puppeteer = await PuppeteerService.init()
  const browser = puppeteer.browser
  const page = puppeteer.page

  try {
    // const pageToLoad = 'ScrapeDrugId_success.html'
    // await loadPageFromFile(page, __dirname + `/storage/${pageToLoad}`)
    // console.log(`Scraping saved page - ${pageToLoad}`)

    let uri = getDrugUrl(drugFromDB);
    console.log(`Scraping ${uri}`)
    await page.goto(uri);


    const pageIsBlocked = await checkIfPageIsBlocked(page, browser)

    if (pageIsBlocked) {
      await browser.close()

      return {
        type: 'error',
        message: pageIsBlocked
      }
    }

    const pageHtml = await page.evaluate(() => document.querySelector('html').outerHTML);
    console.log('Successfully requested ' + uri)
    // await writeHtmlToFile(page, __dirname+'/storage/ScrapeDrugId_success.html')
    await browser.close();

    const domParser = cheerio.load(pageHtml);
    const bodyHtml = domParser('body').html();
    const bodyParser = cheerio.load(bodyHtml);

    const scripts = bodyParser('script')
      .map(function (index, element) {
        return bodyParser(element).html();
      })
      .get()
      .filter((html) => html.includes('window.__state__'));

    const window = {};
    eval(scripts[0]);
    const goodrxDrugId = window
      .__state__
      .reduxAsyncConnect
      .catchAllPageData
      .currentChoice
      .id;


    return {
      type: 'success',
      data: {
        goodrxDrugId
      }
    }

  }
  catch (e) {
    // await page.screenshot({path: __dirname + '/storage/to_long.png'});
    // await writeHtmlToFile(page, __dirname+'/storage/to_long.html')
    await browser.close();
    return {
      type: 'error',
      message: e
    }
  }
};
