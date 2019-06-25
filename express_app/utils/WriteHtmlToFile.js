const fs = require('fs');

module.exports = async (page, file) => {
  const pageHtml = await page.evaluate(() => document.querySelector('html').outerHTML);

  fs.writeFile(file, pageHtml, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log(`${file} was saved`)
  });
}