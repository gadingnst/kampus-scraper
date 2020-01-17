const { gql } = require('apollo-server-express')
const puppeteer = require('../puppeteer')

const typeDef = gql`
    type Prodi {
        id: ID
        name: String
    }
    
    extend type Query {
        getProdiList(kampusID: ID): [Prodi]
    }
`

const resolvers = {
    Query: {
        getProdiList: async (_, { kampusID }) => puppeteer()
            .then(browser => browser
                .newPage()
                .then(async page => {
                    await page.goto(encodeURI(`${process.env.API_URL}/prodi/ajaxGetProdyByPT/${kampusID}`))
                    const result = await page.evaluate(() => [
                        ...document.getElementById('id_sms').children
                    ].reduce((acc, cur) => {
                        const id = cur.getAttribute('value')
                        !id || acc.push({ id, name: cur.textContent })
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

module.exports = {
    typeDef, resolvers
}