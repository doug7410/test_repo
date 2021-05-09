const scrapeCoupon = require('../GoodRx/ScrapeCoupon')
const couponUrl = 'https://www.goodrx.com/coupon?pharmacy_id=3&extras=BfLPNa8Ew%2FUnHbGUsVdcmHQSnWk%3D+Q7%2BYL3siZGlzdGFuY2VfbWkiOiA0LCAibmV0d29yayI6IG51bGwsICJwcmljZSI6IDE2LjY5MTk5OTQzNTQyNDgwNSwgImxvbiI6IC03Ni4yMjU3NCwgImxhdCI6IDM2Ljc0MzQsICJzZWFyY2hfdGltZSI6IDE1NjE1NzEyMjUuMTcxOTY3LCAicGhhcm1fZmlsdGVycyI6IFsiYXBwZW5kX3RvcF9zdGF0ZV9waGFybWFjeSIsICJlc3J4X21haWxfb3JkZXIiXSwgInByaWNlX2ZpbHRlcnMiOiBbImluY2x1ZGVfZXNyeCIsICJpbmNsdWRlX3JlZ2lzdGVyZWRfdXNlcl9wcmljZXMiXSwgInppcF9jb2RlIjogIjIzMzIwIn0%3D&drug_id=7774&quantity=30'

scrapeCoupon(couponUrl).then(res => {
  console.log(res)
  console.log('done')
})