// this will only parse and run if you're using node >= 10 with the --experimental-modules flag
// alternatively, if you use something like webpack
// that's why it is in a separate file

import childProcess from 'child_process'
import expect from 'expect'

describe('importing', () => {
  test('loads via .mjs', async () => {
    expect.assertions(1)
    const p = childProcess.spawn(
      'node',
      ['--experimental-modules', './importing.mjs'],
      {cwd: __dirname},
    )

    p.stderr.on('data', (d) => console.log(d.toString()))

    const code = await new Promise((resolve) => {
      p.on('close', (code, _signal) => resolve(code))
    })
    expect(code).toBe(0)
  })
})
