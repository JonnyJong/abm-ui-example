const ts = require('@rollup/plugin-typescript');
const tarser = require('@rollup/plugin-terser');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = [
	{
		input: './src/index.ts',
		output: {
			file: './dist/index.js',
			format: 'iife',
			sourcemap: true,
		},
		plugins: [nodeResolve(), commonjs(), ts(), tarser()],
		external: ['@types/node'],
	},
];
