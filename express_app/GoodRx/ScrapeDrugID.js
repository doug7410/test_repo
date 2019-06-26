const cheerio = require('cheerio')
const _ = require('lodash');
const {checkIfPageIsBlocked, getDrugUrl} = require('./utils')
const writeHtmlToFile = require('../utils/WriteHtmlToFile')
const PuppeteerService = require('../http/PuppeteerService')

module.exports = async (drugFromDB) => {
  const puppeteer = await PuppeteerService.init()
  const browser = puppeteer.browser
  const page = puppeteer.page

  try {
    let uri = getDrugUrl(drugFromDB);
    console.log(uri)
    await page.goto(uri);

    //https://www.goodrx.com/acarbose?&dosage=100mg&form=tablet&drug-name=ACARBOSE&quantity=90
    //https://www.goodrx.com/acarbose?dosage=100mg&form=tablet&label_override=Precose&quantity=90

    const pageIsBlocked = await checkIfPageIsBlocked(page, browser)

    if (pageIsBlocked) {
      await browser.close()

      return {
        type: 'error',
        message: pageIsBlocked
      }
    }

    const pageHtml = await page.evaluate(() => document.querySelector('html').outerHTML);

    await writeHtmlToFile(page, __dirname+'/storage/good_page.html')
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
    await page.screenshot({path: __dirname + '/storage/to_long.png'});
    await writeHtmlToFile(page, __dirname+'/storage/to_long.html')
    await browser.close();
    return {
      type: 'error',
      message: e
    }
  }
};
