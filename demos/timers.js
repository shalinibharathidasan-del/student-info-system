// Timer module: setTimeout, setInterval, setImmediate and promise-based timers
const { setTimeout: sleep } = require('timers/promises')

function run() {
  return new Promise((resolve) => {
    // Synchronous code runs first, then nextTick/promise callbacks, then timers
    console.log('synchronous code')
    setTimeout(() => console.log('setTimeout(0)'), 0)
    setImmediate(() => console.log('setImmediate'))
    process.nextTick(() => console.log('process.nextTick (runs before any timer)'))
    Promise.resolve().then(() => console.log('promise callback (runs before any timer)'))

    let count = 0
    const interval = setInterval(async () => {
      count++
      console.log(`setInterval tick ${count}`)
      if (count === 3) {
        clearInterval(interval)
        console.log('clearInterval stopped the interval')
        await sleep(200)
        console.log('timers/promises sleep(200) done')
        const t = setTimeout(() => console.log('never printed'), 1000)
        clearTimeout(t)
        console.log('clearTimeout cancelled a timer')
        resolve()
      }
    }, 100)
  })
}

module.exports = run
if (require.main === module) run()
