const express = require('express');
const http = require('http');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const auth = require('./auth.json');

const DEV_MODE = (process.argv.length > 2);
const PORT = process.env.PORT | 3000;
const API_KEY = auth['apiKey'];
const API_SECRET_KEY = auth['apiSecretKey'];

const app = express();
const server = http.createServer(app);

if (DEV_MODE) {
    const config = require('./webpack.dev.js');
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/dist/index.html');
    })
    app.use(express.static(__dirname + '/dist'));
}

// app.get('/filter', (req, res) => {

// });

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});