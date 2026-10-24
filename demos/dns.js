// DNS module: look up IP addresses for domain names
const dns = require('dns')

async function run() {
  // Callback style (uses the OS resolver)
  await new Promise((resolve) => {
    dns.lookup('localhost', (err, address, family) => {
      if (err) console.log('lookup error:', err.code)
      else console.log(`dns.lookup('localhost') -> ${address} (IPv${family})`)
      resolve()
    })
  })

  // Promise style (needs internet)
  try {
    const addresses = await dns.promises.resolve4('nodejs.org')
    console.log("dns.promises.resolve4('nodejs.org') ->", addresses)
    const mx = await dns.promises.resolveMx('gmail.com')
    console.log("resolveMx('gmail.com') ->", mx.slice(0, 2))
  } catch (err) {
    console.log('DNS lookup failed (are you offline?):', err.code)
  }
}

module.exports = run
if (require.main === module) run()
