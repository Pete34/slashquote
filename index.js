'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.resolve(__dirname, 'public')));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    //__dirname : It will resolve to your project folder.
});

app.post('/', (req, res) => {
    console.log(req);
    // implement your bot here ...

    async function getQuote() {
        try {

            // get image data
            const giphy = await axios.get(
                'https://api.giphy.com/v1/gifs/random?api_key=wOi3i1UvK6w5fBoRtQ1vfjRucYgu4HRF&tag=cat&rating=PG'
            );

            // grab image url
            const image = giphy.data.data.images.fixed_width.url;

            // get quote data
            const response = await axios.get(
                'https://quotesapi.hypothetical.space/api/RNGQuote'
            );

            // map quote data.
            let quote = response.data.content;
            let source = response.data.source;
            let url = response.data.sourceUrl;

            // build into text string
            let text = `\n *Quote from Celia's API*:smile:\n\n${quote}\n${source}\n${url}\n`;


            let data = {
                response_type: 'in_channel', // public to channel.

                text: text,
                mrkdwn: true,
                attachments: [
                    {
                        image_url: image
                    }
                ]
            };

            // return data object.
            res.json(data);
        } catch (error) {
            console.error(error);
            res.json(data);
        }
    }

    getQuote();
});

const server = app.listen(3000, () => {
    console.log(
        'Express server listening on port %d in %s mode',
        server.address().port,
        app.settings.env
    );
});
