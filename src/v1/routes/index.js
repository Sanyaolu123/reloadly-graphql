const express = require('express')
const routes = express.Router()
const { graphqlHTTP } = require('express-graphql')
const { RootQueryType } = require('../schemas/root_query')
const { GraphQLSchema } = require('graphql')


const schema = new GraphQLSchema({
  query: RootQueryType,
})

routes.use('/', graphqlHTTP({
  schema: schema,
  graphiql: true

}))

module.exports = routes  