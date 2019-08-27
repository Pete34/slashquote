'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.resolve(__dirname, 'public')));

app.post('/', (req, res) => {
    console.log(req);
    // implement your bot here ...


    // 1. validate secret 
    // https://api.slack.com/docs/verifying-requests-from-slack

    // 2. potentially store in db any info.
    // team_id and user_id together are unique.

    const response_url = req.response_url;
    console.log(response_url);


    let data = {
        response_type: 'in_channel', // public to channel.
        text: 'Quote should be here..',
        attachments: [
            {
                image_url: 'https://fb8797d1.ngrok.io/public/PageNotFound.png'
            }
        ]
    }

    async function getQuote() {
        try {
            const response = await axios.get('https://quotesapi.hypothetical.space/api/RNGQuote');
            let quote = response.data.content;
            let source = response.data.source;
            let url = response.data.sourceUrl;
            let text = `${quote}\n${source}\n${url}`
            data.text = text;
            res.json(data);

        } catch (error) {
            console.error(error);
            res.json(data);
        }
    }

    getQuote();

 
});

const server = app.listen(3000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});