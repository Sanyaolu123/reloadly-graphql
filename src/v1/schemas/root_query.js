const { GraphQLObjectType, GraphQLSchema, GraphQLJSON, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } = require('graphql')

const { accessTokenType } = require('../schemas/accessToken')
const { Get_OperatorsType, Mobile_TopupType } = require('../schemas/operators')
const { TransactionsTopupType } = require('./transactions_topup')
const { TransactionsBillerType, TransactionBillerContentType } = require('./transactions_biller')
const { BillersType, PayBillType } = require('../schemas/billers')
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
          case 'biller':
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

    billers: {
      type: BillersType,
      description: 'Get List of All Billers',
      args: {
        bearer: { type: GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        serviceType: { type: GraphQLString },
      },
      resolve: async (parent, { bearer, id="", name="", type="", serviceType="" }) => {
        // test
        const url = `https://utilities-sandbox.reloadly.com/billers?id=${id}&name=${name}&type=${type}&serviceType=${serviceType}&countryISOCode=NG`;
        // live
        // const url = 'https://utilities.reloadly.com/billers?id=&name=&type=&serviceType=&countryISOCode';
        const options = {
          method: 'GET',
          headers: {
            Accept: 'application/com.reloadly.utilities-v1+json',
            Authorization: `Bearer ${bearer}`
          }
        };

        let billers = ""

        await fetch(url, options)
          .then(res => res.json())
          .then(json => { billers = json })
          .catch(err => console.error('error:' + err));

        // return {token}
        return billers
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
        userId: { type: GraphQLString },
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

    pay_bill: {
      type: PayBillType,
      description: 'Pay Bill (e.g Electricity)',
      args: {
        bearer: { type: GraphQLNonNull(GraphQLString), description: 'Bearer token gotten from access token (type: biller)' },
        subscriberAccountNumber: { type: GraphQLNonNull(GraphQLString), description: 'SubScriber Account Number (Meter no)' },
        amount: { type: GraphQLNonNull(GraphQLFloat) },
        billerId: { type: GraphQLNonNull(GraphQLInt), description: 'Biller Id gotten from billers' }, // from get billers
        referenceId: { type: GraphQLString, description: 'Optional referenceId' },
      },
      resolve: async (parent, { bearer, subscriberAccountNumber, amount, billerId, referenceId }) => {
        const url = 'https://utilities-sandbox.reloadly.com/pay'; //test
        // const url = 'https://utilities.reloadly.com/pay'; //test
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/com.reloadly.utilities-v1+json',
            Authorization: `Bearer ${bearer}`
          },
          body: JSON.stringify({
            subscriberAccountNumber: `${subscriberAccountNumber}`,
            amount: amount,
            billerId: billerId,
            useLocalAmount: true,
            referenceId: `${referenceId}`
          })
        };

        let bill = ""

        await fetch(url, options)
          .then(res => res.json())
          .then(json => bill = json)
          .catch(err => console.error('error:' + err));

        return bill
      }
    },

    transactions_topup: {
      type: TransactionsTopupType,
      description: 'Get TopUp Transactions',
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

        return transactions
      }
    },

    transactions_billers: {
      type: TransactionsBillerType,
      description: 'Get Biller Transactions',
      args: {
        bearer: { type: GraphQLNonNull(GraphQLString) },
        operatorId: { type: GraphQLInt },
        userId: { type: GraphQLString },
        startDate: { type: GraphQLDate },
        endDate: { type: GraphQLDate },
        status: { type: GraphQLString },
        billerType: { type: GraphQLString },
        serviceType: { type: GraphQLString },
        referenceId: { type: GraphQLString }
      },
      resolve: async (parent, { bearer, operatorId="", userId="", status="", startDate="", endDate="", referenceId="", billerType="", serviceType="" }) => {
        // test
        const url = `https://utilities-sandbox.reloadly.com/transactions?referenceId=${referenceId}&startDate=${startDate}&endDate=${endDate}&status=${status}&serviceType=${serviceType}&billerType=${billerType}`;
        // live
        // const url = `https://topups.reloadly.com/topups/reports/transactions?size=${size}&page=${page}&countryCode=NG&operatorId=${operatorId}&customIdentifier=${userId}&startDate=${startDate}&endDate=${endDate}`;
        const options = {
          method: 'GET',
          headers: {
            Accept: 'application/com.reloadly.utilities-v1+json',
            Authorization: `Bearer ${bearer}`
          }
        };
        
        let transactions = ""

        await fetch(url, options)
          .then(res => res.json())
          .then(json => transactions = json)
          .catch(err => console.error('error:' + err));

        return transactions
      }
    },

    transactions_billers_id: {
      type: TransactionBillerContentType, 
      description: 'Get Biller Transactions by Id',
      args: {
        bearer: { type: GraphQLNonNull(GraphQLString), description: "Bearer Token" },
        id: { type: GraphQLNonNull(GraphQLInt), description: "Biller transaction id" },
      },
      resolve: async (parent, { bearer, id }) => {
        // test
        const url = `https://utilities-sandbox.reloadly.com/transactions/${id}`;
        // live
        // const url = `https://utilities.reloadly.com/transactions/${id}`;
        const options = {
          method: 'GET',
          headers: {
            Accept: 'application/com.reloadly.utilities-v1+json',
            Authorization: `Bearer ${bearer}`
          }
        };
        
        let transactions = ""

        await fetch(url, options)
          .then(res => res.json())
          .then(json => transactions = json)
          .catch(err => console.error('error:' + err));

        return transactions
      }
    }
    
  })
})


module.exports = {

  RootQueryType

}