module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": ["airbnb-base", "prettier"],
    "plugins": ["@typescript-eslint","prettier"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "prettier/prettier" : "error",
        "class-methods-use-this":"off",
        "no-param-reassign":"off",
        "camelcase":"off",
        "no-unused-vars":["error",{"argsIgnorePattern":"next"}],
    }

};