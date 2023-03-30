const { Kind } = require('graphql/language');
const { GraphQLScalarType } = require('graphql')

const BigInt = new GraphQLScalarType({
  name: 'BigInt',
  description: 'The `BigInt` scalar type represents non-fractional, signed whole numeric values',
  serialize: (value) => String(value),
  parseValue: (value) => BigInt(value),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.INT) {
      return BigInt(ast.value);
    }
    return null;
  }
});

module.exports = { BigInt }