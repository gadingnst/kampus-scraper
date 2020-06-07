# Kampus Scraper

## Table of contents
- [Kampus Scraper](#kampus-scraper)
  - [Table of contents](#table-of-contents)
  - [Intro](#intro)
  - [Disclaimer](#disclaimer)
  - [Live Demo](#live-demo)
  - [TODO Task](#todo-task)
  - [Instalasi](#instalasi)
  - [Notes](#notes)
  - [Contoh Cara Mengkueri](#contoh-cara-mengkueri)
    - [GET List Kampus](#get-list-kampus)
    - [GET List Prodi](#get-list-prodi)
    - [GET Detail Mahasiswa](#get-detail-mahasiswa)
  - [Support Me](#support-me)
    - [Global](#global)
    - [Indonesia](#indonesia)

## Intro
Ini adalah Web API dengan teknologi GraphQL untuk menampilkan data kampus yang ada diseluruh Indonesia. Dibuat dengan menggunakan `puppeteer` untuk scraping data dari website [Kementrian RISTEKDIKTI](https://forlap.ristekdikti.go.id/).

## Disclaimer
Semua hasil data yang ditampilkan berasal dari website KEMENRISTEKDIKTI (Kementerian Riset, Teknologi Dan Pendidikan Tinggi). Tidak menambah, mengubah ataupun menghapus data tanpa ada izin dari pemilik data. Sebaiknya, data ini hanya digunakan untuk keperluan tugas akhir, skripsi, kontribusi di kampus, dan sebagainya. Kami harap data ini tidak digunakan untuk keperluan komersil, jika masih saja menggunakannya untuk komersil, itu diluar tanggung jawab kami.

## [Live Demo](http://kampus.sutanlab.id/graphql)

## TODO Task
- [x] GET List Kampus berdasarkan keyword
- [x] GET List Prodi berdasarkan ID Kampus
- [x] GET Data Mahasiswa berdasarkan kampus, prodi dan keyword (nama/nim) 
- [ ] GET Data Dosen berdasarkan kampus, prodi dan keyword (nama/nip/nidn)
- [x] GET List Mahasiswa berdasarkan kampus, prodi dan keyword (nama/nim)
- [ ] GET List Dosen berdasarkan kampus, prodi dan keyword (nama/nip/nidn)
- [ ] Requestan kamu?

## Instalasi
1. Fork dan clone repository ini ke komputer kamu.
2. Jalankankan `yarn install` atau `npm install` untuk menginstall semua depedensi yang dibutuhkan.
3. Buat credentials untuk gsheet di `GCP Console`. lebih lengkapnya, baca [disini](https://docs.wso2.com/display/IntegrationCloud/Get+Credentials+for+Google+Spreadsheet)
4. Copy file `api-secret.example.json` dengan nama `api-secret.json`.
5. Buat 1 file dokumen google spreadsheet, kemudian kasih akses penuh untuk `client_email` yang didapatkan dari credentials tadi.
6. Copy credentials yang sudah dibuat tadi kedalam `api-secret.json`, untuk key `spreadsheet_id` bisa ditambahkan sendiri dibawahnya berdasarkan id spreadsheet yang dibawah tadi, contoh pada file `api-secret.json`:
```
{
  "type": "service_account",
  "project_id": "xxxx",
  "private_key_id": "xxxxx",
  ....
  "spreadsheet_id": "xxxxx"
}
```
7. Ketikkan command `yarn start` atau `npm start` untuk menjalankan server. Untuk `start:dev` untuk running dalam mode development, hal ini jika ingin melihat browsernya beraksi secara UI, karena kalau hanya command `start` yang dijalankan adalah browser `headless` tanpa UI.

## Notes
- Untuk OS ubuntu, jika `puppeteer`-nya tidak jalan atau error, bisa coba install ini terlebih dahulu. `sudo apt install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0`
- Jalankan perintah `node src/scraper/mahasiswa.js {kampusID} {batas_halaman} {start_halaman}` untuk memulai collecting data dari target kampus. Example (untuk scrape data mahasiswa di kampus POLSRI hanya dari page 1 - 15): `node src/scraper/mahasiswa.js 52FE65F2-627D-425B-99C3-3A0DC740C134 15 1`.
- Parameter `kampusID` bisa didapatkan dari request `getListKampus(keyword)` terlebih dahulu dari server GraphQL yang sudah dijalankan, contohnya bisa dilihat dibagian `Cara Mengkueri`.
- Jika mau lihat contoh spreadsheet yang saya buat (sudah collect ratusan ribu mahasiswa UNSRI & POLSRI), bisa lihat link disini: [https://docs.google.com/spreadsheets/d/1Lg4X4ODzFQUb8e1pV0tW2ONfpRoK_pdr_lMmd2nhUHo](https://docs.google.com/spreadsheets/d/1Lg4X4ODzFQUb8e1pV0tW2ONfpRoK_pdr_lMmd2nhUHo)

## Contoh Cara Mengkueri
### GET List Kampus
[![List Kampus](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getListKampus.png)](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getListKampus.png)

### GET List Prodi
[![List Prodi](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getListProdi.png)](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getListProdi.png)

### GET Detail Mahasiswa
[![Detail Mahasiswa](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getMahasiswa.png)](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getMahasiswa.png)

## Support Me
### Global
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B71P7PB)
### Indonesia
- [Trakteer](https://trakteer.id/sutanlab)
- [Karyakarsa](https://karyakarsa.com/sutanlab)

---

Best Regards,
Sutan Gading Fadhillah Nasution.
