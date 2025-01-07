module.exports = {
  root: true,
  extends: '@react-native',
  "rules": {
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        "args": "none"
      }
    ],
  }
};
