'use strict'

const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } = require('graphql')
const { GraphQLJSON } = require('graphql-scalars');

const accessTokenType = new GraphQLObjectType({
  name: 'access_token',
  description: 'Get bearer token for api calls',
  fields: () => ({
    access_token: { type: GraphQLString },
    scope: { type: GraphQLString },
    expires_in: { type: GraphQLInt },
    token_type: { type: GraphQLString }
  })
})


//  ,
/* resolve: (accessToken) => {
  return users
}
*/

module.exports = {
  accessTokenType
}