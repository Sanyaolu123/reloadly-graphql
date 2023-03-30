'use strict'

const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql')
const { GraphQLJSON } = require('graphql-scalars')

const Get_OperatorsType = new GraphQLObjectType({
  name: 'operators',
  description: 'This is to get list of operators',
  fields: () => ({
    id: { type: GraphQLInt },
    operatorId: { type: GraphQLInt },
    name: { type: GraphQLString },
    logoUrls: { type: new GraphQLList(GraphQLString) },
    fixedAmounts: { type: new GraphQLList(GraphQLFloat) },
    fixedAmountsDescriptions: { type: GraphQLJSON }
  })
})

const Mobile_TopupType = new GraphQLObjectType({
  name: 'transactionId',
  description: 'This is to make mobile topup',
  fields: () => ({
    transactionId: { type: GraphQLInt }
  })
})

module.exports = { Get_OperatorsType, Mobile_TopupType }