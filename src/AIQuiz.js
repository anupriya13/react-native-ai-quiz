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
          <TouchableOpacity
            style={[
              styles.navButton, 
              buttonStyle,
              currentQuestionIndex === 0 && styles.disabledButton
            ]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <Text style={[
              styles.buttonText,
              currentQuestionIndex === 0 && styles.disabledButtonText
            ]}>
              Previous
            </Text>
          </TouchableOpacity>
          
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
      <ScrollView style={[styles.container, style]}>
        <Text style={styles.title}>Quiz Complete! 🎉</Text>
        <Text style={styles.scoreText}>
          Final Score: {results.score}/{results.total} ({results.percentage}%)
        </Text>
        
        <View style={styles.resultsSummary}>
          <Text style={styles.resultsSummaryTitle}>Quiz Summary</Text>
          <Text style={styles.resultsSummaryText}>
            Topic: {quiz.topic || topic}
          </Text>
          <Text style={styles.resultsSummaryText}>
            Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Text>
          <Text style={styles.resultsSummaryText}>
            Questions: {results.total}
          </Text>
        </View>

        <View style={styles.detailedResults}>
          <Text style={styles.detailedResultsTitle}>Detailed Results</Text>
          {results.detailed.map((result, index) => (
            <View key={result.questionId} style={styles.resultItem}>
              <Text style={styles.resultQuestionNumber}>
                Question {index + 1}
              </Text>
              <Text style={styles.resultQuestion}>
                {result.question}
              </Text>
              <View style={styles.resultAnswers}>
                <Text style={[
                  styles.resultAnswer,
                  result.isCorrect ? styles.correctAnswer : styles.incorrectAnswer
                ]}>
                  Your answer: {result.userAnswer || 'No answer'}
                  {result.isCorrect ? ' ✓' : ' ✗'}
                </Text>
                {!result.isCorrect && (
                  <Text style={styles.correctAnswerText}>
                    Correct answer: {result.correctAnswer}
                  </Text>
                )}
              </View>
              {result.explanation && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationText}>{result.explanation}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={[styles.button, buttonStyle]}
          onPress={resetQuiz}
        >
          <Text style={styles.buttonText}>Take Another Quiz</Text>
        </TouchableOpacity>
      </ScrollView>
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
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
  resultsSummary: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  resultsSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  resultsSummaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailedResults: {
    marginBottom: 20,
  },
  detailedResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultQuestionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  resultQuestion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  resultAnswers: {
    marginBottom: 10,
  },
  resultAnswer: {
    fontSize: 14,
    marginBottom: 5,
  },
  correctAnswer: {
    color: '#4CAF50',
  },
  incorrectAnswer: {
    color: '#f44336',
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});

module.exports = AIQuiz;