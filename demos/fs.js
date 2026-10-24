// File System: create, read, update, rename and delete files and folders
const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const os = require('os')

async function run() {
  const dir = path.join(os.tmpdir(), 'sis-fs-demo')
  const file = path.join(dir, 'student.txt')

  await fsp.mkdir(dir, { recursive: true })
  console.log('mkdir      :', dir)

  await fsp.writeFile(file, 'Name: Ananya Rao\n')
  console.log('writeFile  : created student.txt')

  await fsp.appendFile(file, 'USN: 1DS24MC001\n')
  console.log('appendFile : added a line')

  console.log('readFile   :\n' + (await fsp.readFile(file, 'utf8')))

  const stats = await fsp.stat(file)
  console.log('stat       : size', stats.size, 'bytes, isFile =', stats.isFile())

  const renamed = path.join(dir, 'ananya.txt')
  await fsp.rename(file, renamed)
  console.log('rename     :', path.basename(file), '->', path.basename(renamed))

  console.log('readdir    :', await fsp.readdir(dir))

  // Synchronous and callback versions also exist
  console.log('existsSync :', fs.existsSync(renamed))
  await new Promise((resolve) =>
    fs.readFile(renamed, 'utf8', (err, data) => {
      console.log('callback readFile, first line:', err ? err.message : data.split('\n')[0])
      resolve()
    }),
  )

  await fsp.rm(dir, { recursive: true })
  console.log('rm         : cleaned up, exists =', fs.existsSync(dir))
}

module.exports = run
if (require.main === module) run()
