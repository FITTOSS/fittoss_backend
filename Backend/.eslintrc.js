module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "off",
    "no-console": "off",
    "spaced-comment": "off",
    "no-else-return": "off",
    "import/no-cycle": "off",
    "prefer-default-export": "off",
    "consistent-return": "off",
    "import/prefer-default-export": "off",
    camelcase: "off",
    "no-underscore-dangle": "off",
    "no-return-await": "off",
  },
};
