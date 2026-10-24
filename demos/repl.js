// REPL: interactive shell with the student store preloaded
//   npm run repl
//   students> await store.getAll()
//   students> await store.search('rao')
//   students> .count
const repl = require('repl')
const { StudentStore } = require('../lib/studentStore')

const store = new StudentStore()

store.init().then(() => {
  console.log('Student REPL. Try: await store.getAll()  |  .count  |  .help  |  .exit')
  const server = repl.start({ prompt: 'students> ' })
  server.context.store = store

  server.defineCommand('count', {
    help: 'Show the number of students',
    async action() {
      const all = await store.getAll()
      console.log(`${all.length} students`)
      if (!this.closed) this.displayPrompt()
    },
  })
})
