module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
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
    ...(process.env.BABEL_MODULES
      ? []
      : ['@babel/plugin-transform-modules-umd']),
  ],
  moduleId: 'Hashids',
}
