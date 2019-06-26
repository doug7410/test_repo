const {minBy} = require('lodash')
const baseUrl = 'https://www.goodrx.com';
const PuppeteerService = require('../http/PuppeteerService')
const {getDrugUrl} = require('./utils')
const cheerio = require('cheerio')
const {checkIfPageIsBlocked} = require('./utils')

module.exports = async (couponUrl) => {
    const puppeteer = await PuppeteerService.init()
    const browser = puppeteer.browser
    const page = puppeteer.page

    try {
      await page.goto(couponUrl);
      const pageIsBlocked = await checkIfPageIsBlocked(page, browser)
      if (pageIsBlocked) {
        await browser.close()

        return {
          type: 'error',
          message: pageIsBlocked
        }
      }

      await page.waitFor('.prescription-info');
      const couponHtml = await page.evaluate(() => document.querySelector('html').outerHTML);
      const couponParser = cheerio.load(couponHtml);
      const dataParts = couponParser('dd');
      const result = {
        member_id: dataParts.eq(0).text().trim(),
        goodrx_group: dataParts.eq(1).text().trim(),
        BIN: dataParts.eq(2).text().trim(),
        PCN: dataParts.eq(3).text().trim()
      }
      browser.close()

      return {
        type: 'success',
        data: result
      }
    } catch (e) {
      await page.screenshot({path: __dirname + '/storage/coupon_page_error.png'});
      await browser.close();
      return {
        status: 'error',
        message: e
      }
    }
}