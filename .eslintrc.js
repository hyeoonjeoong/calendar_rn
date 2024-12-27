module.exports = {
  root: true,
  extends: '@react-native',
  "rules": {
    '@typescript-eslint/no-explicit-any': 'error',
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        "args": "none"
      }
    ],
  }
};
