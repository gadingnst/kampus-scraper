# Kampus API

## Table of contents
- [Kampus API](#kampus-api)
  - [Table of contents](#table-of-contents)
  - [Intro](#intro)
  - [Disclaimer](#disclaimer)
  - [Live Demo](#live-demo)
  - [TODO Task](#todo-task)
  - [Contoh Cara Mengkueri](#contoh-cara-mengkueri)
    - [GET List Kampus](#get-list-kampus)
    - [GET List Prodi](#get-list-prodi)
    - [GET Detail Mahasiswa](#get-detail-mahasiswa)

## Intro
Ini adalah Web API dengan teknologi GraphQL untuk menampilkan data kampus yang ada diseluruh Indonesia. Dibuat dengan menggunakan `puppeteer` untuk scraping data dari website [Kementrian RISTEKDIKTI](https://forlap.ristekdikti.go.id/), dan di deploy pada provider serverless [Zeit](https://zeit.co).

## Disclaimer
Semua data yang ditampilkan berasal dari hasil scrape website KEMENRISTEKDIKTI (Kementerian Riset, Teknologi Dan Pendidikan Tinggi). Kami tidak menambah, mengubah ataupun menghapus data tanpa ada izin dari KEMENRISTEKDIKTI.

## [Live Demo](https://kampus-api.sutanlab.id/graphql)

## TODO Task
- [x] GET List Kampus berdasarkan keyword
- [x] GET List Prodi berdasarkan ID Kampus
- [x] GET Data Mahasiswa berdasarkan kampus, prodi dan keyword (nama/nim) 
- [ ] GET Data Dosen berdasarkan kampus, prodi dan keyword (nama/nip/nidn)
- [ ] GET List Mahasiswa berdasarkan kampus, prodi dan keyword (nama/nim)
- [ ] GET List Dosen berdasarkan kampus, prodi dan keyword (nama/nip/nidn)
- [ ] And maybe more data for next development

## Contoh Cara Mengkueri
### GET List Kampus
[![List Kampus](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getListKampus.png)](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getListKampus.png)

### GET List Prodi
[![List Prodi](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getListProdi.png)](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getListProdi.png)

### GET Detail Mahasiswa
[![Detail Mahasiswa](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getMahasiswa.png)](https://raw.githubusercontent.com/sutanlab/kampus-api/master/capture/getMahasiswa.png)

---

Best Regards,
Sutan Gading Fadhillah Nasution.
