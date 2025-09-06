import AzureOpenAI from './AzureOpenAI.js';

/**
 * AI Quiz Generator - Main module for generating quiz questions using Azure OpenAI
 */
class AIQuiz {
  /**
   * Generate quiz questions based on a theme
   * @param {string} theme - The theme or topic for the quiz questions
   * @param {number} [count=1] - Number of questions to generate
   * @param {Object} [options] - Additional options for quiz generation
   * @param {string} [options.difficulty] - Difficulty level (easy, medium, hard)
   * @param {string} [options.language] - Language for the quiz (default: English)
   * @returns {Promise<Object>} Quiz data with questions and options
   */
  static async generateQuiz(theme, count = 1, options = {}) {
    if (!theme || typeof theme !== 'string') {
      throw new Error('Theme is required and must be a string');
    }

    if (!Number.isInteger(count) || count < 1 || count > 50) {
      throw new Error('Count must be an integer between 1 and 50');
    }

    const difficulty = options.difficulty || 'medium';
    const language = options.language || 'English';

    // Create the prompt for Azure OpenAI
    const prompt = this._createPrompt(theme, count, difficulty, language);

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert quiz generator. Generate high-quality, educational quiz questions with one correct answer and three plausible incorrect options. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await AzureOpenAI.makeRequest(messages, {
        temperature: 0.7,
        maxTokens: count * 300 // Roughly 300 tokens per question
      });

      // Extract the content from the response
      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from Azure OpenAI');
      }

      // Parse the JSON response
      let quizData;
      try {
        quizData = JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON from the response if it contains additional text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          quizData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error(`Failed to parse JSON response: ${parseError.message}`);
        }
      }

      // Validate the response format
      this._validateQuizData(quizData);

      return quizData;
    } catch (error) {
      if (error.message.includes('Azure OpenAI')) {
        throw error; // Re-throw Azure OpenAI specific errors
      }
      throw new Error(`Quiz generation failed: ${error.message}`);
    }
  }

  /**
   * Create a prompt for the AI based on the given parameters
   * @private
   * @param {string} theme - The theme or topic
   * @param {number} count - Number of questions
   * @param {string} difficulty - Difficulty level
   * @param {string} language - Language for the quiz
   * @returns {string} The formatted prompt
   */
  static _createPrompt(theme, count, difficulty, language) {
    return `Generate ${count} multiple-choice quiz question${count > 1 ? 's' : ''} about "${theme}" in ${language}.

Requirements:
- Difficulty level: ${difficulty}
- Each question should have exactly 4 options
- Only 1 option should be correct (isCorrect: true)
- The other 3 options should be plausible but incorrect (isCorrect: false)
- Questions should be educational and well-researched
- Avoid obvious or trick questions

Return the response in this exact JSON format:
{
  "quiz": [
    {
      "question": "Your question here?",
      "options": [
        { "text": "Correct answer", "isCorrect": true },
        { "text": "Wrong answer 1", "isCorrect": false },
        { "text": "Wrong answer 2", "isCorrect": false },
        { "text": "Wrong answer 3", "isCorrect": false }
      ]
    }
  ]
}

Generate exactly ${count} question${count > 1 ? 's' : ''} following this format.`;
  }

  /**
   * Validate the quiz data structure
   * @private
   * @param {Object} quizData - The quiz data to validate
   * @throws {Error} If the data structure is invalid
   */
  static _validateQuizData(quizData) {
    if (!quizData || typeof quizData !== 'object') {
      throw new Error('Invalid quiz data: must be an object');
    }

    if (!Array.isArray(quizData.quiz)) {
      throw new Error('Invalid quiz data: quiz property must be an array');
    }

    quizData.quiz.forEach((question, index) => {
      if (!question.question || typeof question.question !== 'string') {
        throw new Error(`Invalid question at index ${index}: question must be a string`);
      }

      if (!Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error(`Invalid question at index ${index}: must have exactly 4 options`);
      }

      let correctCount = 0;
      question.options.forEach((option, optionIndex) => {
        if (!option.text || typeof option.text !== 'string') {
          throw new Error(`Invalid option at question ${index}, option ${optionIndex}: text must be a string`);
        }

        if (typeof option.isCorrect !== 'boolean') {
          throw new Error(`Invalid option at question ${index}, option ${optionIndex}: isCorrect must be a boolean`);
        }

        if (option.isCorrect) {
          correctCount++;
        }
      });

      if (correctCount !== 1) {
        throw new Error(`Invalid question at index ${index}: must have exactly 1 correct answer, found ${correctCount}`);
      }
    });
  }

  /**
   * Get a random quiz question from a pre-generated quiz
   * @param {Object} quizData - Previously generated quiz data
   * @returns {Object} A random question from the quiz
   */
  static getRandomQuestion(quizData) {
    if (!quizData || !Array.isArray(quizData.quiz) || quizData.quiz.length === 0) {
      throw new Error('Invalid or empty quiz data');
    }

    const randomIndex = Math.floor(Math.random() * quizData.quiz.length);
    return quizData.quiz[randomIndex];
  }

  /**
   * Shuffle the options of a question to randomize the order
   * @param {Object} question - The question object to shuffle
   * @returns {Object} The question with shuffled options
   */
  static shuffleOptions(question) {
    if (!question || !Array.isArray(question.options)) {
      throw new Error('Invalid question format');
    }

    const shuffledQuestion = { ...question };
    const options = [...question.options];
    
    // Fisher-Yates shuffle algorithm
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    shuffledQuestion.options = options;
    return shuffledQuestion;
  }
}

export default AIQuiz;