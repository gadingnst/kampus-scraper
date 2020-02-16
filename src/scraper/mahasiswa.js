const { GoogleSpreadsheet } = require('google-spreadsheet')
const { getOffset } = require('../utils/helpers')
const { API_BASEURL } = require('../config')
const { search, scrape } = require('../schema/mahasiswa')
const puppeteer = require('../config/puppeteer')
const creds = require('../../api-secret.json')

async function main() {
    console.log('Doing scrape data mahasiswa....')
    const doc = new GoogleSpreadsheet('1Lg4X4ODzFQUb8e1pV0tW2ONfpRoK_pdr_lMmd2nhUHo')
    try {
        await doc.useServiceAccountAuth(creds)
        await doc.loadInfo()

        const sheet = doc.sheetsByIndex[0]
        const url = encodeURI(`${API_BASEURL}/mahasiswa`)
        const browser = await puppeteer()
        const page = await browser.newPage()
        
        await page.goto(url)
        await page.evaluate(search, {
            kampusID: '52FE65F2-627D-425B-99C3-3A0DC740C134',
            prodiID: '',
            keyword: ''
        })

        await page.waitForNavigation()

        for (let i = 1; i < 2; i++) {
            const offset = getOffset(i)

            if (offset > 1)
                await page.goto(`${url}/search/${offset}`)
        
            const hashUrls = await page.evaluate(() =>
                [...document.querySelectorAll('tr.tmiddle')]
                    .map(element => element
                        .children[2].
                        querySelector('a')
                        .href
                    )
            )

            hashUrls.forEach(async hashUrl => {
                const doScrape = () => scrape(hashUrl)
                    .then(data => {
                        console.log(`Writing ${data.nama} to spreadsheet..`)
                        return sheet.addRow({
                            jenisKelamin: data.gender,
                            jurusan: data.prodi,
                            ...data
                        })
                    })
                    .then(() => {
                        console.log('Done writing data')
                    })
                    .catch(err => {
                        console.log(`An error occured doing scrape "${hashUrl}":`, err)
                    })
                    .finally(() => console.log)

                await doScrape()
            })
        }
    } catch (reason) {
        console.error(reason)
    }
}

main()