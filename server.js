// Student Information Management System - web server (Node.js core modules only)
const http = require('http')
const querystring = require('querystring')
const { parseArgs } = require('util')
const { StudentStore, ValidationError, NotFoundError } = require('./lib/studentStore')
const log = require('./lib/logger')

// Command-line options: node server.js --port 4000 --host 127.0.0.1
const { values: options } = parseArgs({
  options: {
    port: { type: 'string', short: 'p', default: process.env.PORT || '3000' },
    host: { type: 'string', default: 'localhost' },
  },
})

const store = new StudentStore()

// Events: log every change made to the data
store.on('added', (s) => log.info(`Student added: ${s.usn} ${s.name}`))
store.on('updated', (s) => log.info(`Student updated: ${s.usn} ${s.name}`))
store.on('deleted', (s) => log.info(`Student deleted: ${s.usn} ${s.name}`))

// ---------- helpers ----------

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Read the request body (arrives as a stream of Buffer chunks) and parse the form data
function readForm(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 1e5) {
        reject(new ValidationError('Request too large'))
        req.destroy()
      } else {
        chunks.push(chunk)
      }
    })
    req.on('end', () => resolve(querystring.parse(Buffer.concat(chunks).toString('utf8'))))
    req.on('error', reject)
  })
}

function send(res, status, body, type = 'text/html; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type })
  res.end(body)
}

function redirect(res, params = {}) {
  const qs = querystring.stringify(params)
  res.writeHead(303, { Location: qs ? `/?${qs}` : '/' })
  res.end()
}

// ---------- HTML ----------

