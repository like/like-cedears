const path = require('path')
const fs = require('fs')
const https = require('https')
const fetch = require('like-fetch')
const pdf = require('pdf-parse')

// Source https://www.byma.com.ar/download/11222
// It currently redirects to https://www.byma.com.ar/wp-content/uploads/dlm_uploads/2019/09/BYMA-Tabla-CEDEARs-2024-01-25.pdf

main().catch(err => {
  console.error(err)
  process.exit(1)
})

async function main () {
  const agent = new https.Agent({ rejectUnauthorized: false }) // Unsafe but it's a very controlled run-once request
  const response = await fetch('https://www.byma.com.ar/download/11222', { agent })
  const source = await response.buffer()
  const data = await pdf(source, { pagerender })

  const lines = data.text.split('\n').filter(line => line)
  const cedears = {}

  for (const line of lines) {
    const row = JSON.parse(line)

    const split = row[3].split(':')
    const multiplier = parseInt(split[0], 10) / parseInt(split[1], 10)
    if (Number.isNaN(multiplier)) throw new Error('Invalid ratio ' + row[3] + ' for ' + row[1])

    cedears[row[1]] = [row[0], row[2] === '-' ? null : row[2], split[0] + ':' + split[1], multiplier]
  }

  fs.writeFileSync(path.join(__dirname, 'cedears.json'), stringify(cedears))
}

async function pagerender (pageData) {
  const textContent = await pageData.getTextContent()
  const lines = []

  for (let i = 0; i < textContent.items.length; i++) {
    // Main problem with the PDF is that there are texts with slightly different font sizes and multi-line values
    // Find the closest ratio alike value, and reverse lookup the fields
    for (let j = i + 1; j < textContent.items.length; j++) {
      const ratio = textContent.items[j].str.trim()

      if (!ratio.match(/\d+:\d+/)) continue

      let market = textContent.items[--j].str.trim()

      // Multi-line market e.g. 'LONDON STOCK EXCHANGE'
      if (market === 'EXCHANGE') {
        market = textContent.items[--j].str.trim() + ' ' + market
      }

      const code = textContent.items[--j].str.trim()

      let name = textContent.items[--j].str.trim()

      // Multi-line name
      const next = textContent.items[j - 1].str.trim()
      if (!next.match(/\d+:\d+/) && next !== 'Ratio (*)') {
        name = textContent.items[--j].str.trim() + ' ' + name
      }

      lines.push(JSON.stringify([name, code, market, ratio]))

      break
    }
  }

  return lines.join('\n')
}

function stringify (object) {
  let output = JSON.stringify(object)

  output = output.replace('{"', '{\n  "')
  output = output.split('],"').join('],\n  "')
  output = output.replace(']}', ']\n}')

  return output
}
