module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: process.env.BABEL_MODULES ? false : 'umd',
				...process.env.NODE_ENV === 'test'
					? {
						targets: {
							"node": "current"
						}
					}
					: {},
			}
		],
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import'
	]
}
