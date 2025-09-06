/**
 * Usage Examples for react-native-ai-quiz
 * Copy these examples into your React Native project
 */

// Example 1: Basic Setup and Single Question
import { AIQuiz, AzureOpenAI } from 'react-native-ai-quiz';

// Configure Azure OpenAI (do this once when your app starts)
export const setupAI = () => {
  AzureOpenAI.setConfig({
    apiKey: process.env.AZURE_OPENAI_API_KEY, // Use environment variables
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deploymentName: 'gpt-3.5-turbo', // Optional: specify your deployment
    apiVersion: '2023-05-15' // Optional: specify API version
  });
};

// Example 2: Generate a single quiz question
export const generateSingleQuestion = async () => {
  try {
    const quiz = await AIQuiz.generateQuiz("help user learn English", 1);
    const question = quiz.quiz[0];
    
    console.log('Question:', question.question);
    question.options.forEach((option, index) => {
      const label = String.fromCharCode(65 + index); // A, B, C, D
      const marker = option.isCorrect ? '✓' : ' ';
      console.log(`${label}. ${option.text} ${marker}`);
    });
    
    return question;
  } catch (error) {
    console.error('Error generating question:', error.message);
    throw error;
  }
};

// Example 3: Generate multiple questions with options
export const generateQuizWithOptions = async (theme, count, options = {}) => {
  try {
    const quiz = await AIQuiz.generateQuiz(theme, count, {
      difficulty: options.difficulty || 'medium',
      language: options.language || 'English'
    });
    
    return quiz.quiz.map((question, index) => ({
      id: index + 1,
      ...question,
      // Shuffle options to randomize correct answer position
      ...AIQuiz.shuffleOptions(question)
    }));
  } catch (error) {
    console.error('Quiz generation failed:', error.message);
    return [];
  }
};

// Example 4: React Native Component Integration
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export const QuizComponent = ({ theme = "general knowledge", questionCount = 5 }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const quiz = await AIQuiz.generateQuiz(theme, questionCount);
      setQuestions(quiz.quiz.map(q => AIQuiz.shuffleOptions(q)));
      setCurrentQuestion(0);
      setScore(0);
    } catch (error) {
      Alert.alert('Error', `Failed to load quiz: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = questions[currentQuestion].options[optionIndex].isCorrect;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        Alert.alert('Quiz Complete!', `Your score: ${score + (isCorrect ? 1 : 0)}/${questions.length}`);
      }
    }, 1500);
  };

  useEffect(() => {
    loadQuiz();
  }, [theme, questionCount]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Generating quiz questions...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No questions available</Text>
        <TouchableOpacity onPress={loadQuiz}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = questions[currentQuestion];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Question {currentQuestion + 1} of {questions.length}</Text>
      <Text style={{ fontSize: 18, marginVertical: 20 }}>{question.question}</Text>
      
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleAnswerSelect(index)}
          disabled={selectedAnswer !== null}
          style={{
            padding: 15,
            marginVertical: 5,
            backgroundColor: 
              selectedAnswer === index 
                ? (option.isCorrect ? '#d4edda' : '#f8d7da')
                : '#f8f9fa',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#dee2e6'
          }}
        >
          <Text>{String.fromCharCode(65 + index)}. {option.text}</Text>
        </TouchableOpacity>
      ))}
      
      <Text style={{ marginTop: 20 }}>Score: {score}/{questions.length}</Text>
    </View>
  );
};

// Example 5: Error Handling Best Practices
export const safeQuizGeneration = async (theme, count) => {
  // Check if configured
  if (!AzureOpenAI.isConfigured()) {
    throw new Error('Azure OpenAI not configured. Please call setupAI() first.');
  }

  // Validate inputs
  if (!theme || theme.trim().length === 0) {
    throw new Error('Theme cannot be empty');
  }

  if (count < 1 || count > 50) {
    throw new Error('Question count must be between 1 and 50');
  }

  try {
    const quiz = await AIQuiz.generateQuiz(theme, count);
    
    // Additional validation
    if (!quiz.quiz || quiz.quiz.length === 0) {
      throw new Error('No questions were generated');
    }

    return quiz;
  } catch (error) {
    // Log error for debugging
    console.error('Quiz generation error:', {
      theme,
      count,
      error: error.message
    });

    // Re-throw with user-friendly message
    if (error.message.includes('API key')) {
      throw new Error('Invalid API configuration. Please check your credentials.');
    } else if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please check your internet connection.');
    } else {
      throw new Error('Failed to generate quiz. Please try again.');
    }
  }
};