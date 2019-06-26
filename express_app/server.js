const express = require('express')
const registerRoutes = require('./routes')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
process.setMaxListeners(25); // TODO: not sure if we need this


registerRoutes(app)


app.listen(port, () => console.log(`Drug scraper app listening on port ${port}!`))

