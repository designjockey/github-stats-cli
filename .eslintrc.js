module.exports = {
  extends: "standard",
  env: {
    node: true,
  },
  overrides: [
    {
      files: [
        'tests/**/*.test.js'
      ],
      env: {
        jest: true
      }
    }
  ],
  rules: {
    semi: 0,
    'comma-dangle': 0
  }
};
