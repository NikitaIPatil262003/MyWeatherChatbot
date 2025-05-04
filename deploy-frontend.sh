#!/bin/bash

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Deploying frontend to IBM Cloud..."
ibmcloud target --cf
ibmcloud cf push weather-chatbot-frontend -p build

echo "Frontend deployed successfully!"