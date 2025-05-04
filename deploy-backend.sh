#!/bin/bash

echo "Deploying backend..."
cd backend

# Install dependencies
npm install

# Create or update action
ibmcloud fn action update weather-chatbot index.js \
  --kind nodejs:14 \
  --web true \
  --param ASSISTANT_APIKEY "$IBM_ASSISTANT_APIKEY" \
  --param ASSISTANT_URL "$IBM_ASSISTANT_URL" \
  --param ASSISTANT_ID "$IBM_ASSISTANT_ID" \
  --param CLOUDANT_APIKEY "$IBM_CLOUDANT_APIKEY" \
  --param CLOUDANT_URL "$IBM_CLOUDANT_URL" \
  --param WEATHER_API_URL "$IBM_WEATHER_API_URL"

echo "Backend deployed successfully!"