const raw = require('./cedears.json')
const cedears = {}

for (const code in raw) {
  const row = raw[code]

  cedears[code] = {
    name: row[0],
    code,
    market: row[1],
    ratio: row[2],
    multiplier: row[3]
  }
}

module.exports = cedears
