const path		= require('path');
const webpack	= require('webpack');

module.exports = {
	entry: [
		'webpack-hot-middleware/client',
		path.join(__dirname, 'web/js/main.jsx')
	],
	
	output: {
		path		: path.join(__dirname, "build/"),
		filename	: 'bundle.js',
		publicPath	: '/build/'
	},
	
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
    ],
	
	module: {
		loaders: [
			{
				loaders: ['react-hot', 'babel?' + JSON.stringify({
					presets: ['es2015', 'es2016', 'es2017', 'react'],
					plugins: ['transform-object-rest-spread']
				})/*, 'eslint'*/],
				exclude	: /node_modules/,
				test	: /\.jsx?$/,
			}
		]
	}
}