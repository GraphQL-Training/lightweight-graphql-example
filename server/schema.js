const {
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
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
    avatarUrl: {
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
    user: {
      type: User,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt),
        }
      },
      resolve(data, { id }, { getUserById }) {
        return getUserById(id);
      },
    },
  }
});

const UserPatch = new GraphQLInputObjectType({
  name: 'UserPatch',
  fields: {
    name: {
      type: GraphQLString,
    },
    website: {
      type: GraphQLString,
    },
    avatarUrl: {
      type: GraphQLString,
    },
  },
});

const UpdateCurrentUserInput = new GraphQLInputObjectType({
  name: "UpdateCurrentUserInput",
  fields: {
    clientMutationId: {
      type: GraphQLString,
    },
    userPatch: {
      type: new GraphQLNonNull(UserPatch),
    },
  },
});

const UpdateUserPayload = new GraphQLObjectType({
  name: "UpdateUserPayload",
  fields: {
    clientMutationId: {
      type: GraphQLString,
    },
    user: {
      type: User,
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateCurrentUser: {
      type: new GraphQLNonNull(UpdateUserPayload),
      args: {
        input: {
          type: new GraphQLNonNull(UpdateCurrentUserInput),
        },
      },
      async resolve(data, { input: { clientMutationId, userPatch } }, { updateUserById, currentUserId }) {
        return {
          clientMutationId: clientMutationId,
          user: await updateUserById(currentUserId, userPatch),
        };
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
