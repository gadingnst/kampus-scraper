const { gql } = require('apollo-server-express')
const { load } = require('cheerio')
const { get } = require('axios').default
const puppeteer = require('../config/puppeteer')
const { getOffset } = require('../utils/helpers')
const { API_BASEURL } = require('../config')

const typeDef = gql`
    type RiwayatPendidikan {
        no: Int
        perguruan_tinggi: String
        gelar: String
        tanggal_ijazah: String
        jenjang: String
    }

    type RiwayatMengajar {
        no: Int
        semester: String
        kode_matkul: String
        matkul: String
        kode_kelas: String
        perguruan_tinggi: String
    }

    type Penelitian {
        no: Int
        judul: String
        bidang: String
        lembaga: String
        tahun: String
    }

    type Dosen {
        nama: String
        pic_url: String
        kampus: String
        prodi: String
        gender: String
        jabatan_fungsional: String
        pendidikan_tertinggi: String
        status_ikatan_kerja: String
        status_aktifitas: String
        riwayat_pendidikan: [RiwayatPendidikan]
        riwayat_mengajar: [RiwayatMengajar]
        penelitian: [Penelitian]
    }
    
    extend type Query {
        getDosen(kampusID: ID, keyword: String): Dosen
        getListDosen(page: Int, kampusID: ID, keyword: String): [Dosen]
    }
`

const search = ({ kampusID = '', keyword = '' }) => {
    const inputKampus = document.getElementById('id_sp')
    const inputKeyword = document.getElementsByName('keyword')[0]
    const secureCode = document.getElementById('kode_pengaman')
    const captcha1 = document.getElementsByName('captcha_value_1')[0].value
    const captcha2 = document.getElementsByName('captcha_value_2')[0].value
    inputKampus.setAttribute('value', kampusID)
    inputKeyword.setAttribute('value', keyword)
    secureCode.setAttribute('value', parseInt(captcha1) + parseInt(captcha2))
    document.getElementById('searchDosenForm').submit()
}

const scrape = hashUrl => get(encodeURI(hashUrl))
    .then(({ data: html }) => {
        const $ = load(html)
        const detail = $('div.span10 table > tbody')
            .children()
            .toArray()
            .reduce((acc, cur, idx) => {
                const dataElement = $(cur).children().eq(2)
                if (dataElement) {
                    const data = dataElement.text().trim()
                    switch(idx) {
                        case 0: acc.nama = data || null
                        case 1: acc.kampus = data || null
                        case 3: acc.prodi = data || null
                        case 4: acc.gender = data || null
                        case 5: acc.jabatan_fungsional = data || null
                        case 6: acc.pendidikan_tertinggi = data || null
                        case 8: acc.status_ikatan_kerja = data || null
                        case 9: acc.status_aktifitas = data || null
                    }
                }
                return acc
            }, {})
        detail.pic_url = $('div.span2 img').attr('src')
        detail.riwayat_pendidikan = $('#riwayatpendidikan .tmiddle')
            .toArray()
            .map(data => ({
                no: $(data).children().eq(0).text().trim(),
                perguruan_tinggi: $(data).children().eq(1).text().trim(),
                gelar: $(data).children().eq(2).text().trim(),
                tanggal_ijazah: $(data).children().eq(3).text().trim() || 0,
                jenjang: $(data).children().eq(4).text().trim() || 0
            }))
        detail.riwayat_mengajar = $('#riwayatmengajar .tmiddle')
            .toArray()
            .map(data => ({
                no: $(data).children().eq(0).text().trim(),
                semester: $(data).children().eq(1).text().trim(),
                kode_matkul: $(data).children().eq(2).text().trim(),
                matkul: $(data).children().eq(3).text().trim() || 0,
                kode_kelas: $(data).children().eq(4).text().trim() || 0,
                perguruan_tinggi: $(data).children().eq(5).text().trim() || 0
            }))
        detail.penelitian = $('#penelitian .tmiddle')
            .toArray()
            .map(data => ({
                no: $(data).children().eq(0).text().trim(),
                judul: $(data).children().eq(1).text().trim(),
                bidang: $(data).children().eq(2).text().trim(),
                lembaga: $(data).children().eq(3).text().trim() || 0,
                tahun: $(data).children().eq(4).text().trim() || 0
            }))
        
        return detail
    })

const resolvers = {
    Query: {
        getListDosen: async (_, args) => {
            const browser = await puppeteer()
            try {
                const offset = getOffset(args.page)
                const url = encodeURI(`${API_BASEURL}/dosen`)
                const page = await browser.newPage()
                
                await page.goto(url)
                await page.evaluate(search, args)
                await page.waitForNavigation()

                if (offset > 1)
                    await page.goto(`${url}/search/${offset}`)
                
                const urls = await page.evaluate(() =>
                    [...document.querySelectorAll('tr.tmiddle')]
                        .map(element => element
                            .children[1].
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

        getDosen: async (_, args) => {
            const browser = await puppeteer()
            try {
                const page = await browser.newPage()
                await page.goto(encodeURI(`${API_BASEURL}/dosen`))
                await page.evaluate(search, args)
                await page.waitForNavigation()

                return scrape(await page.evaluate(() =>
                    document
                        .querySelector('tr.tmiddle')
                        .children[1].
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

exports.search = search
exports.scrape = scrape
exports.typeDef = typeDef
exports.resolvers = resolvers