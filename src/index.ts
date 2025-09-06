import { AzureOpenAIHandler } from './AzureOpenAIHandler';
import { 
  QuizQuestion, 
  QuizConfig, 
  AzureOpenAIConfig, 
  GenerateQuizOptions, 
  QuizResponse 
} from './types';

export class ReactNativeAIQuiz {
  private azureHandler: AzureOpenAIHandler | null = null;

  /**
   * Initialize the quiz generator with Azure OpenAI configuration
   */
  initialize(config: AzureOpenAIConfig): void {
    this.azureHandler = new AzureOpenAIHandler(config);
  }

  /**
   * Generate quiz questions based on the provided configuration
   */
  async generateQuiz(options: GenerateQuizOptions): Promise<QuizResponse>;
  async generateQuiz(config: QuizConfig): Promise<QuizResponse>;
  async generateQuiz(
    configOrOptions: QuizConfig | GenerateQuizOptions
  ): Promise<QuizResponse> {
    let azureHandler: AzureOpenAIHandler;
    let quizConfig: QuizConfig;

    // Handle both initialization patterns
    if ('azureConfig' in configOrOptions) {
      // Inline configuration
      azureHandler = new AzureOpenAIHandler(configOrOptions.azureConfig);
      quizConfig = {
        topic: configOrOptions.topic,
        numberOfQuestions: configOrOptions.numberOfQuestions,
        difficulty: configOrOptions.difficulty,
        questionType: configOrOptions.questionType
      };
    } else {
      // Use pre-initialized handler
      if (!this.azureHandler) {
        throw new Error('ReactNativeAIQuiz must be initialized with Azure OpenAI configuration before generating quizzes');
      }
      azureHandler = this.azureHandler;
      quizConfig = configOrOptions;
    }

    try {
      const questions = await azureHandler.generateQuiz(quizConfig);
      
      return {
        questions,
        topic: quizConfig.topic,
        totalQuestions: questions.length
      };
    } catch (error) {
      throw new Error(`Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test the connection to Azure OpenAI
   */
  async testConnection(): Promise<boolean> {
    if (!this.azureHandler) {
      throw new Error('ReactNativeAIQuiz must be initialized before testing connection');
    }
    
    return this.azureHandler.testConnection();
  }

  /**
   * Validate a quiz question structure
   */
  static validateQuestion(question: QuizQuestion): boolean {
    return (
      typeof question.question === 'string' &&
      question.question.length > 0 &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every(option => typeof option === 'string' && option.length > 0) &&
      typeof question.correctAnswer === 'number' &&
      question.correctAnswer >= 0 &&
      question.correctAnswer < 4
    );
  }

  /**
   * Shuffle quiz questions array
   */
  static shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Calculate quiz score
   */
  static calculateScore(
    questions: QuizQuestion[], 
    userAnswers: number[]
  ): { score: number; percentage: number; correct: number; total: number } {
    if (questions.length !== userAnswers.length) {
      throw new Error('Number of questions and answers must match');
    }

    const correct = questions.reduce((count, question, index) => {
      return question.correctAnswer === userAnswers[index] ? count + 1 : count;
    }, 0);

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      score: correct,
      percentage,
      correct,
      total
    };
  }
}

// Create a default instance for convenience
export const AIQuiz = new ReactNativeAIQuiz();

// Export types and classes
export * from './types';
export { AzureOpenAIHandler } from './AzureOpenAIHandler';

// Default export for easier importing
export default ReactNativeAIQuiz;