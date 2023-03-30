'use strict'

const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql')
const { GraphQLJSON, GraphQLDID, GraphQLDate } = require('graphql-scalars')


const TransactionContentType = new GraphQLObjectType({
  name: 'transactioncontents',
  description: 'Transaction Contents',
  fields: () => ({
    transactionId: { type: GraphQLInt },
    status: { type: GraphQLString },
    customIdentifier: { type: GraphQLString },
    operatorId: { type: GraphQLInt },
    operatorName: { type: GraphQLString },
    discount: { type: GraphQLInt },
    requestedAmount: { type: GraphQLFloat },
    deliveredAmount: { type: GraphQLFloat },
    transactionDate: { type: GraphQLString }
  })
})

const TransactionsType = new GraphQLObjectType({
  name: 'transactions',
  description: 'This is to get list of transactions',
  fields: () => ({
    content: { type: new GraphQLList(TransactionContentType) },
    totalElements: { type: GraphQLInt }
  })
})

module.exports = { TransactionsType }