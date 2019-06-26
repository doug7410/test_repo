const controllers =  require('./controllers')

const registerRoutes = (app) => {
  app.post('/goodRx/scrapeDrugId', (req, res) => controllers.GoodRx.scrapeDrugId(req, res))
  app.post('/goodRx/scrapeApi', (req, res) => controllers.GoodRx.scrapeApi(req, res))
  app.post('/goodRx/scrapeCoupon', (req, res) => controllers.GoodRx.scrapeCouponPage(req, res))
}

module.exports = registerRoutes


