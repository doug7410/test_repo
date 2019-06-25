'use strict'

const {Command} = require('@adonisjs/ace')
const cheerio = require('cheerio')
const http = require('../services/httpService')
const Database = use('Database')
const drugUrl = require('../services/drugUrl');
const {chunk} = require('underscore')


class BlinkHealth extends Command {
  static get signature() {
    return 'blink:health'
  }

  static get description() {
    return 'Tell something helpful about this command'
  }

  async handle(args, options) {
    this.info('blink:health command')
    let successes = []
    let failures = []

    await processUri('https://www.goodrx.com/amlodipine-atorvastatin/?drug-name=AMLODIPINE+ATORVASTATIN&form=tablet&dosage=10mg-10mg&quantity=30', 1)

    dd('done')
    const drugs = await Database.table('drug_pull_goodrx').whereNull('unavailable').map(drug => drugUrl(drug))
    const drugChunks = chunk(drugs, 20)

    let counter = 0;
    const chunks = drugChunks.slice(0,3);
    // console.log(chunks)
    // chunks.pop()
    // console.log('^^^^^^^^^^^^^^^^^^^^^^')
    // console.log(chunks)
    // dd('here')
    // processChunks(chunks)

    drugChunks.slice(0,1).forEach(chunkOfDrugs => {
      processChunk(chunkOfDrugs)
      console.log('*************************')
    })

    Database.close()

    console.log('###################################################')


    let done = 0

    /**
     *
     * @param uri
     * @param counter
     * @returns {PromiseLike<T> | Promise<T>}
     */
    function processUri(uri, counter) {

      return http.get(uri, {uri, count: counter})
        .then(
          ({response, meta}) => {
            const domParser = cheerio.load(response);
            const html = domParser('#uat-drug-title').text();
            console.log(meta.count, html)

            if (html) {
              successes.push(meta.uri)
            } else {
              failures.push(meta.uri)
            }

          },
          error => {
            console.log(error)
            failures.push(error.meta)
          }
        )
    }

    /**
     *
     * @param chunk array
     */
    function processChunk(chunk) {
      let httpPromises = []

      chunk.forEach(uri => {
        counter++
        console.log(counter, uri)

        httpPromises.push(
          processUri(uri, counter)
        )
      })

      Promise.all(httpPromises).then(() => {
        // process the failures
        if (failures.length) {
          console.log({failures})
          let currentFailures = failures.slice(0)
          failures = []
          processChunk(currentFailures)
        } else {
          console.log('done!')
        }
      })
    }

    function processChunks(chunks) {
      let httpPromises = []
      let chunk
      let fromFailure = false

      if(Array.isArray(chunks[0])) {
        chunk = chunks.pop()
      } else {
        fromFailure = true
        chunk = chunks
      }

      // dd(chunk)
      chunk.forEach(uri => {
        counter++
        console.log(counter, uri)

        httpPromises.push(
          processUri(uri, counter)
        )
      })

      Promise.all(httpPromises).then(() => {
        // process the failures
        if (failures.length) {
          console.log({failures})
          let currentFailures = failures.slice(0)
          failures = []
          processChunks(currentFailures)
        } else {
          done++
          console.log(done, ': done!')
          if(!fromFailure) {
            processChunks(chunks)
          }
        }
      })
    }

    function dd(arg) {
      console.log(arg)
      process.exit()
    }
  }


}

module.exports = BlinkHealth
