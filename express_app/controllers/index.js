const fs = require('fs')

const controllers = {}

/**
 * This registers all controllers
 */
fs.readdirSync(__dirname).forEach(fileName => {
  if (__dirname + '/' + fileName !== __filename) {

    // TODO: Make sure the file ends with 'Controller.js'
    let controllerName = fileName.split('Controller')[0]

    controllers[controllerName] = (require(__dirname+'/'+fileName))
  }
})

module.exports = controllers