const GoodRx = require('../GoodRx/GetId')
module.exports = {
  async id(req, res) {

    const drugFromDB =
      {
        "POTENTIS_GSN": "020241",
        "GCN": "02318",
        "GSN": "20241",
        "GCN2": "2318",
        "DrugName": "ACARBOSE 100 MG TABLET",
        "DrugBrandGenericFlag": "1",
        "DrugNDC": "64380076006",
        "NDC": "64380076006",
        "goodrx_name": "Acarbose",
        "goodrx_form": "tablet",
        "goodrx_dosage": "100mg",
        "goodrx_qty": "90",
        "potentis_form": "TABLET",
        "potentis_dosage": "100 MG",
        "potentis_qty": 90,
        "api_name": "acarbose",
        "api_form": "tablet",
        "api_dosage": "100mg",
        "api_qty": "90",
        "unavailable": null,
        "_px2": null,
        "_ga": null,
        "fastly_unique_id": null
      }


    res.setHeader('Content-Type', 'application/json');
    try {
      console.log('calling scrapeDrug()')
      const response = await GoodRx.scrapeDrugId(drugFromDB)
      if (!response.error) {
        res.send(JSON.stringify(response))
      } else {
        res.send({ error: JSON.stringify(response.error)})
      }
    } catch (error) {
      res.send(JSON.stringify({error}))
    }


  },

  couponPage(req, res) {
    res.send('GoodRX Coupon' + "\r\n")
  }
}