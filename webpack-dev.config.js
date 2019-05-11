const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		'main.js': './examples/js/index.js',
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
		},
		{
			test: /\.(frag|vert|glsl|vs|fs)$/,
			use: [{
				loader: 'shader-loader',
				options: {}
			}]
		}]
		
	},
	devServer: {
		host: '0.0.0.0',
		port: 3000,
		contentBase: path.resolve(__dirname, 'examples/'),
		publicPath: '/js',
		openPage: 'index.html',
		disableHostCheck: true,
		compress: true,
		open: true
	},
};