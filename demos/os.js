// OS module: information about the computer the app is running on
const os = require('os')

async function run() {
  console.log('Platform     :', os.platform(), os.arch())
  console.log('OS           :', os.type(), os.release())
  console.log('Hostname     :', os.hostname())
  console.log('User         :', os.userInfo().username)
  console.log('Home dir     :', os.homedir())
  console.log('Temp dir     :', os.tmpdir())
  console.log('CPU cores    :', os.cpus().length, '-', os.cpus()[0].model)
  console.log('Total memory :', (os.totalmem() / 1024 ** 3).toFixed(2), 'GB')
  console.log('Free memory  :', (os.freemem() / 1024 ** 3).toFixed(2), 'GB')
  console.log('Uptime       :', (os.uptime() / 3600).toFixed(1), 'hours')
  console.log('EOL          :', JSON.stringify(os.EOL))
}

module.exports = run
if (require.main === module) run()
