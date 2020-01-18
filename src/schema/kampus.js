const { gql } = require('apollo-server-express')
const { get } = require('axios').default
const { API_BASEURL } = require('../config')

const typeDef = gql`
    type Kampus {
        id: ID
        label: String,
        nama: String
    }

    extend type Query {
        getKampusByKeyword(keyword: String): [Kampus]
    }
`

const resolvers = {
    Query: {
        getKampusByKeyword: (_, { keyword }) =>
            get(encodeURI(`${API_BASEURL}/ajax/listPT/${keyword}`))
                .then(({ data: { items: data = [] } }) => data.map(kampus => ({
                    id: kampus.value,
                    label: kampus.label.split(/\s\s\s/)[0],
                    nama: kampus.label.split(/\s\s\s/)[1]
                })))
                .catch(reason => {
                    console.log(reason.response)
                    return []
                })
    }
}

exports.typeDef = typeDef
exports.resolvers = resolvers