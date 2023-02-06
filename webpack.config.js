const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseConfig = {
	target: 'node', // 运行环境为 node,

	mode: 'none',
	resolve: {
		// Add '.ts' and '.tsx' as a resolvable extension.
		extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},

	module: {
		rules: [
			// all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
			{ test: /\.tsx?$/, loader: "ts-loader" }
		]
	},
};

const server = {
	...baseConfig,
	name: 'main',
	entry: './src/main.ts',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, './out')
	},
	plugins: [
		new CleanWebpackPlugin()
	]
};

const test = {
	...baseConfig,
	name: 'test',
	entry: './src/__test__/main.ts',
	output: {
		filename: 'test.js',
		path: path.resolve(__dirname, './out')
	},
	plugins: [
		new CleanWebpackPlugin()
	]
};

module.exports = [server, test];