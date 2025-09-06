import axios from 'axios';

/**
 * Azure OpenAI configuration and API client
 */
class AzureOpenAI {
  constructor() {
    this.apiKey = null;
    this.endpoint = null;
    this.apiVersion = '2023-05-15';
    this.deploymentName = 'gpt-3.5-turbo'; // Default deployment
  }

  /**
   * Set Azure OpenAI configuration
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - Azure OpenAI API key
   * @param {string} config.endpoint - Azure OpenAI endpoint URL
   * @param {string} [config.apiVersion] - API version (optional)
   * @param {string} [config.deploymentName] - Deployment name (optional)
   */
  setConfig(config) {
    if (!config.apiKey || !config.endpoint) {
      throw new Error('Both apiKey and endpoint are required for Azure OpenAI configuration');
    }

    if (!config.endpoint.startsWith('https://')) {
      throw new Error('Azure OpenAI endpoint must start with https://');
    }

    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint.replace(/\/$/, ''); // Remove trailing slash
    this.apiVersion = config.apiVersion || this.apiVersion;
    this.deploymentName = config.deploymentName || this.deploymentName;
  }

  /**
   * Check if the Azure OpenAI client is properly configured
   * @returns {boolean} True if configured, false otherwise
   */
  isConfigured() {
    return this.apiKey && this.endpoint;
  }

  /**
   * Make a request to Azure OpenAI API
   * @param {Array} messages - Array of message objects for the chat completion
   * @param {Object} [options] - Additional options for the request
   * @returns {Promise<Object>} The API response
   */
  async makeRequest(messages, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Azure OpenAI is not configured. Please call setConfig() first.');
    }

    const url = `${this.endpoint}/openai/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;
    
    const requestData = {
      messages,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      ...options
    };

    try {
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        timeout: 30000, // 30 seconds timeout
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`Azure OpenAI API Error: ${error.response.status} - ${error.response.data?.error?.message || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('Azure OpenAI API Error: No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Azure OpenAI API Error: ${error.message}`);
      }
    }
  }

  /**
   * Get current configuration (without sensitive data)
   * @returns {Object} Current configuration
   */
  getConfig() {
    return {
      endpoint: this.endpoint,
      apiVersion: this.apiVersion,
      deploymentName: this.deploymentName,
      isConfigured: this.isConfigured()
    };
  }
}

// Create a singleton instance
const azureOpenAI = new AzureOpenAI();

export default azureOpenAI;