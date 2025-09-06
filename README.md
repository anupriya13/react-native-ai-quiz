# react-native-ai-quiz

**Cross-platform React Native module that generates AI-powered quiz questions dynamically using Azure OpenAI.**

---

## Features

* Generate dynamic multiple-choice quiz questions from any theme or topic.
* Returns JSON with 1 correct option and 3 plausible wrong options.
* Cross-platform compatible: iOS, Android, Windows (via React Native).
* Easy-to-use JS API for developers.
* Fully extensible for difficulty levels, multiple languages, and explanations.

---

## Installation

```bash
npm install react-native-ai-quiz
```

---

## Configuration

Before using the module, set your **Azure OpenAI API key and endpoint**:

```js
import AzureOpenAI from 'react-native-ai-quiz/src/AzureOpenAI';

AzureOpenAI.setConfig({
  apiKey: 'YOUR_AZURE_OPENAI_KEY',
  endpoint: 'YOUR_AZURE_OPENAI_ENDPOINT'
});
```

---

## Usage

### Generate a Single Quiz Question

```js
import { AIQuiz } from 'react-native-ai-quiz';

async function loadQuiz() {
  const theme = "help user learn English";
  const count = 1;

  const quizData = await AIQuiz.generateQuiz(theme, count);

  console.log(quizData.quiz[0].question);
  quizData.quiz[0].options.forEach(option => console.log(option.text));
}

loadQuiz();
```

### Generate Multiple Quiz Questions

```js
const quizData = await AIQuiz.generateQuiz("quiz me on history class 4", 10);

quizData.quiz.forEach((q, index) => {
  console.log(`${index + 1}. ${q.question}`);
  q.options.forEach(o => console.log(`- ${o.text}`));
});
```

---

## JSON Output Format

The AI returns questions in the following JSON structure:

```json
{
  "quiz": [
    {
      "question": "What is the meaning of 'gregarious'?",
      "options": [
        { "text": "Sociable and outgoing", "isCorrect": true },
        { "text": "Shy and reserved", "isCorrect": false },
        { "text": "Angry or irritable", "isCorrect": false },
        { "text": "Lazy or slow", "isCorrect": false }
      ]
    }
  ]
}
```

---

## Example App

A simple React Native example is included in the `example/` folder:

* Calls `AIQuiz.generateQuiz()` with a theme and question count.
* Displays questions and options in a FlatList.
* Demonstrates parsing the AI JSON response and rendering dynamically.

---

## Development

* Uses **Axios** for Azure OpenAI requests.
* Fully compatible with React Native 0.70+.
* Supports cross-platform deployment (iOS, Android, Windows).
* Well-commented for easy maintenance and extension.

---

## Future Enhancements

* Support for difficulty levels: easy, medium, hard.
* Multiple languages: English, Vietnamese, Spanish, etc.
* AI-generated explanations for correct answers.
* Offline caching of previously generated quizzes.
* Scoring, timers, and gamification features.

---

## License

MIT License
