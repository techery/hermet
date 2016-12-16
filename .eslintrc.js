module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "impliedStrict": true
    }
  },
  "rules": {
    "one-var": ["error", "never"],
    "array-bracket-spacing": ["error", "never"],
    "block-scoped-var": "error",
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "camelcase": ["error", {"properties": "never"}],
    "computed-property-spacing": ["error", "never"],
    "curly": "error",
    "eol-last": "error",
    "eqeqeq": ["error", "smart"],
    "max-depth": ["warn", 3],
    "max-len": ["error", 120],
    "max-statements": ["error", 15],
    "max-statements-per-line": ["error", { "max": 1 }],
    "new-cap": "error",
    "no-extend-native": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-trailing-spaces": "error",
    "no-unused-vars": "warn",
    "no-use-before-define": ["error", "nofunc"],
    "object-curly-spacing": ["error", "never"],
    "quotes": ["error", "single", "avoid-escape"],
    "semi": ["error", "always"],
    "keyword-spacing": ["error", {"before": true, "after": true}],
    "space-unary-ops": "error",

    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "strict": ["error", "global"],
    "valid-typeof": "error",
    "use-isnan": "error",
    "no-unsafe-negation": "error",
    "no-unsafe-finally": "error",
    "no-unreachable": "error",
    "no-sparse-arrays": "error",
    "no-obj-calls": "error",
    "no-irregular-whitespace": "error",
    "no-func-assign": "error",
    "no-extra-semi": "error",
    "no-extra-boolean-cast": "error",
    "no-duplicate-case": "error",
    "no-dupe-keys": "error",
    "no-dupe-args": "error",

    "array-callback-return": "error",
    "default-case": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-eval": "error",
    "no-fallthrough": ["error", { "commentPattern": "no break" }],
    "no-implied-eval": "error",
    "no-loop-func": "error",
    "no-magic-numbers": ["warn", {
      "ignoreArrayIndexes": true,
      "detectObjects": true,
      "enforceConst": true,
      "ignore": [1, 0]
    }],
    "no-multi-spaces": "error",
    "no-new-func": "error",
    "no-sequences": "error",
    "no-unused-expressions": "error",
    "no-useless-call": "error",
    "no-with": "error",
    "comma-spacing": ["error", { "before": false, "after": true }],
    "func-call-spacing": ["error", "never"],
    "newline-before-return": "error",
    "newline-after-var": ["error", "always"],
    "no-whitespace-before-property": "error",
    "no-nested-ternary": "error",
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "no-class-assign": "error",
    "no-const-assign": "error",
    "no-dupe-class-members": "error",
    "no-duplicate-imports": ["error", { "includeExports": true }],
    "require-yield": "error",
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
    "no-array-constructor": "error",
    "no-throw-literal": "error",

    "require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": false,
        "ArrowFunctionExpression": false
      }
    }]
  }
};
