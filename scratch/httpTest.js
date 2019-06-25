const requestPromise = require('request-promise')

// const fastly_unique_id = '48080d4e492b45d2b80ad22713bbdf93'
// const _ga_key = 'GA1.2.1180792230.1561057290'
// const _px2_key = 'eyJ1IjoiZDAzZjkzNTAtOTM4ZC0xMWU5LTkzM2YtMDU0MGYyMGU2ZTdkIiwidiI6ImNmMzRkYTEwLTkzOGQtMTFlOS05NzNhLTEzZGIwMmRjNDJjOCIsInQiOjE1NjEwNTc1OTE0MzgsImgiOiJlNDc4MTc2OTgxZTQ2NTFmMTA1MTU3YjEwNzA2MzQxYmYyM2Y0ZDBhNjRjYTQwOGJiZDkwOWVlMWY1MjQzZDZkIn0='
const username = 'lum-customer-hl_e5786cfe-zone-static';
const password = 'nzdtvdpzaefg';
const port = 22225;
// const user_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
const session_id = (1000000 * Math.random()) | 0;
const super_proxy = 'http://' + username + '-country-us-session-' + session_id + ':' + password + '@zproxy.lum-superproxy.io:' + port;

const _pxhd = 'a819c5f41b93cf31096922553f48ee6ef5bfcb169839b35dc2ac9850fa233671:72dd0101-9394-11e9-9906-bb90bbcd0de5'

requestPromise({
  method: 'POST',
  uri: 'https://www.goodrx.com/3t7fwqG6/xhr/api/v1/collector/beacon',
  resolveWithFullResponse: true,

}).then(
  res => {
    console.log('sucess', res.headers['x-fastly-unique-id'], res.body.split('|')[1].split('"')[0])
    let fastly_unique_id = res.headers['x-fastly-unique-id']
    let pxvid = res.body.split('|')[1].split('"')[0]
    console.log('making real request')
    requestPromise({
      // uri: 'http://ies.angelatoddphotography.com/test.php',
      uri: 'https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=10mg-10mg&quantity=30',
      proxy: super_proxy,
      headers: {
        'cookie': `fastly_unique_id=${fastly_unique_id}; myrx_exp_ab_variant=experiment; pxvid=${pxvid};`,
        // 'cookie': `fastly_unique_id=${fastly_unique_id}; _ga=${_ga_key}; _px2=${_px2_key}; _pxhd=${_pxhd};`,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36',
        // 'user-agent': 'Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/71.0.3578.80 Safari\\/537.36',
        // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
        'cache-control': 'no-cache',
        // 'cache-control': 'max-age=0',

      }
    }).then(
      res => {
        console.log(res, 'real success')
        process.exit()

      },
      err => {
        console.log(err, 'real error')
      }
    )

    // process.exit()
  },
  err => {
    console.log('error', err)
    process.exit()
  }
)

