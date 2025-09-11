export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizConfig {
  topic: string;
  numberOfQuestions: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionType?: 'multiple-choice' | 'true-false' | 'mixed';
}

export interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
  apiVersion?: string;
}

export interface GenerateQuizOptions extends QuizConfig {
  azureConfig: AzureOpenAIConfig;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  topic: string;
  totalQuestions: number;
}

export interface APIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}