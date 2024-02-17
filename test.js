const test = require('brittle')
const cedears = require('./index.js')

test('list', async function (t) {
  t.is(Object.keys(cedears).length, 291)

  // Double space fix
  t.alike(cedears.MA, {
    name: 'Mastercard Inc.',
    code: 'MA',
    market: 'NYSE',
    ratio: '33:1',
    multiplier: 33
  })

  // London stock exchange multi-line bug
  t.alike(cedears.SMSN, {
    name: 'Samsung Electronics Co. Ltd.',
    code: 'SMSN',
    market: 'LONDON STOCK EXCHANGE',
    ratio: '14:1',
    multiplier: 14
  })
})

test('markets', async function (t) {
  const markets = new Set()

  for (const code in cedears) {
    const cedear = cedears[code]
    markets.add(cedear.market)
  }

  t.alike(markets, new Set([
    null,
    'NYSE',
    'XETRA',
    'NASDAQ',
    'NASDAQ GS',
    'NYSE Arca',
    'FRANKFURT',
    'NYSE American',
    'NASDAQ GM',
    'OTC US',
    'OTC',
    'LONDON STOCK EXCHANGE',
    'BOVESPA'
  ]))
})

test('regular split', async function (t) {
  const cedear = cedears.SHOP

  t.alike(cedear, {
    name: 'Shopify Inc.',
    code: 'SHOP',
    market: 'NYSE',
    ratio: '107:1',
    multiplier: 107
  })

  const cedearPriceARS = 827
  const stockPriceUSD = 81.87

  const stockPriceARS = cedearPriceARS * cedear.multiplier
  const stockDollarRate = stockPriceARS / stockPriceUSD // CCL

  t.is(stockPriceARS, 88489)
  t.is(stockDollarRate, 1080.8476853548307)
})

test('reverse split', async function (t) {
  const cedear = cedears.SAN

  t.alike(cedear, {
    name: 'Banco Santander S.A',
    code: 'SAN',
    market: 'NYSE',
    ratio: '1:4',
    multiplier: 0.25
  })

  const cedearPriceARS = 17826
  const stockPriceUSD = 3.93

  const stockPriceARS = cedearPriceARS * cedear.multiplier
  const stockDollarRate = stockPriceARS / stockPriceUSD // CCL

  t.is(stockPriceARS, 4456.5)
  t.is(stockDollarRate, 1133.969465648855)
})
