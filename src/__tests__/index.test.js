describe('Module Exports', () => {
  it('should export AIQuiz as default export', () => {
    const AIQuiz = require('../../index');
    expect(AIQuiz).toBeDefined();
    expect(typeof AIQuiz).toBe('function');
  });

  it('should export AIQuiz as named export', () => {
    const { AIQuiz } = require('../../index');
    expect(AIQuiz).toBeDefined();
    expect(typeof AIQuiz).toBe('function');
  });

  it('should export AzureOpenAI as named export', () => {
    const { AzureOpenAI } = require('../../index');
    expect(AzureOpenAI).toBeDefined();
    expect(typeof AzureOpenAI).toBe('function');
  });

  it('should have consistent exports', () => {
    const defaultExport = require('../../index');
    const { AIQuiz } = require('../../index');
    expect(defaultExport).toBe(AIQuiz);
  });
});