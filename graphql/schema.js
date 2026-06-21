const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Building {
    id: ID!
    address: String!
    city: String!
    postal_code: String!
    country: String!
    status: String!
    households: [Household!]!
  }

  type Household {
    id: ID!
    building_id: Int!
    room_number: String!
    floor: Int
    max_residents: Int!
    status: String!
    building: Building!
    user: User             # 1:1 Beziehung: Ein Haushalt hat exakt EINEN User
  }

  type User {
    id: ID!
    household_id: Int
    email: String!
    first_name: String
    last_name: String
    phone: String
    address: String
    city: String
    postal_code: String
    role: String!
    status: String!
  }

  type Query {
    buildings: [Building!]!
    households: [Household!]!
    users: [User!]!
    user(id: ID!): User
  }
`;

module.exports = typeDefs;