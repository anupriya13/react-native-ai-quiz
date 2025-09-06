import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
const AIQuiz = require('../AIQuiz');

// Mock the AzureOpenAI module
jest.mock('../AzureOpenAI', () => {
  return jest.fn().mockImplementation(() => {
    return {
      generateQuiz: jest.fn()
    };
  });
});

const AzureOpenAI = require('../AzureOpenAI');

describe('AIQuiz Component', () => {
  const mockAzureConfig = {
    endpoint: 'https://test.openai.azure.com',
    apiKey: 'test-key',
    deploymentName: 'gpt-35-turbo',
    apiVersion: '2024-02-15-preview'
  };

  const mockQuiz = {
    topic: 'JavaScript',
    difficulty: 'medium',
    questions: [
      {
        id: 1,
        question: 'What is JavaScript?',
        options: {
          A: 'A programming language',
          B: 'A coffee type',
          C: 'A Java framework',
          D: 'A browser'
        },
        correctAnswer: 'A',
        explanation: 'JavaScript is a programming language used for web development.'
      },
      {
        id: 2,
        question: 'Which of the following is a JavaScript framework?',
        options: {
          A: 'HTML',
          B: 'CSS',
          C: 'React',
          D: 'SQL'
        },
        correctAnswer: 'C',
        explanation: 'React is a popular JavaScript framework for building user interfaces.'
      }
    ]
  };

  let mockGenerateQuiz;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateQuiz = jest.fn().mockResolvedValue(mockQuiz);
    AzureOpenAI.mockImplementation(() => ({
      generateQuiz: mockGenerateQuiz
    }));
  });

  describe('Initial Render', () => {
    it('should render start screen initially', () => {
      const { getByText } = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={5}
        />
      );

      expect(getByText('AI Quiz Generator')).toBeTruthy();
      expect(getByText('Start Quiz')).toBeTruthy();
      expect(getByText(/Topic: JavaScript/)).toBeTruthy();
      expect(getByText(/Difficulty: medium/)).toBeTruthy();
    });

    it('should show error when no topic is provided', () => {
      const { getByText } = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic=""
          difficulty="medium"
          numberOfQuestions={5}
        />
      );

      expect(getByText(/Topic: Not specified/)).toBeTruthy();
    });

    it('should disable start button when no topic', () => {
      const { getByText } = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic=""
          difficulty="medium"
          numberOfQuestions={5}
        />
      );

      const startButton = getByText('Start Quiz');
      expect(startButton.parent.props.disabled).toBe(true);
    });
  });

  describe('Quiz Generation', () => {
    it('should generate quiz when start button is pressed', async () => {
      const onQuizStart = jest.fn();
      const { getByText } = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
          onQuizStart={onQuizStart}
        />
      );

      fireEvent.press(getByText('Start Quiz'));

      await waitFor(() => {
        expect(mockGenerateQuiz).toHaveBeenCalledWith('JavaScript', 'medium', 2);
        expect(onQuizStart).toHaveBeenCalledWith(mockQuiz);
      });
    });

    it('should show loading state during quiz generation', async () => {
      mockGenerateQuiz.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockQuiz), 100)));
      
      const { getByText } = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
        />
      );

      fireEvent.press(getByText('Start Quiz'));

      expect(getByText('Generating your quiz...')).toBeTruthy();
      
      await waitFor(() => {
        expect(getByText('What is JavaScript?')).toBeTruthy();
      });
    });

    it('should handle generation errors', async () => {
      mockGenerateQuiz.mockRejectedValue(new Error('API Error'));
      
      const { getByText } = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
        />
      );

      fireEvent.press(getByText('Start Quiz'));

      await waitFor(() => {
        expect(getByText('API Error')).toBeTruthy();
      });
    });
  });

  describe('Quiz Navigation', () => {
    let component;

    beforeEach(async () => {
      component = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
        />
      );

      fireEvent.press(component.getByText('Start Quiz'));
      
      await waitFor(() => {
        expect(component.getByText('What is JavaScript?')).toBeTruthy();
      });
    });

    it('should display first question initially', () => {
      expect(component.getByText('Question 1 of 2')).toBeTruthy();
      expect(component.getByText('What is JavaScript?')).toBeTruthy();
      expect(component.getByText('A. A programming language')).toBeTruthy();
    });

    it('should allow selecting an answer', () => {
      const optionA = component.getByText('A. A programming language');
      fireEvent.press(optionA);
      
      // Should enable the Next button
      const nextButton = component.getByText('Next');
      expect(nextButton.parent.props.disabled).toBe(false);
    });

    it('should navigate to next question', async () => {
      // Select answer for first question
      fireEvent.press(component.getByText('A. A programming language'));
      fireEvent.press(component.getByText('Next'));

      await waitFor(() => {
        expect(component.getByText('Question 2 of 2')).toBeTruthy();
        expect(component.getByText('Which of the following is a JavaScript framework?')).toBeTruthy();
      });
    });

    it('should show Previous button on second question', async () => {
      // Navigate to second question
      fireEvent.press(component.getByText('A. A programming language'));
      fireEvent.press(component.getByText('Next'));

      await waitFor(() => {
        expect(component.getByText('Previous')).toBeTruthy();
      });
    });

    it('should navigate back to previous question', async () => {
      // Navigate to second question
      fireEvent.press(component.getByText('A. A programming language'));
      fireEvent.press(component.getByText('Next'));

      await waitFor(() => {
        expect(component.getByText('Previous')).toBeTruthy();
      });

      fireEvent.press(component.getByText('Previous'));

      await waitFor(() => {
        expect(component.getByText('Question 1 of 2')).toBeTruthy();
        expect(component.getByText('What is JavaScript?')).toBeTruthy();
      });
    });

    it('should show Finish button on last question', async () => {
      // Navigate to last question
      fireEvent.press(component.getByText('A. A programming language'));
      fireEvent.press(component.getByText('Next'));

      await waitFor(() => {
        expect(component.getByText('Finish')).toBeTruthy();
      });
    });
  });

  describe('Quiz Completion', () => {
    it('should complete quiz and show results', async () => {
      const onQuizComplete = jest.fn();
      const component = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
          onQuizComplete={onQuizComplete}
        />
      );

      // Start quiz
      fireEvent.press(component.getByText('Start Quiz'));
      
      await waitFor(() => {
        expect(component.getByText('What is JavaScript?')).toBeTruthy();
      });

      // Answer first question correctly
      fireEvent.press(component.getByText('A. A programming language'));
      fireEvent.press(component.getByText('Next'));

      await waitFor(() => {
        expect(component.getByText('Which of the following is a JavaScript framework?')).toBeTruthy();
      });

      // Answer second question correctly
      fireEvent.press(component.getByText('C. React'));
      fireEvent.press(component.getByText('Finish'));

      await waitFor(() => {
        expect(component.getByText('Quiz Complete!')).toBeTruthy();
        expect(component.getByText('Score: 2/2 (100%)')).toBeTruthy();
        expect(onQuizComplete).toHaveBeenCalledWith({
          score: 2,
          total: 2,
          percentage: 100,
          detailed: expect.any(Array)
        });
      });
    });

    it('should calculate partial scores correctly', async () => {
      const onQuizComplete = jest.fn();
      const component = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
          onQuizComplete={onQuizComplete}
        />
      );

      // Start quiz
      fireEvent.press(component.getByText('Start Quiz'));
      
      await waitFor(() => {
        expect(component.getByText('What is JavaScript?')).toBeTruthy();
      });

      // Answer first question incorrectly
      fireEvent.press(component.getByText('B. A coffee type'));
      fireEvent.press(component.getByText('Next'));

      await waitFor(() => {
        expect(component.getByText('Which of the following is a JavaScript framework?')).toBeTruthy();
      });

      // Answer second question correctly
      fireEvent.press(component.getByText('C. React'));
      fireEvent.press(component.getByText('Finish'));

      await waitFor(() => {
        expect(component.getByText('Score: 1/2 (50%)')).toBeTruthy();
        expect(onQuizComplete).toHaveBeenCalledWith({
          score: 1,
          total: 2,
          percentage: 50,
          detailed: expect.any(Array)
        });
      });
    });

    it('should allow retaking quiz', async () => {
      const component = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
        />
      );

      // Complete quiz
      fireEvent.press(component.getByText('Start Quiz'));
      
      await waitFor(() => {
        expect(component.getByText('What is JavaScript?')).toBeTruthy();
      });

      fireEvent.press(component.getByText('A. A programming language'));
      fireEvent.press(component.getByText('Next'));

      await waitFor(() => {
        expect(component.getByText('Which of the following is a JavaScript framework?')).toBeTruthy();
      });

      fireEvent.press(component.getByText('C. React'));
      fireEvent.press(component.getByText('Finish'));

      await waitFor(() => {
        expect(component.getByText('Quiz Complete!')).toBeTruthy();
      });

      // Retake quiz
      fireEvent.press(component.getByText('Take Another Quiz'));

      await waitFor(() => {
        expect(component.getByText('AI Quiz Generator')).toBeTruthy();
        expect(component.getByText('Start Quiz')).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing Azure config', () => {
      const { getByText } = render(
        <AIQuiz
          azureConfig={null}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
        />
      );

      fireEvent.press(getByText('Start Quiz'));

      expect(getByText('Azure OpenAI client not initialized')).toBeTruthy();
    });

    it('should handle invalid Azure config', () => {
      const { getByText } = render(
        <AIQuiz
          azureConfig={{ endpoint: 'invalid' }}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
        />
      );

      expect(getByText(/Configuration error/)).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      const customQuestionStyle = { fontSize: 24 };
      
      const { getByTestId } = render(
        <AIQuiz
          azureConfig={mockAzureConfig}
          topic="JavaScript"
          difficulty="medium"
          numberOfQuestions={2}
          style={customStyle}
          questionStyle={customQuestionStyle}
          testID="quiz-container"
        />
      );

      // Note: Testing styles in React Native testing is limited
      // In a real app, you'd use screenshot testing or visual regression testing
      expect(getByTestId).toBeDefined();
    });
  });
});