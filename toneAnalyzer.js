const ToneAnalyzer = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzer({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY,
  }),
  url: 'https://api.us-east.tone-analyzer.watson.cloud.ibm.com',
  version: '2017-09-21',
});

const getTones = (text) => {
  return toneAnalyzer.tone({
    toneInput: JSON.stringify(text),
    contentType: 'text/plain',
  })
  .then(response => response.result.document_tone.tones)
  .catch(error => console.error(error));
}


module.exports = { getTones }
