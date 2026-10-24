// Callbacks and Events
const EventEmitter = require('events')
const fs = require('fs')

// A function that takes an error-first callback
function findStudent(usn, callback) {
  const students = { '1DS24MC001': 'Ananya Rao', '1DS24MC002': 'Rahul Kumar' }
  setTimeout(() => {
    if (students[usn]) callback(null, students[usn])
    else callback(new Error(`No student with USN ${usn}`))
  }, 100)
}

function run() {
  return new Promise((resolve) => {
    // --- Callbacks ---
    findStudent('1DS24MC001', (err, name) => {
      console.log('callback result:', err ? err.message : name)

      findStudent('XXX', (err2) => {
        console.log('callback error :', err2.message)

        // Built-in modules use callbacks too
        fs.readdir(__dirname, (err3, files) => {
          console.log('fs.readdir callback found', files.length, 'files in demos/')

          // --- Events ---
          class Classroom extends EventEmitter {}
          const room = new Classroom()

          room.on('join', (student) => console.log(`event 'join'  : ${student} joined`))
          room.once('first', () => console.log("event 'first' : runs only once"))
          room.on('leave', (student) => console.log(`event 'leave' : ${student} left`))

          room.emit('first')
          room.emit('first') // ignored: the listener was added with once()
          room.emit('join', 'Ananya')
          room.emit('join', 'Rahul')
          room.emit('leave', 'Rahul')
          console.log("listeners for 'join':", room.listenerCount('join'))
          resolve()
        })
      })
    })
  })
}

module.exports = run
if (require.main === module) run()
