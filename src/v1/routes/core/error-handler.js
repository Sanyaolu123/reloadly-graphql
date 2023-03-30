'use strict'
const fs = require('fs')

function errorProcessing(receivedErrorMessage){
  let errorMessage = receivedErrorMessage.message.split(':')[1]
  errorMessage = errorMessage.split('|')

  let errorObject = errorMessage.length

  if(errorObject <= 1) logErrorToFile(receivedErrorMessage)

  return {
    errorCode: (errorObject > 1) ? errorMessage[0] : 500,
    errorMessage: {
      message: (errorObject > 1) ? errorMessage[1] : 'Internal Server Error'
    }
  }

}

function errorHandling(receivedErrorMessage){
  throw new Error(receivedErrorMessage)
  // return receivedErrorMessage
}

function logErrorToFile(receivedErrorMessage){
  fs.appendFileSync(`error.log.txt`, new Date() + receivedErrorMessage + '\r\n')
}

module.exports = {
  errorProcessing,
  errorHandling
}

