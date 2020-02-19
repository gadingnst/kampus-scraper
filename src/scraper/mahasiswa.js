const { GoogleSpreadsheet } = require('google-spreadsheet')
const { getOffset } = require('../utils/helpers')
const { API_BASEURL } = require('../config')
const { search, scrape } = require('../schema/mahasiswa')
const puppeteer = require('../config/puppeteer')
const creds = require('../../api-secret.json')

const [kampusID, pageEnd, start = 1] = process.argv.slice(2)

const doScrape = url => scrape(url)
    .then(data => ({
        nim: `"${data.nim}"`,
        nama: data.nama || 'Tidak diketahui',
        jenisKelamin: data.gender || 'Tidak diketahui',
        kampus: data.kampus || 'Tidak diketahui',
        jurusan: data.prodi || 'Tidak diketahui',
        angkatan: data.angkatan || 'Tidak diketahui',
        status: data.status || 'Tidak diketahui',
        tanggalLulus: data.kelulusan || 'Tidak diketahui',
        ijazah: data.ijazah || 'Tidak diketahui',
        jumlahSKS: data.sks.length ? data.sks.reduce((acc, { jumlah }) => acc + parseInt(jumlah), 0) : 0
    }))
    .catch(err => {
        console.log(`An error occured doing scrape "${url}":`, err)
    })

async function main() {
    console.log('Doing scrape data mahasiswa....\n')

    let dataCount = 0
    const doc = new GoogleSpreadsheet('1Lg4X4ODzFQUb8e1pV0tW2ONfpRoK_pdr_lMmd2nhUHo')
    const url = encodeURI(`${API_BASEURL}/mahasiswa`)
    const browser = await puppeteer()
    const page = await browser.newPage()
    
    try {
        await doc.useServiceAccountAuth(creds)
        await doc.loadInfo()
        
        const sheet = await doc.addSheet({ headers: [
            'nim',
            'nama',
            'jenisKelamin',
            'kampus',
            'jurusan',
            'angkatan',
            'status',
            'tanggalLulus',
            'ijazah',
            'jumlahSKS'
        ] })

        await page.goto(url)
        await page.evaluate(search, {
            kampusID,
            prodiID: '',
            keyword: ''
        })

        await page.waitForNavigation()

        for (let i = start; i < pageEnd; i++) {
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

            if (hashUrls.length < 1) break

            console.log('Fetching data page:', i)
            const result = (await Promise.allSettled(hashUrls.map(url => doScrape(url)))
                .then(data => data.filter(res => res.status === 'fulfilled')))
                .map(data => data.value)
            console.log('Done!\n')

            console.log(`Writing "${result.length}" data into spreadsheet...`)
            await sheet.addRows(result)
            console.log('Done!\n')

            dataCount =+ result.length
        }
    } catch (reason) {
        console.error(reason)
    } finally {
        console.log(`Done writing ${dataCount} data into spreadsheet!`)
        browser.close()
    }
}

if (kampusID && start && pageEnd) {
    main()
} else {
    throw 'You must pass argument kampusID - end - start'
}