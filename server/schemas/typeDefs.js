const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book!]
  }

  type Book {
  _id: ID!
  authors: [String!]
  description: String!
  bookId: String!
  image: String
  link: String
  title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
  authors: [String!]
  description: String!
  bookId: String!
  image: String
  link: String
  title: String!
  }

  type Query {
    getSingleUser: User
    me: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String! password: String!): Auth
    saveBook(_id: ID!, bookToSave: BookInput!): User
    deleteBook(_id: ID!, bookToDelete: ID!): User
  }
`;

module.exports = typeDefs;
