const fs = require('fs');
const cheerio = require('cheerio')
const _ = require('lodash');
const {checkIfPageIsBlocked, getDrugUrl, writeHtmlToFile} = require('./utils')
const PuppeteerService = require('../http/PuppeteerService')
process.setMaxListeners(25);

const scrapeDrugId = async (drugFromDB) => {
  const puppeteer = await PuppeteerService.init()
  const browser = puppeteer.browser
  const page = puppeteer.page

  try {
    // use this for testing
    // const pageContent = fs.readFileSync(__dirname + '/to_long.html', 'utf8')
    // await page.setContent(pageContent)

    // use this to load a real page
    let uri = getDrugUrl(drugFromDB);
    await page.goto(uri);

    // Check if we're being blocked and thow an exception
    const pageIsBlocked = await checkIfPageIsBlocked(page, browser)

    if (pageIsBlocked) {
      await browser.close()

      return {
        type: 'error',
        message: pageIsBlocked
      }
    }

    await page.waitFor('#uat-drug-title');

    const pageHtml = await page.evaluate(() => document.querySelector('html').outerHTML);

    await writeHtmlToFile(page, __dirname+'/good_page.html')
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

    const script = _.head(scripts);
    const window = {};
    eval(script);
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
    await page.screenshot({path: __dirname + '/to_long.png'});
    const pageHtml = await page.evaluate(() => document.querySelector('html').outerHTML);
    fs.writeFile(__dirname + "/to_long.html", pageHtml, function (err) {
      if (err) {
        return console.log(err);
      }

      console.log(__dirname + "/to_long.html was saved")
    });

    await browser.close();
    return {
      type: 'error',
      message: e
    }
  }
};

module.exports = {
  scrapeDrugId
}

