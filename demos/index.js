// Demo runner. Uses command-line arguments to pick which demos to run:
//   node demos            -> list demos
//   node demos all        -> run every demo
//   node demos os crypto  -> run selected demos
const DEMOS = {
  console: 'Console',
  os: 'OS module',
  timers: 'Timer module',
  errors: 'Error handling',
  dns: 'DNS',
  crypto: 'Crypto',
  tls: 'TLS/SSL concepts',
  process: 'Process and Child Process',
  buffer: 'Buffers',
  streams: 'Streams',
  fs: 'File System',
  stringDecoder: 'String Decoder',
  querystring: 'Query String',
  assert: 'Assertion',
  events: 'Callbacks and Events',
  debugger: 'Debugger',
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: node demos <name...> | all\n')
    for (const [name, title] of Object.entries(DEMOS)) console.log(`  ${name.padEnd(14)} ${title}`)
    console.log('\n  npm run repl   REPL with the student store loaded')
    return
  }

  const names = args[0] === 'all' ? Object.keys(DEMOS) : args
  for (const name of names) {
    if (!DEMOS[name]) {
      console.error(`Unknown demo "${name}". Run "node demos" to see the list.`)
      process.exitCode = 1
      continue
    }
    console.log(`\n========== ${DEMOS[name]} (${name}) ==========`)
    await require(`./${name}.js`)()
  }
}

main()
