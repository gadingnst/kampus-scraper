require('dotenv').config()
const http = require('http')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const schema = require('./schema')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

const Apollo = new ApolloServer({
    introspection: true,
    playground: true,
    schema,
})

Apollo.applyMiddleware({ app, path: '/graphql' })

server.listen(port, () => {
    console.log(`> GraphQL ready on http://localhost:${port}/graphql`)
})
