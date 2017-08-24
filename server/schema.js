const {
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = require('graphql');

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    website: {
      type: GraphQLString,
    },
  },
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    currentUser: {
      type: User,
      resolve(data, args, { getUserById, currentUserId }) {
        return getUserById(currentUserId);
      },
    },
  }
});

module.exports = new GraphQLSchema({
  query: Query,
});
