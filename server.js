const express = require('express');
const http = require('http');
const request = require('request');
const fs = require('fs');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

let auth = require('./auth.json');

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

let bearerToken = auth['bearerToken'];

function generateBearerToken() {
    return new Promise((resolve, reject) => {
        console.log('Generating new bearer token!');
        request.post({
            headers: {
                'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET_KEY}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Content-Length': 29
            },
            uri: 'https://api.twitter.com/oauth2/token',
            body: 'grant_type=client_credentials'
        }, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                bearerToken = JSON.parse(body)['access_token'];
                console.log(`New bearer token: ${bearerToken}. Saving to auth.json.`);
                auth['bearerToken'] = bearerToken;
                fs.writeFile('auth.json', JSON.stringify(auth), 'utf8', () => {});
                resolve();
            }
        });
    });
}

function getTweets(userId) {
    return new Promise((resolve, reject) => {
        request.get({
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
            },
            uri: `https://api.twitter.com/1.1/statuses/user_timeline.json?count=200&user_id=${userId.toString()}`,
        }, async (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                parsedBody = JSON.parse(body);
                if (parsedBody['errors'] && parsedBody['errors'][0]['code'] == 215) {
                    console.log('Bearer token expired. Generating new one and retrying.');
                    await generateBearerToken();
                    resolve(await getTweets(userId));
                } else {
                    resolve(parsedBody);
                }
            }
        });
    });
}

let cache = {};

async function filterTweets(metroIndex, lineIndex) {
    const metroLines = require('./src/metroLines.json');
    //console.log(metroIndex.toString() + ", " + lineIndex.toString());

    const metro = metroLines['metros'][metroIndex];
    if (!metro) {
        throw new Error('Invalid metroIndex.');
    }

    const line = metro['lines'][lineIndex];
    if (!line) {
        throw new Error('Invalid lineIndex.');
    }

    if (metroIndex in cache && lineIndex in cache[metroIndex]) {
        return cache[metroIndex][lineIndex];
    } else if (!(metroIndex in cache)) {
        cache[metroIndex] = {};
    }

    const tweets = await getTweets(metro['userId']);
    let filteredTweetIDs = [];
    for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];
        for (let j = 0; j < line['keywords'].length; j++) {
            const keyword = line['keywords'][j].toUpperCase();
            if (tweet['text'].toUpperCase().includes(keyword)) {
                filteredTweetIDs.push(tweet['id_str']);
            }
        }
    }

    cache[metroIndex][lineIndex] = filteredTweetIDs;

    return filteredTweetIDs;
}

app.get('/filter', async (req, res, next) => {
    const metroIndex = parseInt(req.query.metroIndex);
    const lineIndex = parseInt(req.query.lineIndex);

    try {
        if ((metroIndex != null) && (lineIndex != null)) {
            const tweetIDs = await filterTweets(metroIndex, lineIndex);
            res.json({
                'tweetIDs': tweetIDs
            });
        } else {
            throw new Error('No metroIndex or lineIndex parameters included in query.');
        }
    } catch (err) {
        console.error(err.stack);
        res.status(400).send({error: err.message});
    }
});

setInterval(() => {
    console.log('Emptying cache!');
    cache = {};
}, 60000);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});