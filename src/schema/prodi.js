const { gql } = require('apollo-server-express')
const puppeteer = require('../config/puppeteer')
const { API_BASEURL } = require('../config')

const typeDef = gql`
    type Prodi {
        id: ID
        nama: String
    }
    
    extend type Query {
        getListProdi(kampusID: ID!): [Prodi]
    }
`

const resolvers = {
    Query: {
        getListProdi: (_, { kampusID }) =>
            puppeteer()
                .then(browser => browser
                    .newPage()
                    .then(async page => {
                        await page.goto(encodeURI(`${API_BASEURL}/prodi/ajaxGetProdyByPT/${kampusID}`))
                        const result = await page.evaluate(() => [
                            ...document.getElementById('id_sms').children
                        ].reduce((acc, cur) => {
                            const id = cur.getAttribute('value')
                            !id || acc.push({ id, nama: cur.textContent })
                            return acc
                        }, []))
                        browser.close()
                        return result
                    })
                    .catch(reason => {
                        console.log(reason)
                        return []
                    })
                )
    }
}

exports.typeDef = typeDef
exports.resolvers = resolvers