require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const signature = require('./verifySignature');
const { getTones } = require('./toneAnalyzer');
const { postStatus } = require('./slack');

const app = express();
const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

/* Handling events */

app.post('/events', async (req, res) => {
  // App setting validation
  if (req.body.type === 'url_verification') {
    res.send(req.body.challenge);
  } else if (req.body.type === 'event_callback') {
    if (!signature.isVerified(req)) {
      // fraudulent request
      res.sendStatus(404);
      return;
    } else {
      res.sendStatus(200);
    }
    
    const { bot_id, text, user, channel } = req.body.event;
    
    console.log({ bot_id, text, user, channel })

    if (!text) return;

    // Exclude the message from a bot, also slash command
    let regex = /(^\/)/;
    
    //console.log(req.body.event);
    if (bot_id || regex.test(text)) return;

    const tones = await getTones(text);

    console.log(JSON.stringify(tones));

    if (tones.length) {
      await postStatus(tones[0]);
    } else {
      console.log('no tones')
    }
  }
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});