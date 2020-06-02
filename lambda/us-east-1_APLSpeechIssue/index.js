/* *
 * This demo skill exhibits an issue whereby some speech output from a SSML request which also includes audio occasionally omits the
 * speech component when using APL to display text on a device.
 * */
const Alexa = require("ask-sdk-core");

const APLDocument = require("./test.json");

function supportsAPL(handlerInput) {
  const supportedInterfaces = Alexa.getSupportedInterfaces(
    handlerInput.requestEnvelope
  );
  const aplInterface = supportedInterfaces["Alexa.Presentation.APL"];
  return aplInterface !== null && aplInterface !== undefined;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Welcome to the APL Speech Issue demo.  Please say, test, to start the demo";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Goodbye";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

const TestIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "TestIntent"
    );
  },
  handle(handlerInput) {
    const speechText =
      '<break time="200ms"/> Question 4 of 5 <break time="500ms"/><audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01"/><break time="100ms"/>In the 2007 episode, Last of the Time Lords, what is the name of the flying metal spheres, which were actually cyborgs, unleashed by The Master?<break time="200ms"/><break time="300ms"/> 1: <break time="200ms"/>The Toclafane<break time="300ms"/> 2: <break time="200ms"/>The Loctafane<break time="300ms"/> 3: <break time="200ms"/>The Foclatane<audio src="https://s3.amazonaws.com/test.knownentity/AlexaSkills/DoctorWhoQuiz/audio/background_fusion_low.mp3"/><break time="200ms"/> Here\'s the question again <break time="200ms"/> say Alexa <break time="100ms"/> followed by your answer number <break time="500ms"/> In the 2007 episode, Last of the Time Lords, what is the name of the flying metal spheres, which were actually cyborgs, unleashed by The Master?<break time="200ms"/><break time="300ms"/> 1: <break time="200ms"/>The Toclafane<break time="300ms"/> 2: <break time="200ms"/>The Loctafane<break time="300ms"/> 3: <break time="200ms"/>The Foclatane<audio src="https://s3.amazonaws.com/test.knownentity/AlexaSkills/DoctorWhoQuiz/audio/background_fusion_low.mp3"/>';
    if (supportsAPL(handlerInput)) {
      handlerInput.responseBuilder.addDirective({
        type: "Alexa.Presentation.APL.RenderDocument",
        token: "testToken",
        document: APLDocument,
        datasources: {
          myDocumentData: {
            text:
              "This demo text would normally be a Dr Who Quiz question with 3-4 multiple choice answers."
          }
        }
      });
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Sorry, didn't understand that.  Say, test, to repeat the test output";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = "Oops, something went wrong.";
    console.log(`~~~~ Error handled: ${error}`);

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    CancelAndStopIntentHandler,
    TestIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent("sample/apl_speech_issue/v1.0")
  .lambda();
