const { gql } = require('apollo-server-express')
const { get } = require('axios').default

const typeDef = gql`
    type Kampus {
        id: ID
        label: String,
        name: String
    }

    extend type Query {
        getKampusList(keyword: String): [Kampus]
    }
`

const resolvers = {
    Query: {
        getKampusList: (_, { keyword }) => 
            get(encodeURI(`${process.env.API_URL}/ajax/listPT/${keyword}`))
                .then(({ data: { items: data = [] } }) => data.map(kampus => ({
                    id: kampus.value,
                    label: kampus.label.split(/\s\s\s/)[0],
                    name: kampus.label.split(/\s\s\s/)[1]
                })))
                .catch(reason => {
                    console.log(reason.response)
                    return []
                })
    }
}

exports.typeDef = typeDef
exports.resolvers = resolvers

module.exports = {
    typeDef, resolvers
}