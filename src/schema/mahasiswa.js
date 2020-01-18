const { gql } = require('apollo-server-express')
const puppeteer = require('../config/puppeteer')
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
        getMahasiswa(kampusID: ID!, prodiID: ID!, keyword: String!): Mahasiswa
        getListMahasiswa(kampusID: ID!, prodiID: ID!, keyword: String!): [Mahasiswa]
    }
`

const resolvers = {
    Query: {
        // todo
        getListMahasiswa: (_, args) => [],

        getMahasiswa: (_, args) =>
            puppeteer()
                .then(browser => browser
                    .newPage()
                    .then(async page => {
                        await page.goto(encodeURI(`${API_BASEURL}/mahasiswa`))
                        await page.evaluate(({ kampusID, prodiID, keyword }) => {
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
                        }, args)
                        
                        await (await page.$('#searchMhsForm')).evaluate(form => form.submit())
                        await page.waitForNavigation()
                        
                        await page.goto(await page.evaluate(() =>
                            document
                                .querySelector('tr.tmiddle')
                                .children[2].
                                querySelector('a')
                                .href
                        ))
                        
                        const result = await page.evaluate(() => {
                            const detail = [...document.querySelector('div.main table > tbody').children]
                                .reduce((acc, cur, idx) => {
                                    if (cur.children[2]) {
                                        const data = cur.children[2].textContent.trim()
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

                            detail.sks = [...document.querySelectorAll('#kuliahmhs .tmiddle')]
                                .map(data => ({
                                    no: data.children[0].textContent.trim(),
                                    semester: data.children[1].textContent.trim(),
                                    status: data.children[2].textContent.trim(),
                                    jumlah: data.children[3].textContent.trim() || 0
                                }))
                            
                            return detail
                        })

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