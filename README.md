# TMS-Service

The TMS service is a NodeJs REST-API service that ingests a FRM transaction and validates if it has the correct format.

## Installation

```sh
npm install
```

## Build

```sh
npm run build # *.ts Also, triggers prebuild script
```

## Server Start

```sh
npm run start # Start the server
```

## Client Health Test

```sh
curl --location --request GET 'localhost:3000/'
curl --location --request GET 'localhost:3000/health'
```

```json
// Response
{ "service": "Service-Name", "status": "UP" }
```
