// Simple working example for react-native-ai-quiz
// Copy and paste this code, then replace the Azure credentials with your own

import React from 'react';
import { View, Alert } from 'react-native';
import AIQuiz from 'react-native-ai-quiz';

const SimpleQuizExample = () => {
  // STEP 1: Replace these values with your Azure OpenAI credentials
  const azureConfig = {
    endpoint: 'https://your-resource.openai.azure.com',  // Get this from Azure Portal
    apiKey: 'your-api-key-here',                        // Get this from Azure Portal  
    deploymentName: 'gpt-35-turbo',                     // Your deployment name in Azure
  };

  // STEP 2: This function runs when the quiz is completed
  const handleQuizComplete = (results) => {
    Alert.alert(
      'Quiz Complete!',
      `You scored ${results.score} out of ${results.total} questions correctly!\n\nPercentage: ${results.percentage}%`
    );
  };

  // STEP 3: Return the AIQuiz component
  return (
    <View style={{ flex: 1 }}>
      <AIQuiz
        azureConfig={azureConfig}           // Pass the config object here
        topic="JavaScript Programming"      // Any topic you want
        difficulty="medium"                 // easy, medium, or hard
        numberOfQuestions={5}               // How many questions
        onQuizComplete={handleQuizComplete} // What to do when quiz finishes
      />
    </View>
  );
};

export default SimpleQuizExample;

/* 
IMPORTANT NOTES:

1. azureConfig must be a JavaScript OBJECT, not a string
2. Replace 'your-resource' with your actual Azure OpenAI resource name
3. Replace 'your-api-key-here' with your actual API key from Azure Portal
4. Make sure your deployment name matches what you created in Azure

WHERE TO GET YOUR CREDENTIALS:
- Go to portal.azure.com
- Find your Azure OpenAI resource
- Click on "Keys and Endpoint"
- Copy the endpoint and one of the keys

EXAMPLE WITH REAL VALUES:
const azureConfig = {
  endpoint: 'https://mycompany-openai.openai.azure.com',
  apiKey: 'abc123def456ghi789jkl012mno345pqr678',
  deploymentName: 'gpt-35-turbo',
};
*/