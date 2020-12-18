const {declare} = require('@babel/helper-plugin-utils')
const {default: presetEnv} = require('@babel/preset-env')

const presetEnvOptions = {
  modules: false,
  loose: true,
  shippedProposals: true,
  // we need the spread to not be loose:
  exclude: [
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-destructuring',
  ],
  ...(process.env.NODE_ENV === 'test'
    ? {
        targets: {
          node: 'current',
        },
      }
    : {}),
}

module.exports = {
  presets: [
    ['@babel/preset-env', presetEnvOptions],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-syntax-bigint',
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-destructuring',
    ...(process.env.BABEL_MODULES
      ? []
      : [
          [
            '@babel/plugin-transform-modules-umd',
            {
              globals: {
                hashids: 'Hashids',
              },
              exactGlobals: true,
            },
          ],
        ]),
  ],
  exclude: ['./dist', './cjs', './esm'],
  moduleId: 'Hashids',
}
