'use strict'
const requestPromise = require('request-promise')
const tough = require('tough-cookie');


/**
 * Make an http request with the Luminati.io proxy service
 * @type {{get(*, *=): *}}
 */
module.exports = {

  get(uri, meta) {

    const username = 'lum-customer-hl_e5786cfe-zone-static_res';
    const password = 'fav063fkki4u';
    const port = 22225;
    const user_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
    const session_id = (1000000 * Math.random()) | 0;
    const super_proxy = 'http://' + username + '-session-' + session_id + ':' + password + '@zproxy.lum-superproxy.io:' + port;

    return new Promise((resolve, reject) => {
      // make the request then return the response and the number
      const cookieData = {
        fastly_unique_id: "a509b5cd8ca1463290dde051f4de0be9",
        _ga: "GA1.2.690899060.1545949671",
        _px2: "eyJ1IjoiYThmZTNkYTAtMGEyNi0xMWU5LTljZWItZjliYjU4ODAyMTRhIiwidiI6ImE5NWI5ZmUwLTBhMjYtMTFlOS05MTI1LWZkNjVhY2VlNmQwZiIsInQiOjE1NDU5NDk5ODAzODcsImgiOiJlMGZlODVmZGFkN2I4NTIwM2M2NWRkMGJmNGQ4ZDBhY2U0MzdhNDMyYmYzYmMxOGI0ZTMwNzk4NjdiNTgxZTM0In0"
      }
      const fastly_unique_id = cookieData.fastly_unique_id;
      const _ga_key = cookieData._ga;
      const _px2_key = cookieData._px2;



      requestPromise(
        {
          uri,
          // proxy: super_proxy,
          headers: {
            // 'cookie': `fastly_unique_id=${fastly_unique_id}; _ga=${_ga_key}; _px2=${_px2_key};`,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36',
            // 'user-agent': 'PostmanRuntime/7.4.0',
            'cache-control': 'no-cache',
          },
          jar: cookiejar
        }
      ).then(
        (response) => {
          resolve({response, meta});
        },
        (err) => {
          reject({error: err, meta});
        }
      );
    })
  }

}