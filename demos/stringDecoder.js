// String Decoder: safely turn Buffer chunks into text, even when a character is split across chunks
const { StringDecoder } = require('string_decoder')

async function run() {
  const text = Buffer.from('₹500 fee') // the rupee sign is 3 bytes: e2 82 b9
  const part1 = text.subarray(0, 2) // first 2 bytes of the rupee sign
  const part2 = text.subarray(2) // its last byte + the rest

  console.log('Bytes                       :', text)
  console.log('Wrong (toString each chunk) :', part1.toString() + part2.toString())

  const decoder = new StringDecoder('utf8')
  const result = decoder.write(part1) + decoder.write(part2) + decoder.end()
  console.log('Right (StringDecoder)       :', result)
}

module.exports = run
if (require.main === module) run()
