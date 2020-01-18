const { gql } = require('apollo-server-express')
const puppeteer = require('../config/puppeteer')

const typeDef = gql`
    type Mahasiswa {
        nim: ID
        nama: String
        kampus: String
        prodi: String
        lulus: String
        ijazah: String
    }
    
    extend type Query {
        getMahasiswaByKeyword(keyword: String, prodiID: ID, kampusID: ID): [Mahasiswa]
        getMahasiswaByNIM(nim: ID, prodiID: ID, kampusID: ID): Mahasiswa
    }
`

const resolvers = {
    Query: {
        // todo
        getMahasiswaByKeyword: (_, { keyword, prodiID, kampusID }) => [],
        getMahasiswaByNIM: (_, { nim, prodiID, kampusID }) => ({})
    }
}

exports.typeDef = typeDef
exports.resolvers = resolvers