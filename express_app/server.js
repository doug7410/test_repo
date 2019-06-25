const express = require('express')
const registerRoutes = require('./routes')
const app = express()
const port = 3000

registerRoutes(app)
// app.get('/', (req, res) => res.send('Hello World!' + "\r\n"))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

