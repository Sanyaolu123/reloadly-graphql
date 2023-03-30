const { GraphQLObjectType, GraphQLSchema, GraphQLJSON, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql')

const { accessTokenType } = require('../schemas/accessToken')
const { Get_OperatorsType, Mobile_TopupType } = require('../schemas/operators')
const { TransactionsType } = require('../schemas/transactions')
const fetch = require('node-fetch');
const { GraphQLDate } = require('graphql-scalars');
require('dotenv').config()

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({

    accessToken:  {
      type: accessTokenType,
      args: {
        type: { type: GraphQLNonNull(GraphQLString) }
      },
      description: 'Get Bearer Token to make Api Calls',
      resolve: async (parent, {type}) => {
        const url = "https://auth.reloadly.com/oauth/token"
        let audience = ""

        switch(type){
          case 'airtime':
            audience = "https://topups-sandbox.reloadly.com" // test
            // audience = "https://topups.reloadly.com" // live
            break;
          case 'utility':
            audience = "https://utilities-sandbox.reloadly.com" //test
            // audience = "https://utilities.reloadly.com" //live
            break
        }
        // const url = 'https://auth.reloadly.com/oauth/token';
        const options = {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
          body: JSON.stringify({
            client_id: process.env.CLIENTID,
            client_secret: process.env.CLIENTSECRET,
            grant_type: 'client_credentials',
            audience: audience
          }),
          cache: "no-store"
        };

        let token = ""

        await fetch(url, options)
          .then(res => res.json())
          .then(json => token = json)
          .catch(err => console.error('error:' + err));

        return token
      }
    },

    operators: {
      type: new GraphQLList(Get_OperatorsType),
      description: "List all available operators for mobile topup (e.g airtime and data)",
      args: {
        bearer: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, { bearer }) => {
        // test
        const url = 'https://topups-sandbox.reloadly.com/operators/countries/NG?suggestedAmountsMap=true&suggestedAmounts=true&includePin=true&includeData=true&includeBundles=true';
        // live
        // const url = 'https://topups.reloadly.com/operators/countries/NG?suggestedAmountsMap=true&suggestedAmounts=true&includePin=true&includeData=true&includeBundles=true';
        const options = {
          method: 'GET',
          headers: {
            Accept: 'application/com.reloadly.topups-v1+json',
            Authorization: `Bearer ${bearer}`
          }
        };

        let operators = ""

        await fetch(url, options)
          .then(res => res.json())
          .then(json => { operators = json })
          .catch(err => console.error('error:' + err));

        // return {token}
        return operators
      }
    },

    mobile_topup: {
      type: Mobile_TopupType,
      description: 'Mobile TopUp (e.g Airtime and Data)',
      args: {
        bearer: { type: GraphQLNonNull(GraphQLString) },
        operatorId: { type: GraphQLNonNull(GraphQLInt) },
        amount: { type: GraphQLNonNull(GraphQLFloat) },
        phoneNumber: { type: GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { bearer, operatorId, amount, phoneNumber, userId }) => {
        const url = 'https://topups-sandbox.reloadly.com/topups-async'; //test
        // const url = 'https://topups.reloadly.com/topups-async'; //live
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/com.reloadly.topups-v1+json',
            Authorization: `Bearer ${bearer}`
          },
          body: JSON.stringify({
            operatorId: `${operatorId}`,
            amount: `${amount}`,
            useLocalAmount: true,
            customIdentifier: `${userId}`,
            // recipientEmail: 'abideensanyaolu03@gmail.com',
            recipientPhone: {countryCode: 'NG', number: `${phoneNumber}`}
          })
        };
        
        let transactionId = ""

        await fetch(url, options)
          .then(res => res.json())
          .then(json => transactionId = json)
          .catch(err => console.error('error:' + err));

        return transactionId
      }
    },

    transactions: {
      type: TransactionsType,
      description: 'Get All Transactions',
      args: {
        bearer: { type: GraphQLNonNull(GraphQLString) },
        page: { type: GraphQLInt },
        operatorId: { type: GraphQLInt },
        userId: { type: GraphQLString },
        startDate: { type: GraphQLDate },
        endDate: { type: GraphQLDate }
      },
      resolve: async (parent, { bearer, page="", operatorId="", userId="", startDate="", endDate="" }) => {
        // test
        const url = `https://topups-sandbox.reloadly.com/topups/reports/transactions?page=${page}&countryCode=NG&operatorId=${operatorId}&customIdentifier=${userId}&startDate=${startDate}&endDate=${endDate}`;
        // live
        // const url = `https://topups.reloadly.com/topups/reports/transactions?size=${size}&page=${page}&countryCode=NG&operatorId=${operatorId}&customIdentifier=${userId}&startDate=${startDate}&endDate=${endDate}`;
        const options = {
          method: 'GET',
          headers: {
            Accept: 'application/com.reloadly.topups-v1+json',
            Authorization: `Bearer ${bearer}`
          }
        };
        
        let transactions = ""

        await fetch(url, options)
          .then(res => res.json())
          .then(json => transactions = json)
          .catch(err => console.error('error:' + err));

        console.log(transactions)
        return transactions
      }
    }
    
  })
})


module.exports = {

  RootQueryType

}