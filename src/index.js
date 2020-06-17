const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const db = require('./db');
const modules = require('./modules');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const port = process.env.PORT || 4000;
const db_host = process.env.DB_HOST;

db.connect(db_host);

const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Session invalid');
    }
  }
};

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);

    return { modules, user };
  }
});

server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () => console.log('Running...'));
