# like-cedears

Description

```
npm i like-cedears
```

## Usage

```js
const cedears = require('like-cedears')

const total = Object.keys(cedears).length
console.log(total) // => 291

// Regular split
console.log(cedears.SHOP) /* => {
  name: 'Shopify Inc.',
  code: 'SHOP',
  market: 'NYSE',
  ratio: '107:1',
  multiplier: 107
} */

// Reverse split
console.log(cedears.SAN) /* => {
  name: 'Banco Santander S.A',
  code: 'SAN',
  market: 'NYSE',
  ratio: '1:4',
  multiplier: 0.25
} */
```

## License

MIT
