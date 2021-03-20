const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => ({
    // Set the webpack mode
    mode: env.production ? 'production' : 'development',
    // Use the main source for production builds, use the dev script for development
    entry: env.production
        ? path.join(__dirname, 'src', 'script', 'index.js')
        : path.join(__dirname, 'dev', 'script.js'),
    // Set our output to always be dist/main.js
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    // Load the html plugin when in development
    plugins: [
        !env.production && new HtmlWebpackPlugin({ title: 'Pet Panda' }),
    ].filter(x => !!x),
    // Include source maps when in development
    devtool: !env.production && 'inline-source-map',
    // The dev server will serve our bundled file from dist
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            // Our scss styling needs to loaded
            {
                test: /\.scss$/i,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ],
            },
            // The sprite art can become a base64 data url
            {
                test: /\.png$/i,
                use: [ 'url-loader' ],
            },
        ],
    },
});