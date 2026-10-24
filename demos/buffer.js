// Buffers: working with raw binary data
async function run() {
  const buf = Buffer.from('Student: Ananya', 'utf8')
  console.log('Buffer         :', buf)
  console.log('Length (bytes) :', buf.length)
  console.log('toString       :', buf.toString())
  console.log('hex            :', buf.toString('hex'))
  console.log('base64         :', buf.toString('base64'))
  console.log('from base64    :', Buffer.from(buf.toString('base64'), 'base64').toString())

  const alloc = Buffer.alloc(5)
  alloc.write('MCA')
  console.log('alloc(5)+write :', alloc)

  const joined = Buffer.concat([Buffer.from('1DS24'), Buffer.from('MC001')])
  console.log('concat         :', joined.toString())
  console.log('subarray(0, 5) :', joined.subarray(0, 5).toString())
  console.log('equals         :', Buffer.from('a').equals(Buffer.from('a')))

  // Some characters take more than one byte
  const rupee = '₹500'
  console.log(`"${rupee}" characters vs bytes:`, rupee.length, 'vs', Buffer.byteLength(rupee))
}

module.exports = run
if (require.main === module) run()
