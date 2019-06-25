const controllers =  require('./controllers')
console.log('from routes.js', controllers)

const registerRoutes = (app) => {
  app.get('/goodRx/drugId', (req, res) => controllers.GoodRx.id(req, res))

  app.get('/coupon', (req, res) => controllers.GoodRx.couponPage(req, res))
}

module.exports = registerRoutes


