module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-param-reassign': 'off',
        'lines-between-class-members': 'off',
        'class-methods-use-this': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-cycle': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
};
