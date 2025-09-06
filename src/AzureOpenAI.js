const axios = require('axios');

class AzureOpenAI {
  constructor(config) {
    if (!config.endpoint || !config.apiKey) {
      throw new Error('Azure OpenAI endpoint and API key are required');
    }
    
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.deploymentName = config.deploymentName || 'gpt-35-turbo';
    this.apiVersion = config.apiVersion || '2024-02-15-preview';
    
    this.client = axios.create({
      baseURL: `${this.endpoint}/openai/deployments/${this.deploymentName}`,
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      },
      timeout: 30000,
    });
  }

  async generateQuiz(topic, difficulty = 'medium', numberOfQuestions = 5) {
    try {
      const prompt = this.createQuizPrompt(topic, difficulty, numberOfQuestions);
      
      const response = await this.client.post(`/chat/completions?api-version=${this.apiVersion}`, {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates multiple-choice quiz questions. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const content = response.data.choices[0].message.content;
      return this.parseQuizResponse(content);
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
  }

  createQuizPrompt(topic, difficulty, numberOfQuestions) {
    return `Create ${numberOfQuestions} multiple-choice quiz questions about "${topic}" with ${difficulty} difficulty level.

Requirements:
- Each question should have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include brief explanations for the correct answers
- Return the response in the following JSON format:

{
  "quiz": {
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "questions": [
      {
        "id": 1,
        "question": "Question text here?",
        "options": {
          "A": "Option A text",
          "B": "Option B text", 
          "C": "Option C text",
          "D": "Option D text"
        },
        "correctAnswer": "A",
        "explanation": "Brief explanation of why this is correct"
      }
    ]
  }
}

Ensure the JSON is valid and properly formatted.`;
  }

  parseQuizResponse(content) {
    try {
      // Clean up the response to extract JSON
      let jsonStr = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsedData = JSON.parse(jsonStr);
      
      // Validate the structure
      if (!parsedData.quiz || !parsedData.quiz.questions || !Array.isArray(parsedData.quiz.questions)) {
        throw new Error('Invalid quiz structure in response');
      }
      
      // Validate each question
      parsedData.quiz.questions.forEach((question, index) => {
        if (!question.question || !question.options || !question.correctAnswer || !question.explanation) {
          throw new Error(`Invalid question structure at index ${index}`);
        }
        
        if (!question.options.A || !question.options.B || !question.options.C || !question.options.D) {
          throw new Error(`Invalid options structure at question ${index + 1}`);
        }
        
        if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
          throw new Error(`Invalid correct answer at question ${index + 1}`);
        }
      });
      
      return parsedData.quiz;
    } catch (error) {
      console.error('Error parsing quiz response:', error);
      throw new Error(`Failed to parse quiz response: ${error.message}`);
    }
  }
}

module.exports = AzureOpenAI;