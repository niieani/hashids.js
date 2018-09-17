module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: process.env.BABEL_MODULES ? false : 'umd',
			}
		],
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import'
	]
}
