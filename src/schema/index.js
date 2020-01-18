const { readdirSync } = require('fs')
const { merge } = require('lodash')
const { makeExecutableSchema } = require('graphql-tools')
const { gql } = require('apollo-server-express')

let schemas = []
const RootQuery = gql`
    type Query {
        _empty: String
    }
`

try {
    schemas = readdirSync(__dirname)
        .reduce((acc, cur) => {
            if (cur !== 'index.js') 
                acc.push(require(`./${cur.replace(/\.js/g, '')}`))
            return acc
        }, [])
} catch (err) {
    // handle error pada serverless zeit
    schemas = ['kampus', 'prodi', 'mahasiswa']
        .map(schema => require(`./${schema}`))
}

module.exports = makeExecutableSchema({
    typeDefs: [RootQuery, ...schemas.map(({ typeDef }) => typeDef)],
    resolvers: merge(...schemas.map(({ resolvers }) => resolvers))
})
