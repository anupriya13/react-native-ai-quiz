const AzureOpenAI = require('../AzureOpenAI');
const axios = require('axios');

jest.mock('axios');
const mockedAxios = axios;

describe('AzureOpenAI', () => {
  let azureOpenAI;
  
  const mockConfig = {
    endpoint: 'https://test-resource.openai.azure.com',
    apiKey: 'test-api-key',
    deploymentName: 'gpt-35-turbo',
    apiVersion: '2024-02-15-preview'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock for axios  
    const mockClient = {
      post: jest.fn().mockResolvedValue({})
    };
    mockedAxios.create.mockReturnValue(mockClient);
    azureOpenAI = new AzureOpenAI(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with valid config', () => {
      expect(azureOpenAI.endpoint).toBe(mockConfig.endpoint);
      expect(azureOpenAI.apiKey).toBe(mockConfig.apiKey);
      expect(azureOpenAI.deploymentName).toBe(mockConfig.deploymentName);
      expect(azureOpenAI.apiVersion).toBe(mockConfig.apiVersion);
    });

    it('should throw error when endpoint is missing', () => {
      expect(() => {
        new AzureOpenAI({ apiKey: 'test-key' });
      }).toThrow('Azure OpenAI endpoint and API key are required');
    });

    it('should throw error when API key is missing', () => {
      expect(() => {
        new AzureOpenAI({ endpoint: 'https://test.com' });
      }).toThrow('Azure OpenAI endpoint and API key are required');
    });

    it('should use default values for optional config', () => {
      const minimalConfig = {
        endpoint: 'https://test.com',
        apiKey: 'test-key'
      };
      const client = new AzureOpenAI(minimalConfig);
      
      expect(client.deploymentName).toBe('gpt-35-turbo');
      expect(client.apiVersion).toBe('2024-02-15-preview');
    });
  });

  describe('generateQuiz', () => {
    const mockQuizResponse = {
      data: {
        choices: [{
          message: {
            content: JSON.stringify({
              quiz: {
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
                  }
                ]
              }
            })
          }
        }]
      }
    };

    beforeEach(() => {
      // Reset to default success mock for this describe block
      const mockClient = {
        post: jest.fn().mockResolvedValue(mockQuizResponse)
      };
      mockedAxios.create.mockReturnValue(mockClient);
    });

    it('should generate quiz successfully', async () => {
      const quiz = await azureOpenAI.generateQuiz('JavaScript', 'medium', 1);
      
      expect(quiz).toHaveProperty('topic', 'JavaScript');
      expect(quiz).toHaveProperty('difficulty', 'medium');
      expect(quiz.questions).toHaveLength(1);
      expect(quiz.questions[0]).toHaveProperty('question');
      expect(quiz.questions[0]).toHaveProperty('options');
      expect(quiz.questions[0]).toHaveProperty('correctAnswer');
      expect(quiz.questions[0]).toHaveProperty('explanation');
    });

    it('should handle API errors gracefully', async () => {
      const mockClient = {
        post: jest.fn().mockRejectedValue(new Error('API Error'))
      };
      mockedAxios.create.mockReturnValue(mockClient);
      const azureOpenAIWithError = new AzureOpenAI(mockConfig);
      
      await expect(azureOpenAIWithError.generateQuiz('JavaScript')).rejects.toThrow('Failed to generate quiz');
    });

    it('should validate quiz response structure', async () => {
      const invalidResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({ invalid: 'structure' })
            }
          }]
        }
      };
      
      const mockClient = {
        post: jest.fn().mockResolvedValue(invalidResponse)
      };
      mockedAxios.create.mockReturnValue(mockClient);
      const azureOpenAIWithInvalid = new AzureOpenAI(mockConfig);
      
      await expect(azureOpenAIWithInvalid.generateQuiz('JavaScript')).rejects.toThrow('Failed to parse quiz response');
    });
  });

  describe('createQuizPrompt', () => {
    it('should create proper prompt with all parameters', () => {
      const prompt = azureOpenAI.createQuizPrompt('JavaScript', 'hard', 10);
      
      expect(prompt).toContain('JavaScript');
      expect(prompt).toContain('hard');
      expect(prompt).toContain('10');
      expect(prompt).toContain('JSON format');
    });
  });

  describe('parseQuizResponse', () => {
    const validQuizJson = JSON.stringify({
      quiz: {
        topic: 'Test',
        difficulty: 'easy',
        questions: [{
          id: 1,
          question: 'Test question?',
          options: { A: 'A', B: 'B', C: 'C', D: 'D' },
          correctAnswer: 'A',
          explanation: 'Test explanation'
        }]
      }
    });

    it('should parse valid JSON response', () => {
      const result = azureOpenAI.parseQuizResponse(validQuizJson);
      
      expect(result).toHaveProperty('topic', 'Test');
      expect(result.questions).toHaveLength(1);
    });

    it('should handle markdown code blocks', () => {
      const wrappedJson = `\`\`\`json\n${validQuizJson}\n\`\`\``;
      const result = azureOpenAI.parseQuizResponse(wrappedJson);
      
      expect(result).toHaveProperty('topic', 'Test');
    });

    it('should throw error for invalid JSON', () => {
      expect(() => {
        azureOpenAI.parseQuizResponse('invalid json');
      }).toThrow('Failed to parse quiz response');
    });

    it('should validate question structure', () => {
      const invalidQuiz = JSON.stringify({
        quiz: {
          questions: [{
            id: 1,
            question: 'Test?',
            // missing required fields
          }]
        }
      });
      
      expect(() => {
        azureOpenAI.parseQuizResponse(invalidQuiz);
      }).toThrow('Invalid question structure');
    });

    it('should validate options structure', () => {
      const invalidOptions = JSON.stringify({
        quiz: {
          questions: [{
            id: 1,
            question: 'Test?',
            options: { A: 'A' }, // missing B, C, D
            correctAnswer: 'A',
            explanation: 'Test'
          }]
        }
      });
      
      expect(() => {
        azureOpenAI.parseQuizResponse(invalidOptions);
      }).toThrow('Invalid options structure');
    });

    it('should validate correct answer', () => {
      const invalidAnswer = JSON.stringify({
        quiz: {
          questions: [{
            id: 1,
            question: 'Test?',
            options: { A: 'A', B: 'B', C: 'C', D: 'D' },
            correctAnswer: 'E', // invalid
            explanation: 'Test'
          }]
        }
      });
      
      expect(() => {
        azureOpenAI.parseQuizResponse(invalidAnswer);
      }).toThrow('Invalid correct answer');
    });
  });
});