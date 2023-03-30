'use strict'
function bootstrap(version, routes, router){

  router.use(`/api/${version}`, routes)

  router.get('/', (request, response) => {
    response.status(200).json({ statusCode: 200, statusMessage: 'Ok' })
  })


}

module.exports = {
  bootstrap
}