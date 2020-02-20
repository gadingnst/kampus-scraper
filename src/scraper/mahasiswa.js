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
    const startTimer = new Date()

    let dataCount = 0, flagPage = 0
    const url = encodeURI(`${API_BASEURL}/mahasiswa`)
    const browser = await puppeteer()
    const page = await browser.newPage()
    
    try {
        console.log('> Connecting google spreadsheet..')
        const doc = new GoogleSpreadsheet('1Lg4X4ODzFQUb8e1pV0tW2ONfpRoK_pdr_lMmd2nhUHo')
        await doc.useServiceAccountAuth(creds)
        await doc.loadInfo()
        console.log('> Done!\n')
        
        console.log('> Creating new sheet..')
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
        console.log('> Done!\n')

        console.log('> Evaluating RISTEKDIKTI Website..')
        await page.goto(url)
        await page.evaluate(search, {
            kampusID,
            prodiID: '',
            keyword: ''
        })

        await page.waitForNavigation()
        console.log('> Done!\n')

        for (let i = start; i <= pageEnd; i++) {
            flagPage = i
            console.log('> Fetching data on page:', i)
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

            const result = (await Promise.allSettled(hashUrls.map(url => doScrape(url)))
                .then(data => data.filter(res => res.status === 'fulfilled')))
                .map(data => data.value)
            console.log('> Done!\n')

            console.log(`> Writing "${result.length}" data into spreadsheet...`)
            await sheet.addRows(result)
            console.log('> Done!\n')

            dataCount += result.length
        }
    } catch (reason) {
        console.error(reason)
    } finally {
        console.log(`END> Stopped in page: ${flagPage}.`)
        console.log(`END> Done writing ${dataCount} data into spreadsheet!`)
        console.log(`END> Program exited with ${(new Date() - startTimer) / 1000} sec...`)
        browser.close()
    }
}

if (kampusID && start && pageEnd) {
    main()
} else {
    throw 'You must pass argument kampusID - end - start'
}