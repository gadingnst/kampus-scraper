const { merge } = require('lodash')
const { makeExecutableSchema } = require('graphql-tools')
const { gql } = require('apollo-server-express')
const Kampus = require('./kampus')
const Prodi = require('./prodi')

const RootQuery = gql`
    type Query {
        _empty: String
    }
`

module.exports = makeExecutableSchema({
    typeDefs: [RootQuery, Kampus.typeDef, Prodi.typeDef],
    resolvers: merge(Kampus.resolvers, Prodi.resolvers)
})