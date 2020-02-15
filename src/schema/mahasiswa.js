const { gql } = require('apollo-server-express')
const { load } = require('cheerio')
const { get } = require('axios').default
const puppeteer = require('../config/puppeteer')
const { getOffset } = require('../utils/helpers')
const { API_BASEURL } = require('../config')

const typeDef = gql`
    type SKS {
        no: Int
        semester: String,
        status: String,
        jumlah: Int
    }

    type Mahasiswa {
        nim: ID
        nama: String
        gender: String
        kampus: String
        prodi: String
        angkatan: String
        status: String
        kelulusan: String
        ijazah: String
        sks: [SKS]
    }
    
    extend type Query {
        getMahasiswa(kampusID: ID, prodiID: ID, keyword: String!): Mahasiswa
        getListMahasiswa(page: Int, kampusID: ID, prodiID: ID, keyword: String): [Mahasiswa]
    }
`

const search = ({ kampusID = '', prodiID = '', keyword = '' }) => {
    const inputKampus = document.getElementById('id_sp')
    const inputProdi = document.createElement('select')
    const inputKeyword = document.getElementById('keyword')
    const secureCode = document.getElementById('kode_pengaman')
    const captcha1 = document.getElementsByName('captcha_value_1')[0].value
    const captcha2 = document.getElementsByName('captcha_value_2')[0].value
    inputKampus.setAttribute('value', kampusID)
    inputKeyword.setAttribute('value', keyword)
    secureCode.setAttribute('value', parseInt(captcha1) + parseInt(captcha2))
    inputProdi.setAttribute('id', 'id_sms')
    inputProdi.setAttribute('name', 'id_sms')
    inputProdi.classList.add('input-xlarge')
    inputProdi.setAttribute('value', prodiID)
    document.getElementById('prodi').appendChild(inputProdi)
    document.getElementById('searchMhsForm').submit()
}

const scrape = hashUrl => get(encodeURI(hashUrl))
    .then(({ data: html }) => {
        const $ = load(html)
        const detail = $('div.main table > tbody')
            .children()
            .toArray()
            .reduce((acc, cur, idx) => {
                const dataElement = $(cur).children().eq(2)
                if (dataElement) {
                    const data = dataElement.text().trim()
                    switch(idx) {
                        case 0: acc.nama = data || null
                        case 1: acc.gender = data || null
                        case 3: acc.kampus = data || null
                        case 4: acc.prodi = data || null
                        case 5: acc.nim = data || null
                        case 6: acc.angkatan = data.split(/\s+/)[0] || null
                        case 8: acc.status = data || null
                        case 9: acc.kelulusan = data || null
                        case 10: acc.ijazah = data || null
                    }
                }
                return acc
            }, {})

        detail.sks = $('#kuliahmhs .tmiddle')
            .toArray()
            .map(data => ({
                no: $(data).children().eq(0).text().trim(),
                semester: $(data).children().eq(1).text().trim(),
                status: $(data).children().eq(2).text().trim(),
                jumlah: $(data).children().eq(3).text().trim() || 0
            }))
        
        return detail
    })

const resolvers = {
    Query: {
        getListMahasiswa: async (_, args) => {
            const browser = await puppeteer()
            try {
                const offset = getOffset(args.page)
                const apiUrl = encodeURI(`${API_BASEURL}/mahasiswa`)
                const page = await browser.newPage()
                
                await page.goto(apiUrl)
                await page.evaluate(search, args)
                await page.waitForNavigation()

                if (offset > 1)
                    await page.goto(`${apiUrl}/search/${offset}`)
                
                const urls = await page.evaluate(() =>
                    [...document.querySelectorAll('tr.tmiddle')]
                        .map(element => element
                            .children[2].
                            querySelector('a')
                            .href
                        )
                )

                browser.close()
                
                return Promise.all(urls.map(url => scrape(url)))
                    .then(result => result)
            } catch (reason) {
                console.log(reason)
                return []
            }
        },

        getMahasiswa: async (_, args) => {
            const browser = await puppeteer()
            try {
                const page = await browser.newPage()
                await page.goto(encodeURI(`${API_BASEURL}/mahasiswa`))
                await page.evaluate(search, args)
                await page.waitForNavigation()

                return scrape(await page.evaluate(() =>
                    document
                        .querySelector('tr.tmiddle')
                        .children[2].
                        querySelector('a')
                        .href
                )).then(result => result)
            } catch (reason) {
                console.log(reason)
                return {}
            } finally {
                browser.close()
            }
        }
    }
}

exports.typeDef = typeDef
exports.resolvers = resolvers