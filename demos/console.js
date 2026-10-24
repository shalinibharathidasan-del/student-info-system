// Console module: different ways to print output
async function run() {
  const students = [
    { usn: '1DS24MC001', name: 'Ananya', marks: 88 },
    { usn: '1DS24MC002', name: 'Rahul', marks: 74 },
  ]
  console.log('console.log  -> normal output')
  console.info('console.info -> information')
  console.warn('console.warn -> warning (stderr)')
  console.error('console.error -> error (stderr)')
  console.table(students)
  console.group('Student group')
  console.log('Indented inside group')
  console.groupEnd()
  console.time('loop')
  for (let i = 0; i < 1e6; i++);
  console.timeEnd('loop')
  console.count('visits')
  console.count('visits')
  console.assert(students.length === 2, 'This is not printed because the assertion passes')
}

module.exports = run
if (require.main === module) run()
