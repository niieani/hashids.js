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
		'@babel/preset-typescript',
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import'
	]
}
