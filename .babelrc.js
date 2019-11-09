module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.BABEL_MODULES ? false : 'umd',
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
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-syntax-bigint',
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-destructuring',
  ],
  exclude: ['./dist', './cjs', './esm'],
  moduleId: 'Hashids',
}
