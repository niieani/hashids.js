/* eslint-disable camelcase,import/no-unresolved */
import benchmark from 'nodemark'
import requireFromWeb from 'require-from-web'
import Hashids from '../hashids'

type HashidsType = typeof import('../hashids').default

// eslint-disable-next-line @typescript-eslint/no-shadow
const benchmarkVersion = (Hashids: HashidsType, version: string) => {
  const hashids = new Hashids()
  const encoded = '5KoLLVL49RLhYkppOplM6piwWNNANny8N'
  const decoded = [
    9_007_199_254_740_991, 9_007_199_254_740_991, 9_007_199_254_740_991,
  ]

  const decoding = benchmark(() => hashids.decode(encoded))
  const encoding = benchmark(() => hashids.encode(decoded))

  console.log(version, '\tdecoding\t', decoding)
  console.log(version, '\tencoding\t', encoding)
}

async function run() {
  const { default: Hashids_v1_2_2 } = await requireFromWeb<{
    default: HashidsType
  }>('https://unpkg.com/hashids@1.2.2/dist/index.js')
  const { default: Hashids_v2_1_0 } = await requireFromWeb<{
    default: HashidsType
  }>('https://unpkg.com/hashids@2.1.0/dist/hashids.js')

  // eslint-disable-next-line import/extensions
  const Hashids_transpiled = require('../cjs')

  benchmarkVersion(Hashids_v1_2_2, '1.2.2')
  benchmarkVersion(Hashids_v2_1_0, '2.1.0')
  benchmarkVersion(Hashids_transpiled, 'transpiled')
  benchmarkVersion(Hashids, 'node')
}

void run()
