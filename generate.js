const path = require('path')
const fs = require('fs')

// Source https://www.byma.com.ar/download/11222
// It currently redirects to https://www.byma.com.ar/wp-content/uploads/dlm_uploads/2019/09/BYMA-Tabla-CEDEARs-2024-01-25.pdf
// Copy the text from the PDF into a source.txt file, and do manual standarization like with the "LONDON STOCK" + "EXCHANGE", remove double spaces, remove column names, etc

const filename = path.join(__dirname, 'source.txt')
const stocks = fs.readFileSync(filename, 'utf-8')

const PATTERN = /(.*)? ([\w.]+?) (NYSE(?:(?: Arca)|(?: American))?|NASDAQ(?:(?: GS)|(?: GM))?|XETRA|FRANKFURT|OTC(?: US)?|LONDON STOCK EXCHANGE|BOVESPA|-) (\d+:\d+)/ig
const matchAll = stocks.replace(/\s\s+/g, ' ').matchAll(PATTERN)
const cedears = {}

for (const [, name, code, market, ratio] of matchAll) {
  if (cedears[code]) throw new Error('Repeated stock: ' + code)

  const split = ratio.split(':')
  const multiplier = parseInt(split[0], 10) / parseInt(split[1], 10)

  if (Number.isNaN(multiplier)) throw new Error('Invalid ratio: ' + ratio)

  cedears[code] = [name, market === '-' ? null : market, ratio, multiplier]
}

let output = JSON.stringify(cedears)

output = output.replace('{"', '{\n  "')
output = output.split('],"').join('],\n  "')
output = output.replace(']}', ']\n}')

fs.writeFileSync(path.join(__dirname, 'cedears.json'), output)
