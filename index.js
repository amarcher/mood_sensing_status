const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const server = app.listen(80, () => {
	console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.post('/event', (req, res) => {
  if (req.body.type === 'url_verification') {
    res.send(req.body.challenge);
  }

  // will implement at the next step ...
});
