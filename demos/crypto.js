// Crypto module: hashing, password hashing, random IDs and encryption
const crypto = require('crypto')

async function run() {
  // Hash (one-way)
  const hash = crypto.createHash('sha256').update('1DS24MC001').digest('hex')
  console.log('SHA-256 of USN :', hash)

  // HMAC (hash with a secret key)
  const hmac = crypto.createHmac('sha256', 'secret-key').update('student-data').digest('hex')
  console.log('HMAC           :', hmac)

  // Password hashing with salt (scrypt)
  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = crypto.scryptSync('myPassword123', salt, 32).toString('hex')
  console.log('Password hash  :', passwordHash.slice(0, 32) + '...')
  const check = crypto.scryptSync('myPassword123', salt, 32).toString('hex') === passwordHash
  console.log('Password valid :', check)

  // Random values
  console.log('randomUUID     :', crypto.randomUUID())
  console.log('randomInt      :', crypto.randomInt(1000, 9999))

  // Symmetric encryption (AES-256-CBC)
  const key = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  const encrypted = cipher.update('Ananya Rao, marks 88', 'utf8', 'hex') + cipher.final('hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
  console.log('Encrypted      :', encrypted)
  console.log('Decrypted      :', decrypted)
}

module.exports = run
if (require.main === module) run()