function layout(title, content) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #f3f4f6; color: #111827; }
    header { background: #1e3a8a; color: #fff; padding: 16px; }
    header h1 { margin: 0; font-size: 22px; }
    main { max-width: 960px; margin: 0 auto; padding: 16px; }
    .card { background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
    form.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; align-items: end; }
    label { display: block; font-size: 13px; color: #374151; }
    input, select { width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
    button, .btn { background: #1e3a8a; color: #fff; border: 0; border-radius: 6px; padding: 9px 14px; cursor: pointer; font-size: 14px; text-decoration: none; display: inline-block; }
    .btn-light { background: #e5e7eb; color: #111827; }
    .btn-danger { background: #dc2626; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .table-wrap { overflow-x: auto; }
    .actions { display: flex; gap: 6px; }
    .msg { padding: 10px; border-radius: 6px; margin-bottom: 16px; }
    .ok { background: #dcfce7; color: #166534; }
    .err { background: #fee2e2; color: #991b1b; }
    .search { display: flex; gap: 8px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <header><h1>Student Information System</h1></header>
  <main>${content}</main>
</body>
</html>`
}

function studentFields(s = {}) {
  return `
    <div><label>USN<input name="usn" value="${escapeHtml(s.usn || '')}" required></label></div>
    <div><label>Name<input name="name" value="${escapeHtml(s.name || '')}" required></label></div>
    <div><label>Email<input name="email" type="email" value="${escapeHtml(s.email || '')}" required></label></div>
    <div><label>Course<input name="course" value="${escapeHtml(s.course || 'MCA')}"></label></div>
    <div><label>Semester<input name="semester" type="number" min="1" max="8" value="${escapeHtml(s.semester || 1)}" required></label></div>`
}

function homePage(students, { search = '', msg = '', error = '' }) {
  const rows = students
    .map(
      (s) => `
      <tr>
        <td>${escapeHtml(s.usn)}</td>
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.email)}</td>
        <td>${escapeHtml(s.course)}</td>
        <td>${escapeHtml(s.semester)}</td>
        <td class="actions">
          <a class="btn btn-light" href="/edit?id=${encodeURIComponent(s.id)}">Edit</a>
          <form method="post" action="/delete" onsubmit="return confirm('Delete ${escapeHtml(s.name)}?')">
            <input type="hidden" name="id" value="${escapeHtml(s.id)}">
            <button class="btn-danger">Delete</button>
          </form>
        </td>
      </tr>`,
    )
    .join('')

  return layout(
    'Students',
    `
    ${msg ? `<div class="msg ok">${escapeHtml(msg)}</div>` : ''}
    ${error ? `<div class="msg err">${escapeHtml(error)}</div>` : ''}

    <div class="card">
      <h2>Add Student</h2>
      <form class="grid" method="post" action="/add">
        ${studentFields()}
        <div><button type="submit">Add</button></div>
      </form>
    </div>

    <div class="card">
      <h2>Students (${students.length})</h2>
      <form class="search" method="get" action="/">
        <input name="search" placeholder="Search by name, USN or email" value="${escapeHtml(search)}">
        <button type="submit">Search</button>
        ${search ? '<a class="btn btn-light" href="/">Clear</a>' : ''}
      </form>
      <div class="table-wrap">
        <table>
          <thead><tr><th>USN</th><th>Name</th><th>Email</th><th>Course</th><th>Sem</th><th></th></tr></thead>
          <tbody>${rows || '<tr><td colspan="6">No students found.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`,
  )
}

function editPage(student, error = '') {
  return layout(
    'Edit Student',
    `
    ${error ? `<div class="msg err">${escapeHtml(error)}</div>` : ''}
    <div class="card">
      <h2>Edit Student</h2>
      <form class="grid" method="post" action="/update">
        <input type="hidden" name="id" value="${escapeHtml(student.id)}">
        ${studentFields(student)}
        <div class="actions"><button type="submit">Save</button><a class="btn btn-light" href="/">Cancel</a></div>
      </form>
    </div>`,
  )
}

// ---------- routes ----------

async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const query = querystring.parse(url.search.slice(1))
  const route = `${req.method} ${url.pathname}`

  switch (route) {
    case 'GET /': {
      const students = query.search ? await store.search(query.search) : await store.getAll()
      return send(res, 200, homePage(students, query))
    }

    case 'GET /edit': {
      const student = await store.getById(query.id)
      return send(res, 200, editPage(student))
    }

    case 'POST /add': {
      const form = await readForm(req)
      try {
        const s = await store.add(form)
        return redirect(res, { msg: `Added ${s.name}` })
      } catch (err) {
        if (err instanceof ValidationError) return redirect(res, { error: err.message })
        throw err
      }
    }

    case 'POST /update': {
      const form = await readForm(req)
      try {
        const s = await store.update(form.id, form)
        return redirect(res, { msg: `Updated ${s.name}` })
      } catch (err) {
        if (err instanceof ValidationError) {
          return send(res, 400, editPage({ ...form }, err.message))
        }
        throw err
      }
    }

    case 'POST /delete': {
      const form = await readForm(req)
      const s = await store.remove(form.id)
      return redirect(res, { msg: `Deleted ${s.name}` })
    }

    // JSON API: /api/students or /api/students?search=rao
    case 'GET /api/students': {
      const students = query.search ? await store.search(query.search) : await store.getAll()
      return send(res, 200, JSON.stringify(students, null, 2), 'application/json')
    }

    default:
      return send(res, 404, layout('Not found', '<div class="card"><h2>404 - Page not found</h2><a href="/">Home</a></div>'))
  }
}

const server = http.createServer((req, res) => {
  const start = Date.now()
  res.on('finish', () => log.info(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`))

  // Error handling: every route error ends up here instead of crashing the server
  handle(req, res).catch((err) => {
    if (err instanceof NotFoundError) {
      return send(res, 404, layout('Not found', `<div class="card"><h2>${escapeHtml(err.message)}</h2><a href="/">Home</a></div>`))
    }
    log.error(err.stack)
    send(res, 500, layout('Error', '<div class="card"><h2>500 - Something went wrong</h2><a href="/">Home</a></div>'))
  })
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') log.error(`Port ${options.port} is already in use. Try: node server.js --port 4000`)
  else log.error(err.message)
  process.exit(1)
})

// Process events: shut down cleanly on Ctrl+C
process.on('SIGINT', () => {
  log.info('Shutting down...')
  server.close(() => process.exit(0))
})

store
  .init()
  .then(() => {
    server.listen(Number(options.port), options.host, () => {
      log.info(`Server running at http://${options.host}:${options.port} (pid ${process.pid})`)
    })
  })
  .catch((err) => {
    log.error(`Could not start: ${err.message}`)
    process.exit(1)
  })
