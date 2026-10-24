# Student Information Management System (Node.js)

MMCA314D – Web Development Using Full Stack Open — **Assignment 1, Question 3**

A Node.js web app to add, display, search, update and delete students, plus a set of small demos for each Node.js core concept. It uses **only built-in Node modules** (no npm packages to install).

## How to run

Needs Node.js 18 or newer.

```bash
npm start                    # start the web app at http://localhost:3000
node server.js --port 4000   # command-line option: choose a port
npm test                     # run tests (assert module)
npm run demo                 # list concept demos
npm run demo all             # run every demo
npm run demo os crypto       # run selected demos
npm run repl                 # interactive REPL with the student store
npm run debug                # start the server in the Node debugger
```

## Web modules

| Feature | How |
|---|---|
| Add student | Form on the home page → `POST /add` |
| Display students | Table on the home page → `GET /` |
| Search student | Search box → `GET /?search=rao` (name, USN or email) |
| Update student | Edit button → `GET /edit?id=…` → `POST /update` |
| Delete student | Delete button → `POST /delete` |
| JSON API | `GET /api/students`, `GET /api/students?search=rao` |

Students are stored in `data/students.json` (created with sample data on first run). All file access is asynchronous (`fs/promises`). Invalid input (missing fields, bad email, semester outside 1–8, duplicate USN) is shown as an error message; unknown pages and students return 404; unexpected errors return 500 without crashing the server.

## Project structure

```
student-info-system/
├── package.json            npm project: scripts, metadata
├── server.js               HTTP server and routes (web modules)
├── lib/
│   ├── studentStore.js     Student CRUD on a JSON file (fs, events, crypto, custom errors)
│   └── logger.js           Logs to console and logs/app.log (write stream)
├── demos/                  One file per Node.js concept, run with "npm run demo <name>"
│   ├── index.js            Demo runner (reads command-line arguments)
│   ├── console.js  os.js  timers.js  errors.js  dns.js  crypto.js  tls.js
│   ├── process.js  worker.js  buffer.js  streams.js  fs.js
│   ├── stringDecoder.js  querystring.js  assert.js  events.js
│   ├── repl.js             Custom REPL
│   └── debugger.js         Debugger walkthrough
├── test/store.test.js      Tests written with assert
└── data/students.json      Data file (created at runtime, not committed)
```

## Where each concept is used

| Concept | Where |
|---|---|
| Console | `demos/console.js` (log, info, warn, error, table, group, time, count); `lib/logger.js` |
| REPL | `demos/repl.js` – custom prompt, store in context, `.count` command |
| NPM | `package.json` with scripts (`start`, `dev`, `test`, `demo`, `repl`, `debug`) |
| Command-line options | `server.js --port --host` (`util.parseArgs`); `demos/index.js` reads `process.argv` |
| OS module | `demos/os.js` |
| Timer module | `demos/timers.js` (setTimeout, setInterval, setImmediate, nextTick, timers/promises) |
| Error handling | `demos/errors.js`; custom `ValidationError` / `NotFoundError` in `lib/studentStore.js`; central error handler in `server.js` |
| DNS | `demos/dns.js` (lookup, resolve4, resolveMx) |
| Crypto | `demos/crypto.js` (hash, HMAC, scrypt, AES); `crypto.randomUUID()` for student IDs |
| TLS/SSL concepts | `demos/tls.js` – explains the handshake, connects to an HTTPS server and reads its certificate |
| Debugger | `demos/debugger.js` (`debugger` statement, `node inspect`, Chrome DevTools); `npm run debug` |
| Process | `demos/process.js`; `process.on('SIGINT')` shutdown and `process.env.PORT` in `server.js` |
| Child Process | `demos/process.js` (exec, execFile, spawn, fork with `worker.js`) |
| Buffers | `demos/buffer.js`; request body chunks joined with `Buffer.concat` in `server.js` |
| Streams | `demos/streams.js` (Readable, Transform, pipeline); request stream in `server.js`; write stream in `logger.js` |
| File System | `demos/fs.js`; `lib/studentStore.js` (readFile, writeFile, mkdir, access) |
| String Decoder | `demos/stringDecoder.js` |
| Query String | `demos/querystring.js`; form and search parsing in `server.js` |
| Assertion | `demos/assert.js`; `test/store.test.js` |
| Callbacks and Events | `demos/events.js`; `StudentStore` extends `EventEmitter` and emits `added` / `updated` / `deleted`, which `server.js` logs |
| Asynchronous operations | async/await throughout the store and server |

## Commit history

1. Initial commit: npm project setup with package.json and scripts
2. Add StudentStore (async fs, EventEmitter, crypto IDs, custom errors) and stream logger
3. Add web server with add, display, search, update and delete routes
4. Add demos: console, OS, timers, error handling, process and child process
5. Add demos: DNS, crypto and TLS/SSL
6. Add demos: buffers, streams, file system, string decoder, query string
7. Add demos: assert, callbacks and events, REPL, debugger, and demo runner
8. Add store tests using the assert module (npm test)
9. Add README with project structure and concept mapping
