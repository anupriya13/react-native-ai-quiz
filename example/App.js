/**
 * Sample React Native App demonstrating react-native-ai-quiz
 * https://github.com/facebook/react-native
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import {AIQuiz, AzureOpenAI} from 'react-native-ai-quiz';

const App = () => {
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [theme, setTheme] = useState('help user learn English');
  const [questionCount, setQuestionCount] = useState('1');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    // Check if already configured
    setConfigured(AzureOpenAI.isConfigured());
  }, []);

  const configureAzureOpenAI = () => {
    if (!apiKey.trim() || !endpoint.trim()) {
      Alert.alert('Error', 'Please enter both API Key and Endpoint');
      return;
    }

    try {
      AzureOpenAI.setConfig({
        apiKey: apiKey.trim(),
        endpoint: endpoint.trim(),
      });
      setConfigured(true);
      Alert.alert('Success', 'Azure OpenAI configured successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const generateQuiz = async () => {
    if (!configured) {
      Alert.alert('Error', 'Please configure Azure OpenAI first');
      return;
    }

    if (!theme.trim()) {
      Alert.alert('Error', 'Please enter a theme');
      return;
    }

    const count = parseInt(questionCount, 10);
    if (isNaN(count) || count < 1 || count > 10) {
      Alert.alert('Error', 'Question count must be between 1 and 10');
      return;
    }

    setLoading(true);
    setQuizData(null);

    try {
      const quiz = await AIQuiz.generateQuiz(theme, count);
      setQuizData(quiz);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = ({item, index}) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionNumber}>Question {index + 1}</Text>
      <Text style={styles.questionText}>{item.question}</Text>
      
      {item.options.map((option, optionIndex) => (
        <View 
          key={optionIndex} 
          style={[
            styles.optionContainer,
            option.isCorrect && styles.correctOption
          ]}
        >
          <Text style={[
            styles.optionText,
            option.isCorrect && styles.correctOptionText
          ]}>
            {String.fromCharCode(65 + optionIndex)}. {option.text}
          </Text>
          {option.isCorrect && (
            <Text style={styles.correctIndicator}>✓ Correct</Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Quiz Generator</Text>
          <Text style={styles.subtitle}>Powered by Azure OpenAI</Text>
        </View>

        {!configured && (
          <View style={styles.configSection}>
            <Text style={styles.sectionTitle}>Configure Azure OpenAI</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Azure OpenAI API Key"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
            />
            
            <TextInput
              style={styles.input}
              placeholder="Azure OpenAI Endpoint"
              value={endpoint}
              onChangeText={setEndpoint}
            />
            
            <TouchableOpacity style={styles.button} onPress={configureAzureOpenAI}>
              <Text style={styles.buttonText}>Configure</Text>
            </TouchableOpacity>
          </View>
        )}

        {configured && (
          <View style={styles.quizSection}>
            <Text style={styles.sectionTitle}>Generate Quiz</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Theme (e.g., help user learn English)"
              value={theme}
              onChangeText={setTheme}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Number of questions (1-10)"
              value={questionCount}
              onChangeText={setQuestionCount}
              keyboardType="numeric"
            />
            
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={generateQuiz}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Generate Quiz</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {quizData && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Quiz Results</Text>
            <FlatList
              data={quizData.quiz}
              renderItem={renderQuestion}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  configSection: {
    marginBottom: 30,
  },
  quizSection: {
    marginBottom: 30,
  },
  resultsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  optionContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  correctOption: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  correctOptionText: {
    fontWeight: 'bold',
    color: '#155724',
  },
  correctIndicator: {
    fontSize: 12,
    color: '#155724',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default App;