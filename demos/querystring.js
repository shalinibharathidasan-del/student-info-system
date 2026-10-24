// Query String: parse and build URL query strings (server.js also uses it to parse form posts)
const querystring = require('querystring')

async function run() {
  const parsed = querystring.parse('name=Ananya%20Rao&usn=1DS24MC001&course=MCA&skills=node&skills=react')
  console.log('parse     :', parsed)

  const built = querystring.stringify({ search: 'rao', semester: 3, msg: 'Added Ananya & Rahul' })
  console.log('stringify :', built)

  console.log('escape    :', querystring.escape('a b&c'))
  console.log('unescape  :', querystring.unescape('a%20b%26c'))

  // Modern alternative: URLSearchParams
  const params = new URLSearchParams('search=rao&page=2')
  console.log('URLSearchParams get("search"):', params.get('search'))
}

module.exports = run
if (require.main === module) run()
