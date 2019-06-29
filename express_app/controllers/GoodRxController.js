const ScrapeGoodRxDrugID = require('../GoodRx/ScrapeDrugID')
const ScrapeGoodRxApi = require('../GoodRx/ScrapeApi')
const ScrapeCoupon = require('../GoodRx/ScrapeCoupon')

module.exports = {
  /**
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async scrapeDrugId(req, res) {
    res.setHeader('Content-Type', 'application/json');
    try {
      const response = await ScrapeGoodRxDrugID(req.body)

      if (!response.error) {
        res.send(JSON.stringify(response))
      } else {
        res.send({error: JSON.stringify(response.error)})
      }
    } catch (error) {
      res.status(500)
      res.send(error)
    }
  },

  /**
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async scrapeApi(req, res) {
    const {
      drugId,
      zipcode,
    } = req.body

    const drugFromDb = {
        goodrx_name: req.body.goodrx_name,
        goodrx_form: req.body.goodrx_form,
        goodrx_dosage: req.body.goodrx_dosage,
        goodrx_qty: req.body.goodrx_qty,
        DrugName: req.body.DrugName,
        GCN2: req.body.GCN2,
        GCN: req.body.GCN,
        potentis_qty: req.body.potentis_qty,
        potentis_form: req.body.potentis_form,
        potentis_dosage: req.body.potentis_dosage,
        POTENTIS_GSN: req.body.POTENTIS_GSN,
        GSN: req.body.GSN,
        DrugNDC: req.body.DrugNDC,
        NDC: req.body.NDC,
        DrugBrandGenericFlag: req.body.DrugBrandGenericFlag,
        goodrx_id: req.body.goodrx_id
    }

    try {
      const response = await ScrapeGoodRxApi(zipcode, drugFromDb)
      res.send(response)

    } catch (e) {
      res.send(e)
    }
  },

  /**
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async scrapeCouponPage(req, res) {

    try {
      const response = await ScrapeCoupon(req.body.couponUrl)
      res.send(response)
    } catch (e) {
      res.send(e)
    }
  }
}
