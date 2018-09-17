// this will only parse and run if you're using node >= 10 with the --experimental-modules flag
// alternatively, if you use something like webpack
// that's why it is in a separate file
describe('importing', () => {
	it('loads via .mjs', () => {
		return import('./importing.mjs');
	});
});
