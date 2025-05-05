import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import typescriptEslint from 'typescript-eslint';

export default [
    ...typescriptEslint.configs.recommended,
    {
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        plugins: {
            react: eslintPluginReact,
            prettier: eslintPluginPrettier,
        },

        ignores: ['build', 'node_modules'],
    },
];
