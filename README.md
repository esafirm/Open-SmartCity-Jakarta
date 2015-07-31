## API for data like smartcity.jakarta.go.id

### Setup

Configure your Heroku https://dashboard.heroku.com

Run **npm install** to get all required libraries.

	npm install

### Base URL

	API base URI is at /api/

#### example:

	https://openjakarta.herokuapp.com/api/haltebus

### Paging

simply put `offset` and `limit` parameter on your request

#### example:

	https://openjakarta.herokuapp.com/api/haltebus?limit=5&offset=5

### Demo

you can try the demo of this api https://openjakarta.herokuapp.com

---

### Endpoint

#### Informasi Pendukung:

- haltebus
- kepolisian
- rumahsakit
- sekolah
- lokasitransportasi
- tempatibadah

#### Pariwisata & Kebudayaan

- pariwisata/lokasikuliner
- pariwisata/lokasiwisata
- pariwisata/lokasipatung
- pariwisata/lokasibelanja
- pariwisata/lokasimuseum

---
