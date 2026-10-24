// Student storage: keeps students in a JSON file using async fs operations.
// Extends EventEmitter so other parts of the app can react to changes.
const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const EventEmitter = require('events')

// Custom error so the server can tell "bad input" apart from real failures
class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

class NotFoundError extends Error {
  constructor(id) {
    super(`Student ${id} not found`)
    this.name = 'NotFoundError'
  }
}

const SAMPLE_STUDENTS = [
  { usn: '1DS24MC001', name: 'Ananya Rao', email: 'ananya@example.com', course: 'MCA', semester: 3 },
  { usn: '1DS24MC002', name: 'Rahul Kumar', email: 'rahul@example.com', course: 'MCA', semester: 3 },
  { usn: '1DS25MC001', name: 'Sneha Patil', email: 'sneha@example.com', course: 'MCA', semester: 1 },
]

class StudentStore extends EventEmitter {
  constructor(filePath = path.join(__dirname, '..', 'data', 'students.json')) {
    super()
    this.filePath = filePath
  }

  // Create the data file with sample students if it does not exist yet
  async init() {
    try {
      await fs.access(this.filePath)
    } catch {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true })
      const seeded = SAMPLE_STUDENTS.map((s) => ({ id: crypto.randomUUID(), ...s }))
      await this.#save(seeded)
    }
  }

  async #load() {
    const text = await fs.readFile(this.filePath, 'utf8')
    return JSON.parse(text)
  }

  async #save(students) {
    await fs.writeFile(this.filePath, JSON.stringify(students, null, 2))
  }

  #validate({ usn, name, email, course, semester }) {
    if (!usn || !usn.trim()) throw new ValidationError('USN is required')
    if (!name || !name.trim()) throw new ValidationError('Name is required')
    if (!/^\S+@\S+\.\S+$/.test(email || '')) throw new ValidationError('Valid email is required')
    const sem = Number(semester)
    if (!Number.isInteger(sem) || sem < 1 || sem > 8) throw new ValidationError('Semester must be 1-8')
    return {
      usn: usn.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim(),
      course: (course || 'MCA').trim(),
      semester: sem,
    }
  }

  async getAll() {
    return this.#load()
  }

  async getById(id) {
    const student = (await this.#load()).find((s) => s.id === id)
    if (!student) throw new NotFoundError(id)
    return student
  }

  // Search by name, USN or email (case-insensitive)
  async search(term) {
    const q = term.toLowerCase()
    return (await this.#load()).filter((s) =>
      [s.name, s.usn, s.email].some((field) => field.toLowerCase().includes(q)),
    )
  }

  async add(data) {
    const student = { id: crypto.randomUUID(), ...this.#validate(data) }
    const students = await this.#load()
    if (students.some((s) => s.usn === student.usn)) {
      throw new ValidationError(`USN ${student.usn} already exists`)
    }
    students.push(student)
    await this.#save(students)
    this.emit('added', student)
    return student
  }

  async update(id, data) {
    const students = await this.#load()
    const index = students.findIndex((s) => s.id === id)
    if (index === -1) throw new NotFoundError(id)
    const updated = { id, ...this.#validate(data) }
    if (students.some((s) => s.usn === updated.usn && s.id !== id)) {
      throw new ValidationError(`USN ${updated.usn} already exists`)
    }
    students[index] = updated
    await this.#save(students)
    this.emit('updated', updated)
    return updated
  }

  async remove(id) {
    const students = await this.#load()
    const student = students.find((s) => s.id === id)
    if (!student) throw new NotFoundError(id)
    await this.#save(students.filter((s) => s.id !== id))
    this.emit('deleted', student)
    return student
  }
}

module.exports = { StudentStore, ValidationError, NotFoundError }
