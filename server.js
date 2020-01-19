const http = require('http')
const express = require('express')
const { ApolloServer, ApolloError } = require('apollo-server-express')
const schema = require('./src/schema')

const port = process.env.PORT || 3300
const app = express()
const server = http.createServer(app)

const Apollo = new ApolloServer({
    introspection: true,
    playground: true,
    schema,
})

Apollo.applyMiddleware({ app, path: '/graphql' })

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

server.listen(port, () => {
    console.log(`> GraphQL ready on http://localhost:${port}/graphql`)
})

server.on('error', err => {
    console.log(err)
    if (err.code === 'ETIMEDOUT')
        throw new ApolloError('Connection Timeout. Please Try again.', 408)
    else
        throw new ApolloError('Internal Server Error. Please comeback later.', 500)
})
