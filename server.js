const http = require('http')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const schema = require('./src/schema')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express()
const port = process.env.PORT || 3300
const server = http.createServer(app)

const Apollo = new ApolloServer({
    introspection: true,
    playground: true,
    schema,
})

Apollo.applyMiddleware({ app, path: '/graphql' })
Apollo.installSubscriptionHandlers(server)

app.get('*', (_, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

server.listen(port, () => {
    console.log(`> GraphQL ready on http://localhost:${port}/graphql`)
})
