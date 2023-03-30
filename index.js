const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const PORT = 8181 || process.env.PORT
const { bootstrap } = require('./bootstrap')
const { errorProcessing } = require('./src/v1/routes/core/error-handler')
require('dotenv').config()


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

const routes = require(`./src/${process.env.VERSION}/routes`)

bootstrap(`${process.env.VERSION}`, routes, app)

app.use((request, response, next) => {
  next({
      errorCode : 404,
      errorMessage: {
          message: 'Invalid Endpoint.'
      }
  })
})


app.use((error, request, response, next) => {
  if(error instanceof Error) error = errorProcessing(error)
  const statusCode = parseInt(error.errorCode)
  const statusMessage = error.errorMessage
  response.status(statusCode).json(statusMessage)
})

const options = {
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem')
}

https.createServer(options, app).listen(PORT, () => {
  console.log(`App started on Port: ${PORT}`)
})
