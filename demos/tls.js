// TLS/SSL concepts: connect to a secure server and inspect its certificate.
//
// TLS (formerly SSL) encrypts data between client and server:
//   1. Client says hello and lists the ciphers it supports
//   2. Server sends its certificate (public key + identity, signed by a Certificate Authority)
//   3. Client verifies the certificate and both sides agree a shared session key
//   4. All further data is encrypted with that key (this is what HTTPS uses)
// To run an HTTPS server yourself you need a private key + certificate:
//   https.createServer({ key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') }, handler)
const tls = require('tls')

function run() {
  return new Promise((resolve) => {
    const socket = tls.connect({ host: 'nodejs.org', port: 443, servername: 'nodejs.org' }, () => {
      const cert = socket.getPeerCertificate()
      console.log('Connected securely :', socket.authorized)
      console.log('Protocol           :', socket.getProtocol())
      console.log('Cipher             :', socket.getCipher().name)
      console.log('Certificate subject:', cert.subject?.CN)
      console.log('Issued by          :', cert.issuer?.O || cert.issuer?.CN)
      console.log('Valid until        :', cert.valid_to)
      socket.end()
      resolve()
    })
    socket.setTimeout(5000, () => {
      console.log('TLS connection timed out')
      socket.destroy()
      resolve()
    })
    socket.on('error', (err) => {
      console.log('TLS connection failed (are you offline?):', err.code || err.message)
      resolve()
    })
  })
}

module.exports = run
if (require.main === module) run()
