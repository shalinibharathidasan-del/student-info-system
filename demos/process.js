// Process and Child Process: info about the running Node process, and running other programs
const { exec, execFile, spawn, fork } = require('child_process')
const path = require('path')

async function run() {
  // --- process ---
  console.log('PID            :', process.pid)
  console.log('Node version   :', process.version)
  console.log('Platform       :', process.platform)
  console.log('Working dir    :', process.cwd())
  console.log('Arguments      :', process.argv.slice(2))
  console.log('Memory (heap)  :', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1), 'MB')
  console.log('ENV NODE_ENV   :', process.env.NODE_ENV || '(not set)')
  process.once('exit', (code) => console.log(`process 'exit' event, code ${code}`))

  // exec: run a shell command
  await new Promise((resolve) =>
    exec('node -v', (err, stdout) => {
      console.log('\nexec("node -v")       ->', err ? err.message : stdout.trim())
      resolve()
    }),
  )

  // execFile: run a program directly (no shell)
  await new Promise((resolve) =>
    execFile(process.execPath, ['-e', 'console.log(2 + 3)'], (err, stdout) => {
      console.log('execFile(node, 2 + 3) ->', stdout.trim())
      resolve()
    }),
  )

  // spawn: stream output from a child process
  await new Promise((resolve) => {
    const child = spawn(process.execPath, ['-e', 'for (const s of ["A", "B", "C"]) console.log("student " + s)'])
    child.stdout.on('data', (data) => process.stdout.write('spawn output: ' + data))
    child.on('close', (code) => {
      console.log('spawn exited with code', code)
      resolve()
    })
  })

  // fork: another Node script, with messages both ways
  await new Promise((resolve) => {
    const worker = fork(path.join(__dirname, 'worker.js'))
    worker.send({ marks: [88, 74, 92, 65] })
    worker.on('message', (msg) => {
      console.log('fork: worker replied with average =', msg.average)
      worker.kill()
      resolve()
    })
  })
}

module.exports = run
if (require.main === module) run()
