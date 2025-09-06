import axios, { AxiosResponse } from 'axios';
import { AzureOpenAIConfig, QuizConfig, APIResponse, QuizQuestion } from './types';

export class AzureOpenAIHandler {
  private config: AzureOpenAIConfig;
  private baseURL: string;

  constructor(config: AzureOpenAIConfig) {
    this.config = config;
    this.baseURL = `${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions`;
  }

  private createPrompt(quizConfig: QuizConfig): string {
    const { topic, numberOfQuestions, difficulty = 'medium', questionType = 'multiple-choice' } = quizConfig;
    
    return `Generate ${numberOfQuestions} ${difficulty} ${questionType} quiz questions about "${topic}".

    For each question, provide:
    1. A clear question
    2. Four answer options (A, B, C, D)
    3. The correct answer index (0-3)
    4. A brief explanation of why the answer is correct

    Format your response as valid JSON with this structure:
    {
      "questions": [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation here",
          "difficulty": "${difficulty}"
        }
      ]
    }

    Ensure all questions are relevant to the topic "${topic}" and appropriate for ${difficulty} difficulty level.`;
  }

  async generateQuiz(quizConfig: QuizConfig): Promise<QuizQuestion[]> {
    try {
      const prompt = this.createPrompt(quizConfig);
      
      const response: AxiosResponse<APIResponse> = await axios.post(
        this.baseURL,
        {
          messages: [
            {
              role: 'system',
              content: 'You are an expert quiz creator. Generate educational quiz questions in valid JSON format only. Do not include any text outside the JSON structure.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.9
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.config.apiKey
          },
          params: {
            'api-version': this.config.apiVersion || '2023-12-01-preview'
          }
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from Azure OpenAI');
      }

      // Parse the JSON response
      const parsedContent = JSON.parse(content.trim());
      
      if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        throw new Error('Invalid response format from Azure OpenAI');
      }

      return parsedContent.questions as QuizQuestion[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Azure OpenAI API Error: ${error.response?.data?.error?.message || error.message}`);
      }
      if (error instanceof SyntaxError) {
        throw new Error('Failed to parse response from Azure OpenAI. The response was not valid JSON.');
      }
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.post(
        this.baseURL,
        {
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.config.apiKey
          },
          params: {
            'api-version': this.config.apiVersion || '2023-12-01-preview'
          }
        }
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}