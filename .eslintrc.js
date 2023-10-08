module.exports = {
    root: true,
    extends: ['react-app', 'plugin:prettier/recommended', 'prettier'],
    plugins: ['prettier'],
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
            rules: {
                '@typescript-eslint/no-shadow': ['error'],
                'no-shadow': 'off',
                'no-undef': 'off',
                'no-unused-vars': 'off',
                'prettier/prettier': 'error',
            },
        },
    ],
};
