'use strict'

const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql')


const TransactionContentType = new GraphQLObjectType({
  name: 'transactioncontents_topup',
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

const TransactionsTopupType = new GraphQLObjectType({
  name: 'transactions_topup',
  description: 'This is to get list of topup transactions',
  fields: () => ({
    content: { type: new GraphQLList(TransactionContentType) },
    totalElements: { type: GraphQLInt }
  })
})

module.exports = { TransactionsTopupType }