'use strict'

const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql')

const BalanceInfo = new GraphQLObjectType({
  name: 'balance_info',
  fields: () => ({
    cost: { type: GraphQLFloat }
  })
})

const SubscriberDetails = new GraphQLObjectType({
  name: 'subscriber_details',
  fields: () => ({
    accountNumber: { type: GraphQLString }
  })
})

const PinDetails = new GraphQLObjectType({
  name: 'pin_details',
  fields: () => ({
    token: { type: GraphQLString }
  })
})

const BillDetails = new GraphQLObjectType({
  name: 'bill_details',
  fields: () => ({
    type: { type: GraphQLString },
    billerId: { type: GraphQLInt },
    billerName: { type: GraphQLString },
    serviceType: { type: GraphQLString },
    completedAt: { type: GraphQLString },
    subscriberDetails: { type: SubscriberDetails },
    pinDetails: { type: PinDetails }
  })
})


const TransactionType = new GraphQLObjectType({
  name: 'transaction_info',
  fields: () => ({
    id: { type: GraphQLInt },
    status: { type: GraphQLString },
    referenceId: { type: GraphQLString },
    amount: { type: GraphQLInt },
    deliveryAmount: { type: GraphQLInt },
    fee: { type: GraphQLFloat },
    discount: { type: GraphQLFloat },
    submittedAt: { type: GraphQLString },
    balanceInfo: { type: BalanceInfo },
    billDetails: { type: BillDetails }
  })
})

const TransactionBillerContentType = new GraphQLObjectType({
  name: 'transactioncontents_biller',
  description: 'Transaction Contents',
  fields: () => ({
    code: { type: GraphQLString },
    message: { type: GraphQLString },
    transaction: { type: TransactionType }
  })
})

const TransactionsBillerType = new GraphQLObjectType({
  name: 'transactions_biller',
  description: 'This is to get list of billers transactions',
  fields: () => ({
    content: { type: new GraphQLList(TransactionBillerContentType) },
    totalElements: { type: GraphQLInt }
  })
})

module.exports = { TransactionsBillerType, TransactionBillerContentType }