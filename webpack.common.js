const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        login : './src/login.js',
        work : './src/work.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename : 'login.htm',
            template: './src/template.htm',
            jsList : ['http://data.eat163.com/16.js'],
            inject : false,
            hash : true,
        }),
        new HtmlWebpackPlugin({
            filename : 'work.htm',
            template: './src/template.htm',
            jsList : ['http://data.eat163.com/16.js'],
            inject : false,
            hash : true,
        }),
    ],
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules : [{
            test: /\.less$/,
            use : ['style-loader' , 'css-loader' , 'less-loader']
        },
        {
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react'],
                }
            },
            exclude: /node_modules/
        }]
    }
};  