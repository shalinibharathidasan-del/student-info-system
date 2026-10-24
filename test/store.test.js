// Tests for StudentStore using the assert module. Run with: npm test
const assert = require('assert')
const fs = require('fs/promises')
const os = require('os')
const path = require('path')
const { StudentStore, ValidationError, NotFoundError } = require('../lib/studentStore')

const tests = []
const test = (name, fn) => tests.push({ name, fn })

// Each test gets its own temporary data file
async function freshStore() {
  const file = path.join(os.tmpdir(), `students-test-${Date.now()}-${Math.random()}.json`)
  const store = new StudentStore(file)
  await store.init()
  return { store, file }
}

const sample = { usn: '1ds25mc050', name: 'Test Student', email: 'test@example.com', course: 'MCA', semester: '2' }

test('init seeds sample students', async (store) => {
  const all = await store.getAll()
  assert.strictEqual(all.length, 3)
})

test('add stores a student and normalises fields', async (store) => {
  const s = await store.add(sample)
  assert.strictEqual(s.usn, '1DS25MC050')
  assert.strictEqual(s.semester, 2)
  assert.ok(s.id)
  assert.strictEqual((await store.getAll()).length, 4)
})

test('add emits an "added" event', async (store) => {
  let emitted = null
  store.on('added', (s) => (emitted = s))
  await store.add(sample)
  assert.strictEqual(emitted.name, 'Test Student')
})

test('add rejects invalid data', async (store) => {
  await assert.rejects(store.add({ ...sample, name: '' }), ValidationError)
  await assert.rejects(store.add({ ...sample, email: 'not-an-email' }), ValidationError)
  await assert.rejects(store.add({ ...sample, semester: 9 }), ValidationError)
})

test('add rejects duplicate USN', async (store) => {
  await store.add(sample)
  await assert.rejects(store.add({ ...sample, usn: '1DS25MC050' }), /already exists/)
})

test('search matches name, USN and email', async (store) => {
  assert.strictEqual((await store.search('rahul')).length, 1)
  assert.strictEqual((await store.search('1ds24')).length, 2)
  assert.strictEqual((await store.search('sneha@')).length, 1)
  assert.strictEqual((await store.search('nobody')).length, 0)
})

test('update changes a student', async (store) => {
  const s = await store.add(sample)
  const updated = await store.update(s.id, { ...sample, name: 'New Name', semester: 4 })
  assert.strictEqual(updated.name, 'New Name')
  assert.strictEqual((await store.getById(s.id)).semester, 4)
})

test('remove deletes a student', async (store) => {
  const s = await store.add(sample)
  await store.remove(s.id)
  await assert.rejects(store.getById(s.id), NotFoundError)
})

test('unknown id throws NotFoundError', async (store) => {
  await assert.rejects(store.update('nope', sample), NotFoundError)
  await assert.rejects(store.remove('nope'), NotFoundError)
})

async function main() {
  let passed = 0
  for (const { name, fn } of tests) {
    const { store, file } = await freshStore()
    try {
      await fn(store)
      passed++
      console.log(`  PASS  ${name}`)
    } catch (err) {
      console.log(`  FAIL  ${name}\n        ${err.message}`)
      process.exitCode = 1
    } finally {
      await fs.rm(file, { force: true })
    }
  }
  console.log(`\n${passed}/${tests.length} tests passed`)
}

main()
