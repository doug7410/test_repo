const writeHtmlToFile = require('../utils/WriteHtmlToFile')

module.exports = {
  checkIfPageIsBlocked: async (page) => {
    const body = await page.evaluate(() => document.querySelector('body').textContent);
    const blockedText = [
      'Access to this page has been denied because we believe you are using automation tools to browse the website',
      'Thanks for visiting! GoodRx is not available outside of the United States'
    ]

    if (body.includes(blockedText[0])) {
      // await writeHtmlToFile(page, __dirname+'/storage/blocked_for_automation.html')
      console.log(`Blocked: ${blockedText[0]}`)
      return `Blocked: ${blockedText[0]}`
    }

    if (body.includes(blockedText[1])) {
      // await writeHtmlToFile(page, __dirname+'/storage/blocked_for_out_of_us.html')
      console.log(`Blocked: ${blockedText[0]}`)
      return `Blocked: ${blockedText[1]}`
    }


    return false
  },

  getDrugUrl(drug) {
    const without_slashes = drug.goodrx_name.replace(/ \/ |\//g, '#');
    const lower_case_with_hyphens = without_slashes.toLowerCase().replace(/\s+|#/g, '-');
    const upper_case_with_plus = without_slashes.toUpperCase().replace(/\s+|#/g, '+');
    const hyphenated_dosage = drug.goodrx_dosage.replace('/', '-');

    return `https://www.goodrx.com/${lower_case_with_hyphens}/?` +
      `drug-name=${upper_case_with_plus}&` +
      `form=${drug.goodrx_form}&` +
      `dosage=${hyphenated_dosage}&` +
      `quantity=${drug.goodrx_qty}`;
  },

}