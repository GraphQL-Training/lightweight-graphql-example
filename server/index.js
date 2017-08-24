const express = require('express');
const graphqlHTTP = require('express-graphql');
const MySchema = require('./schema');
const { getUserById } = require('./userAPIMock');

const app = express();

function setContext(req, res, next) {
  req.currentUserId = 1; // TODO: req.session.userId;
  req.getUserById = getUserById;
  next();
}

app.use('/graphql', setContext, graphqlHTTP({
  schema: MySchema,
  graphiql: true
}));

const CLIENT_DIR = `${__dirname}/../client`;

app.use(express.static(CLIENT_DIR));

app.listen(2345);
