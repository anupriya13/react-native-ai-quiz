// Mock React Native modules
jest.mock('react-native', () => {
  return {
    StyleSheet: {
      create: jest.fn((styles) => styles),
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    ScrollView: 'ScrollView',
    TextInput: 'TextInput',
    ActivityIndicator: 'ActivityIndicator',
    SafeAreaView: 'SafeAreaView',
    StatusBar: 'StatusBar',
    Alert: {
      alert: jest.fn(),
    },
  };
});

// Mock axios for API calls
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
}));

// Global test timeout
jest.setTimeout(30000);