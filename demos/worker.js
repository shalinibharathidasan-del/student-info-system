// Child process used by process.js (fork): receives marks, sends back the average
process.on('message', ({ marks }) => {
  const average = marks.reduce((a, b) => a + b, 0) / marks.length
  process.send({ average })
})
