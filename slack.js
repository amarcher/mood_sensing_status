const qs = require('qs');
const axios = require('axios');

const API_URL = 'https://slack.com/api/';
const PROFILE_SET = 'users.profile.set';

const EMOJI_FOR_TONE = {
  analytical: 'thinking_face',
  anger: 'angry',
  confident: 'boom',
  disgust: 'face_with_rolling_eyes',
  fear: 'fearful',
  joy: 'joy',
  tentative: 'cold_sweat',
}

const getEmoji = (tone) => {
  const emoji = EMOJI_FOR_TONE[tone.tone_id];

  if (!emoji) return undefined;

  return `:${emoji}:`;
}


const postStatus = async (tone) => { 
  const args = {
    token: process.env.SLACK_ACCESS_TOKEN,
    profile: JSON.stringify({
      status_text: tone.tone_name,
      status_emoji: getEmoji(tone),
      status_expiration: 0,
    }),
  };
  const result = await axios.post(`${API_URL}${PROFILE_SET}`, qs.stringify(args));

  console.log(result);
};

module.exports = { postStatus }
