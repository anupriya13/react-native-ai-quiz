const React = require('react');
const { useState } = React;
const {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} = require('react-native');
const AIQuiz = require('../index');

const App = () => {
  const [azureConfig, setAzureConfig] = useState({
    endpoint: '',
    apiKey: '',
    deploymentName: 'gpt-35-turbo', // or gpt-4
    apiVersion: '2024-02-15-preview',
  });
  const [topic, setTopic] = useState('JavaScript Programming');
  const [difficulty, setDifficulty] = useState('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizStart = (quiz) => {
    console.log('Quiz started:', quiz);
    Alert.alert('Quiz Started', `${quiz.questions.length} questions on ${quiz.topic}`);
  };

  const handleQuizComplete = (results) => {
    console.log('Quiz completed:', results);
    Alert.alert(
      'Quiz Complete!',
      `You scored ${results.score}/${results.total} (${results.percentage}%)`,
      [
        {
          text: 'OK',
          onPress: () => setShowQuiz(false),
        },
      ]
    );
  };

  const startQuiz = () => {
    if (!azureConfig.endpoint || !azureConfig.apiKey) {
      Alert.alert('Configuration Required', 'Please enter your Azure OpenAI endpoint and API key');
      return;
    }
    if (!topic.trim()) {
      Alert.alert('Topic Required', 'Please enter a topic for the quiz');
      return;
    }
    setShowQuiz(true);
  };

  if (showQuiz) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <AIQuiz
          azureConfig={azureConfig}
          topic={topic}
          difficulty={difficulty}
          numberOfQuestions={numberOfQuestions}
          onQuizStart={handleQuizStart}
          onQuizComplete={handleQuizComplete}
          style={styles.quizContainer}
          questionStyle={styles.customQuestion}
          buttonStyle={styles.customButton}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.configContainer}>
        <Text style={styles.title}>React Native AI Quiz</Text>
        <Text style={styles.subtitle}>Configure your Azure OpenAI settings</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Azure OpenAI Endpoint *</Text>
          <TextInput
            style={styles.input}
            placeholder="https://your-resource.openai.azure.com"
            value={azureConfig.endpoint}
            onChangeText={(text) => setAzureConfig(prev => ({ ...prev, endpoint: text }))}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>API Key *</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Azure OpenAI API key"
            value={azureConfig.apiKey}
            onChangeText={(text) => setAzureConfig(prev => ({ ...prev, apiKey: text }))}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Deployment Name</Text>
          <TextInput
            style={styles.input}
            placeholder="gpt-35-turbo"
            value={azureConfig.deploymentName}
            onChangeText={(text) => setAzureConfig(prev => ({ ...prev, deploymentName: text }))}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quiz Topic *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., JavaScript Programming, History, Science"
            value={topic}
            onChangeText={setTopic}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Difficulty</Text>
            <View style={styles.pickerContainer}>
              {['easy', 'medium', 'hard'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.pickerOption,
                    difficulty === level && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      difficulty === level && styles.pickerTextSelected,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Number of Questions</Text>
            <View style={styles.pickerContainer}>
              {[3, 5, 10].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.pickerOption,
                    numberOfQuestions === num && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setNumberOfQuestions(num)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      numberOfQuestions === num && styles.pickerTextSelected,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          * Required fields. This example uses Azure OpenAI. Make sure you have a valid Azure OpenAI resource with a deployed model.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  configContainer: {
    flex: 1,
    padding: 20,
  },
  quizContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  pickerOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  pickerOptionSelected: {
    backgroundColor: '#007AFF',
  },
  pickerText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  pickerTextSelected: {
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
  customQuestion: {
    fontSize: 20,
    color: '#2c3e50',
  },
  customButton: {
    backgroundColor: '#3498db',
  },
});

module.exports = App;