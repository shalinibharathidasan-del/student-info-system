// Streams: read, transform and write data piece by piece
const fs = require('fs')
const path = require('path')
const os = require('os')
const { Readable, Transform } = require('stream')
const { pipeline } = require('stream/promises')

async function run() {
  const out = path.join(os.tmpdir(), 'students-report.csv')

  // Readable stream from an array of students
  const students = Readable.from([
    { usn: '1DS24MC001', name: 'Ananya Rao', marks: 88 },
    { usn: '1DS24MC002', name: 'Rahul Kumar', marks: 74 },
    { usn: '1DS25MC001', name: 'Sneha Patil', marks: 92 },
  ])

  // Transform stream: student object -> CSV line
  const toCsv = new Transform({
    objectMode: true,
    transform(student, _enc, callback) {
      callback(null, `${student.usn},${student.name},${student.marks}\n`)
    },
  })

  // Writable stream: a file. pipeline() connects the streams and handles errors.
  const file = fs.createWriteStream(out)
  file.write('usn,name,marks\n')
  await pipeline(students, toCsv, file)
  console.log('Wrote CSV with pipeline():', out)

  // Read it back with a readable file stream, chunk by chunk
  await new Promise((resolve, reject) => {
    const reader = fs.createReadStream(out, { encoding: 'utf8', highWaterMark: 16 })
    let chunks = 0
    reader.on('data', () => chunks++)
    reader.on('end', () => {
      console.log(`Read the file back in ${chunks} chunks of up to 16 bytes`)
      resolve()
    })
    reader.on('error', reject)
  })

  // Transform to uppercase and pipe to the console
  const upper = new Transform({
    transform(chunk, _enc, callback) {
      callback(null, chunk.toString().toUpperCase())
    },
  })
  await pipeline(fs.createReadStream(out), upper, process.stdout, { end: false })
}

module.exports = run
if (require.main === module) run()
