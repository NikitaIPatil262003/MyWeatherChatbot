const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const axios = require('axios');

// Initialize services
const assistant = new AssistantV2({
  version: '2021-11-27',
  authenticator: new IamAuthenticator({ apikey: process.env.ASSISTANT_APIKEY }),
  serviceUrl: process.env.ASSISTANT_URL
});

const cloudant = new CloudantV1({
  authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_APIKEY })
});
cloudant.setServiceUrl(process.env.CLOUDANT_URL);

async function main(params) {
  try {
    // Process with Watson Assistant
    const assistantResponse = await assistant.messageStateless({
      assistantId: process.env.ASSISTANT_ID,
      input: {
        message_type: 'text',
        text: params.message
      }
    });

    // Check if weather query
    if (assistantResponse.result.output.intents[0]?.intent === 'ask_weather') {
      const weather = await getWeatherData(params.location);
      assistantResponse.result.output.generic[0].text += 
        ` Current weather: ${weather.temp}°C, ${weather.description}`;
    }

    // Store conversation in Cloudant
    await cloudant.postDocument({
      db: 'chat-history',
      document: {
        message: params.message,
        response: assistantResponse.result.output.generic[0].text,
        timestamp: new Date().toISOString()
      }
    });

    return { 
      response: assistantResponse.result.output.generic[0].text 
    };
  } catch (err) {
    return { error: err.message };
  }
}

async function getWeatherData(location) {
  const response = await axios.get(
    `https://${process.env.WEATHER_API_URL}/api/weather/v1/location/${location}/observations.json`,
    {
      params: {
        language: 'en-US',
        units: 'm'
      },
      headers: {
        'Accept': 'application/json'
      }
    }
  );
  return {
    temp: response.data.observation.temp,
    description: response.data.observation.wx_phrase
  };
}