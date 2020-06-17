const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
    users: [User!]!
    user(username: String!): User!
    me: User!
  }

  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signup(username: String!, email: String!, password: String!): String!
    singin(username: String!, email: String!, password: String): String!
    toggleFavorite(id: ID!): Note!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoriteBy: [User!]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    notes: [Note!]!
    favorites: [Note!]!
  }
`;
