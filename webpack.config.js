var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');


module.exports = {
    context: __dirname,
    entry: {
        app: './frontend/js/app.js',
        style: './frontend/css/style.scss'
    },
    output: {
        filename: '[name].js',
        path: './public/build',
        library: '[name]'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devtool: '#cheap-module-source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react', 'stage-0', 'stage-1']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!resolve-url!sass-loader?sourceMap', 'autoprefixer-loader?browsers=last 2 version')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'autoprefixer-loader?browsers=last 2 version')
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            TweenMax: __dirname + '/frontend/js/libs/TweenMax',
            Swiper:  __dirname + '/frontend/js/libs/swiper.min',
            objectFitVideos: __dirname + '/frontend/js/libs/object-fit-videos.min'
        })
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: "eval-source-map"﻿,
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
};