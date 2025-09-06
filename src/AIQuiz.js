const React = require('react');
const { useState, useEffect } = React;
const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} = require('react-native');
const AzureOpenAI = require('./AzureOpenAI');

const AIQuiz = ({
  azureConfig,
  topic,
  difficulty = 'medium',
  numberOfQuestions = 5,
  onQuizComplete,
  onQuizStart,
  style,
  questionStyle,
  optionStyle,
  selectedOptionStyle,
  correctOptionStyle,
  incorrectOptionStyle,
  buttonStyle,
  loadingStyle,
}) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [azureClient, setAzureClient] = useState(null);

  useEffect(() => {
    if (azureConfig) {
      try {
        const client = new AzureOpenAI(azureConfig);
        setAzureClient(client);
      } catch (err) {
        setError(`Configuration error: ${err.message}`);
      }
    }
  }, [azureConfig]);

  const generateQuiz = async () => {
    if (!azureClient) {
      setError('Azure OpenAI client not initialized');
      return;
    }

    if (!topic) {
      setError('Topic is required to generate quiz');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const generatedQuiz = await azureClient.generateQuiz(topic, difficulty, numberOfQuestions);
      setQuiz(generatedQuiz);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      
      if (onQuizStart) {
        onQuizStart(generatedQuiz);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    if (showResults) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    
    const results = calculateResults();
    if (onQuizComplete) {
      onQuizComplete(results);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    const detailed = quiz.questions.map((question) => {
      const userAnswer = selectedAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correct++;
      }
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const percentage = Math.round((correct / quiz.questions.length) * 100);
    
    return {
      score: correct,
      total: quiz.questions.length,
      percentage,
      detailed,
    };
  };

  const resetQuiz = () => {
    setQuiz(null);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setError(null);
  };

  const renderStartScreen = () => (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>AI Quiz Generator</Text>
      <Text style={styles.subtitle}>
        Topic: {topic || 'Not specified'}
      </Text>
      <Text style={styles.subtitle}>
        Difficulty: {difficulty} | Questions: {numberOfQuestions}
      </Text>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={generateQuiz}
        disabled={isLoading || !topic}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = () => {
    const question = quiz.questions[currentQuestionIndex];
    
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Text>
        
        <Text style={[styles.question, questionStyle]}>
          {question.question}
        </Text>
        
        <View style={styles.optionsContainer}>
          {Object.entries(question.options).map(([key, value]) => {
            const isSelected = selectedAnswers[question.id] === key;
            const isCorrect = question.correctAnswer === key;
            const showAnswer = showResults;
            
            let optionStyleToApply = [styles.option, optionStyle];
            
            if (showAnswer) {
              if (isCorrect) {
                optionStyleToApply.push(styles.correctOption, correctOptionStyle);
              } else if (isSelected && !isCorrect) {
                optionStyleToApply.push(styles.incorrectOption, incorrectOptionStyle);
              }
            } else if (isSelected) {
              optionStyleToApply.push(styles.selectedOption, selectedOptionStyle);
            }
            
            return (
              <TouchableOpacity
                key={key}
                style={optionStyleToApply}
                onPress={() => handleAnswerSelect(question.id, key)}
                disabled={showResults}
              >
                <Text style={styles.optionText}>
                  {key}. {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {showResults && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
        
        <View style={styles.navigationContainer}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, buttonStyle]}
              onPress={handlePreviousQuestion}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.navButton, buttonStyle]}
            onPress={handleNextQuestion}
            disabled={!selectedAnswers[question.id] && !showResults}
          >
            <Text style={styles.buttonText}>
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderResults = () => {
    const results = calculateResults();
    
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>Quiz Complete!</Text>
        <Text style={styles.scoreText}>
          Score: {results.score}/{results.total} ({results.percentage}%)
        </Text>
        
        <TouchableOpacity
          style={[styles.button, buttonStyle]}
          onPress={resetQuiz}
        >
          <Text style={styles.buttonText}>Take Another Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, loadingStyle]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Generating your quiz...</Text>
      </View>
    );
  }

  if (!quizStarted || !quiz) {
    return renderStartScreen();
  }

  if (showResults && currentQuestionIndex === quiz.questions.length - 1) {
    return renderResults();
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      {renderQuestion()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  incorrectOption: {
    borderColor: '#f44336',
    backgroundColor: '#ffeaea',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  explanationContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});

module.exports = AIQuiz;