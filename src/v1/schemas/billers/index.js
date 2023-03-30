'use strict'

const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql')
const { GraphQLJSON } = require('graphql-scalars')

const BillerContentType = new GraphQLObjectType({
  name: 'billercontent',
  description: 'Biller Content',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    serviceType: { type: GraphQLString },
    minLocalTransactionAmount: { type: GraphQLString },
    maxLocalTransactionAmount: { type: GraphQLString },
    localTransactionFee: { type: GraphQLString }
  })
})


const BillersType = new GraphQLObjectType({
  name: 'billers',
  description: 'This is to get list of billers',
  fields: () => ({
    content: { type: new GraphQLList(BillerContentType) },
    totalElements: { type: GraphQLInt }
  })
})

const PayBillType = new GraphQLObjectType({
  name: 'pay_bill',
  description: 'Pay Bill',
  fields: () => ({
    id: { type: GraphQLInt },
    status: { type: GraphQLString },
    referenceId: { type: GraphQLString },
    code: { type: GraphQLString },
    message: { type: GraphQLString },
    submittedAt: { type: GraphQLString },
    finalStatusAvailabilityAt: { type: GraphQLString },
  })
})

module.exports = { BillersType, PayBillType }