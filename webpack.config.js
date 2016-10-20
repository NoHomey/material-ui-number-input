const webpack = require('webpack');

module.exports = {
    entry: './example/index',

    output: {
        filename: './dist/bundle.js',
    },

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ["ts-loader"]
            }
        ],
    }
};