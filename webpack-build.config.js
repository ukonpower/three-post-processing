const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		'three-post-processing.js': './src/index.js',
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name]',
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	}
};