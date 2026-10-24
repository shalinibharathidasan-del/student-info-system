// Debugger: pause code and inspect variables.
//
// Option 1 - command-line debugger:
//   node inspect demos/debugger.js
//   then type: c (continue), n (next), s (step in), repl (inspect variables), .exit
//
// Option 2 - Chrome DevTools:
//   node --inspect-brk demos/debugger.js
//   open chrome://inspect in Chrome and click "inspect"
//
// Option 3 - VS Code: open this file and press F5.
//
// The `debugger` statement below is a breakpoint. It is ignored when no debugger is attached.

function averageMarks(marks) {
  let total = 0
  for (const m of marks) {
    total += m
  }
  debugger // execution pauses here when a debugger is attached
  return total / marks.length
}

async function run() {
  const avg = averageMarks([88, 74, 92])
  console.log('Average marks:', avg)
  console.log('Run "node inspect demos/debugger.js" to step through this code.')
}

module.exports = run
if (require.main === module) run()
