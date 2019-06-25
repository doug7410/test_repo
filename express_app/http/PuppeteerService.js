const puppeteer = require('puppeteer');

module.exports = {
  browser: null,
  page: null,

  async init(){
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--proxy-server=zproxy.lum-superproxy.io:22225',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // This will write shared memory files into /tmp instead of /dev/shm,
        // because Docker’s default for /dev/shm is 64MB
        '--disable-dev-shm-usage'
      ]
    })

    const page = await this.browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36');
    page.setDefaultTimeout('30000');

    await page.authenticate({
      username: 'lum-customer-hl_e5786cfe-zone-static-country-us',
      password: 'nzdtvdpzaefg'
    })

    this.page = page

    return this
  }
}