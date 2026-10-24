// Simple logger: prints to the console and appends to logs/app.log using a write stream
const fs = require('fs')
const path = require('path')

const logDir = path.join(__dirname, '..', 'logs')
fs.mkdirSync(logDir, { recursive: true })
const stream = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' })

function write(level, message) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
  stream.write(line + '\n')
}

module.exports = {
  info: (msg) => write('info', msg),
  warn: (msg) => write('warn', msg),
  error: (msg) => write('error', msg),
}
