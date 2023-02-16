/* eslint-disable jest/require-top-level-describe */
// this will only parse and run if you're using node >= 12 with the --experimental-modules flag
// alternatively, if you use something like webpack
// that's why it is in a separate file

import childProcess from 'child_process'

const supportsConditional = /^v\d[3-9]/.test(process.version)
const describeIfEsm = supportsConditional ? describe : describe.skip

// only run on node >= v13:
describeIfEsm('conditional requires', () => {
  test('loads via .cjs', async () => {
    expect.assertions(1)
    const p = childProcess.spawn('node', ['./requiring.cjs'], {
      cwd: __dirname,
      env: {
        PATH: process.env.PATH,
      },
    })

    p.stderr.on('data', (d) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (!d.toString().includes('ExperimentalWarning:')) {
        console.log(d.toString())
      }
    })

    const code = await new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      p.on('close', (code, _signal) => void resolve(code))
    })

    expect(code).toBe(0)
  })
})
