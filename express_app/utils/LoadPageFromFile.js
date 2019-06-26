const fs = require('fs')

module.exports = async (page, file) => {
  const pageContent = fs.readFileSync(file, 'utf8')
  await page.setContent(pageContent)
}