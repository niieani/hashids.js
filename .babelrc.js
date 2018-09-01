module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: process.env.BABEL_MODULES ? false : 'umd',
			},
		],
	],
}
