// Assertion module: check that values are what we expect (throws if not)
const assert = require('assert')

async function run() {
  const student = { usn: '1DS24MC001', name: 'Ananya', marks: [88, 92] }

  assert.ok(student.name, 'name should exist')
  assert.strictEqual(student.usn.length, 10)
  assert.deepStrictEqual(student.marks, [88, 92])
  assert.notStrictEqual(student.name, 'Rahul')
  assert.throws(() => JSON.parse('{bad'), SyntaxError)
  await assert.rejects(Promise.reject(new Error('fail')), /fail/)
  console.log('All assertions passed')

  try {
    assert.strictEqual(1 + 1, 3, 'Maths is broken')
  } catch (err) {
    console.log('A failed assertion throws', err.name + ':', err.message)
  }
  console.log('See test/store.test.js for assertions used as real tests (npm test).')
}

module.exports = run
if (require.main === module) run()
