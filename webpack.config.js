const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'index_bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Lf',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    mode: "development",
}