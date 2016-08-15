const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const APP = __dirname + '/app';
const BUILD = __dirname + '/build';
const STYLE = __dirname + '/app/style.css';

const PACKAGE = Object.keys(
    require('./package.json').dependencies
);

module.exports = {
    entry: {
        app: APP,
        style: STYLE,
        vender: PACKAGE
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: BUILD,
        filename: '[name].[hash].js',
        chunkFilename: '[chunkhash].js'
    },
    module: {
        loaders: [
	        {
	            test: /\.jsx?$/,
	            loaders: ['babel?cacheDirectory'],
	            include: APP
	        }, {
	            test: /\.css$/,
	            loader: ExtractTextPlugin.extract('style', 'css'),
	            include: APP
	        }
        ]
    },
    plugins: [
        new CleanPlugin([BUILD]),
        new HtmlWebpackPlugin({
            template: 'node_modules/html-webpack-template/index.ejs',
            title: 'React Speed Coding',
            appMountId: 'app',
            inject: false,
            // Use html-minifier
            minify: {
                collapseWhitespace: true
            }
        }),
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
