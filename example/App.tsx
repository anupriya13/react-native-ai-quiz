import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { ReactNativeAIQuiz, QuizQuestion, AzureOpenAIConfig } from 'react-native-ai-quiz';

const App = () => {
  const [azureConfig, setAzureConfig] = useState<AzureOpenAIConfig>({
    endpoint: '',
    apiKey: '',
    deploymentName: '',
    apiVersion: '2023-12-01-preview',
  });
  
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('5');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const aiQuiz = new ReactNativeAIQuiz();

  const handleGenerateQuiz = async () => {
    if (!azureConfig.endpoint || !azureConfig.apiKey || !azureConfig.deploymentName || !topic) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await aiQuiz.generateQuiz({
        topic,
        numberOfQuestions: parseInt(numberOfQuestions, 10),
        difficulty,
        azureConfig,
      });
      
      setQuestions(result.questions);
      setUserAnswers(new Array(result.questions.length).fill(-1));
      setShowResults(false);
      Alert.alert('Success', `Generated ${result.questions.length} questions about ${result.topic}`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    if (userAnswers.includes(-1)) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting');
      return;
    }

    const results = ReactNativeAIQuiz.calculateScore(questions, userAnswers);
    setShowResults(true);
    Alert.alert(
      'Quiz Results',
      `You scored ${results.correct} out of ${results.total} (${results.percentage}%)`
    );
  };

  const renderConfigSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Azure OpenAI Configuration</Text>
      <TextInput
        style={styles.input}
        placeholder="Azure OpenAI Endpoint"
        value={azureConfig.endpoint}
        onChangeText={(text) => setAzureConfig({...azureConfig, endpoint: text})}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="API Key"
        value={azureConfig.apiKey}
        onChangeText={(text) => setAzureConfig({...azureConfig, apiKey: text})}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Deployment Name"
        value={azureConfig.deploymentName}
        onChangeText={(text) => setAzureConfig({...azureConfig, deploymentName: text})}
        autoCapitalize="none"
      />
    </View>
  );

  const renderQuizConfigSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quiz Configuration</Text>
      <TextInput
        style={styles.input}
        placeholder="Topic (e.g., React Native, JavaScript)"
        value={topic}
        onChangeText={setTopic}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Questions"
        value={numberOfQuestions}
        onChangeText={setNumberOfQuestions}
        keyboardType="numeric"
      />
      <View style={styles.difficultyContainer}>
        {(['easy', 'medium', 'hard'] as const).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.difficultyButton,
              difficulty === level && styles.difficultyButtonSelected,
            ]}
            onPress={() => setDifficulty(level)}>
            <Text
              style={[
                styles.difficultyText,
                difficulty === level && styles.difficultyTextSelected,
              ]}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.generateButton, loading && styles.generateButtonDisabled]}
        onPress={handleGenerateQuiz}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Quiz</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = (question: QuizQuestion, index: number) => (
    <View key={index} style={styles.questionContainer}>
      <Text style={styles.questionText}>
        {index + 1}. {question.question}
      </Text>
      {question.options.map((option, optionIndex) => (
        <TouchableOpacity
          key={optionIndex}
          style={[
            styles.optionButton,
            userAnswers[index] === optionIndex && styles.optionButtonSelected,
            showResults && question.correctAnswer === optionIndex && styles.optionButtonCorrect,
            showResults && userAnswers[index] === optionIndex && userAnswers[index] !== question.correctAnswer && styles.optionButtonIncorrect,
          ]}
          onPress={() => !showResults && handleAnswerSelect(index, optionIndex)}>
          <Text style={[
            styles.optionText,
            userAnswers[index] === optionIndex && styles.optionTextSelected,
          ]}>
            {String.fromCharCode(65 + optionIndex)}. {option}
          </Text>
        </TouchableOpacity>
      ))}
      {showResults && question.explanation && (
        <Text style={styles.explanationText}>
          Explanation: {question.explanation}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>AI Quiz Generator</Text>
        
        {renderConfigSection()}
        {renderQuizConfigSection()}
        
        {questions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quiz Questions</Text>
            {questions.map((question, index) => renderQuestion(question, index))}
            
            {!showResults && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitQuiz}>
                <Text style={styles.submitButtonText}>Submit Quiz</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  difficultyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  difficultyButtonSelected: {
    backgroundColor: '#007AFF',
  },
  difficultyText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  difficultyTextSelected: {
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  optionButton: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  optionButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f3ff',
  },
  optionButtonCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  optionButtonIncorrect: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  explanationText: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;