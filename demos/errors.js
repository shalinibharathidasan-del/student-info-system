// Error handling: try/catch, custom errors, async errors, callback errors, error events
const fs = require('fs')
const EventEmitter = require('events')
const { ValidationError } = require('../lib/studentStore')

async function run() {
  // 1. try/catch with synchronous code
  try {
    JSON.parse('{ bad json')
  } catch (err) {
    console.log('1. Caught SyntaxError:', err.message)
  }

  // 2. Custom error class
  try {
    throw new ValidationError('USN is required')
  } catch (err) {
    console.log(`2. Caught ${err.name}:`, err.message, '| instanceof Error =', err instanceof Error)
  }

  // 3. async/await errors
  try {
    await fs.promises.readFile('no-such-file.txt')
  } catch (err) {
    console.log('3. Caught async error code:', err.code)
  }

  // 4. Error-first callback
  await new Promise((resolve) => {
    fs.readFile('no-such-file.txt', (err) => {
      if (err) console.log('4. Callback received error:', err.code)
      resolve()
    })
  })

  // 5. 'error' event on an EventEmitter
  const emitter = new EventEmitter()
  emitter.on('error', (err) => console.log('5. Error event handled:', err.message))
  emitter.emit('error', new Error('Something failed'))

  // 6. finally always runs
  try {
    throw new Error('oops')
  } catch {
    console.log('6. catch block')
  } finally {
    console.log('   finally block always runs')
  }

  console.log("Note: process.on('uncaughtException') / ('unhandledRejection') is the last safety net.")
}

module.exports = run
if (require.main === module) run()
