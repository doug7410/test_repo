const ScrapeDrugID = require('../GoodRx/ScrapeDrugID')

ScrapeDrugID(
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
  }).then(res => console.log(res))