/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'This is the karaoke template!';

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak("This is an echo device without a screen!")
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'karaokeToken',
        version: '1.0',
        document: require('./karaoke.json'),
        datasources: {
          "karaokeTemplateData": {
              "type": "object",
              "objectId": "karaokeSample",
              "properties": {
                  "karaokeSsml": "<speak>Here are the best cheeses of the World. </speak>",
                  "goudaSsml": "<speak>Gouda</speak>",
                  "cheddarSsml": "<speak>Sharp Cheddar</speak>",
                  "blueSsml": "<speak>Blue</speak>",
                  "brieSsml": "<speak>Brie</speak>",
                  "sharpcheddarSsml": "<speak>Sharp Chedda</speak>",
                  "blueSsml": "<speak>Blue</speak>",
                  "brieSsml": "<speak>Brie</speak>",
                  "hintString" : "try the blue cheese!"
              },
              "transformers": [
                  {
                    "inputPath": "karaokeSsml",
                    "outputName": "karaokeSpeech",
                    "transformer": "ssmlToSpeech"
                  },
                  {
                    "inputPath": "karaokeSsml",
                    "outputName": "karaokeText",
                    "transformer": "ssmlToText"
                  },
                  {
                    "inputPath": "goudaSsml",
                    "outputName": "goudaSpeech",
                    "transformer": "ssmlToSpeech"
                  },
                  {
                    "inputPath": "cheddarSsml",
                    "outputName": "cheddarSpeech",
                    "transformer": "ssmlToSpeech"
                  },
                  {
                    "inputPath": "blueSsml",
                    "outputName": "blueSpeech",
                    "transformer": "ssmlToSpeech"
                  },
                  {
                    "inputPath": "brieSsml",
                    "outputName": "brieSpeech",
                    "transformer": "ssmlToSpeech"
                  }
              ]
          }
      }
    })
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'karaokeToken',
        commands: [
          {
            type: 'SpeakItem',
            componentId: 'karaokespeechtext',
            highlightMode: 'line'
          },
          {
            type: 'SpeakItem',
            componentId: 'gouda',
            highlightMode: 'line'
          },
          {
            type: 'SpeakItem',
            componentId: 'sharpcheddar',
            highlightMode: 'line'
          },
          {
            type: 'SpeakItem',
            componentId: 'blue',
            highlightMode: 'line'
          },
          {
            type: 'SpeakItem',
            componentId: 'brie',
            highlightMode: 'line'
          }
        ]
      })
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface != null && aplInterface != undefined;
}


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();