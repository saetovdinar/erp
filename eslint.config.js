// ESLint (плоский конфиг, ESLint 9).
//
// Правила скопированы из @jitsi/eslint-config 6.0.4 — того же набора, что действует
// в mint-client (.eslintrc.js) и taxi/driver_app/.eslintrc.js, — без установки самой
// зависимости. Форматирование — @stylistic (та же мажорная версия, что в зависимостях
// jitsi-конфига).
//
// Отличия от буквы jitsi-конфига, продиктованные ESLint 9 и стеком проекта:
//   - форматрирующие правила ядра → их @stylistic-аналоги (camelcase остался
//     ядром, no-spaced-func → function-call-spacing);
//   - удалённые из ядра правила заменены: no-negated-in-lhs → no-unsafe-negation,
//     no-native-reassign → no-global-assign; no-catch-shadow покрыт no-shadow;
//   - react/jsx-first-prop-newline и react/require-extension исключены —
//     этих правил больше нет в eslint-plugin-react 7.37;
//   - no-void выключен: fire-and-forget промисы (`void promise`) — рабочий
//     приём (в typescript-eslint 8 правила no-void больше нет);
//   - jsdoc-группа выключена (как и в taxi/driver_app): valid-jsdoc/require-jsdoc
//     удалены из ESLint 9;
//   - правило 'strict' выключено: исходники парсятся как модули;
//   - react/react-in-jsx-scope и react/jsx-uses-react выключены — babel
//     automatic JSX runtime; react/prop-types выключен — типы даёт TypeScript.

const stylistic = require('@stylistic/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const reactPlugin = require('eslint-plugin-react');
const tsSortKeys = require('eslint-plugin-typescript-sort-keys');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = [
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/*.d.ts',
            '**/.zcode/**'
        ]
    },

    // ===== База для всех файлов (копия @jitsi/eslint-config/js) =====
    {
        files: [ '**/*.{js,cjs,mjs,ts,tsx}' ],
        languageOptions: {
            ecmaVersion: 2024,
            globals: { ...globals.node,
                ...globals.browser },
            sourceType: 'module'
        },
        plugins: {
            '@stylistic': stylistic,
            'import': importPlugin
        },
        rules: {
            // Possible Errors group
            'no-cond-assign': 2,

            // no-console — правка mint-client поверх jitsi-конфига
            'no-console': [ 'error', { allow: [ 'error', 'warn' ] } ],
            'no-constant-condition': 2,
            'no-control-regex': 2,
            'no-debugger': 2,
            'no-dupe-args': 2,
            'no-dupe-keys': 2,
            'no-duplicate-case': 2,
            'no-empty': 2,
            'no-empty-character-class': 2,
            'no-ex-assign': 2,
            'no-extra-boolean-cast': 2,
            '@stylistic/no-extra-parens': [ 'error', 'all', {
                ignoreJSX: 'multi-line',
                nestedBinaryExpressions: false
            } ],
            '@stylistic/no-extra-semi': 2,
            'no-func-assign': 2,
            'no-inner-declarations': 2,
            'no-invalid-regexp': 2,
            'no-irregular-whitespace': 2,
            'no-obj-calls': 2,
            'no-regex-spaces': 2,
            'no-sparse-arrays': 2,
            'no-unexpected-multiline': 2,
            'no-unreachable': 2,
            'no-unsafe-finally': 2,
            'no-unsafe-negation': 2,
            'use-isnan': 2,
            'valid-typeof': 2,
            'no-unused-private-class-members': 2,
            'no-useless-backreference': 2,

            // Best Practices group
            'array-callback-return': 2,
            'curly': 2,
            'dot-location': [ 'error', 'property' ],
            'dot-notation': 2,
            'eqeqeq': 2,
            'guard-for-in': 2,
            'no-alert': 2,
            'no-caller': 2,
            'no-case-declarations': 2,
            'no-div-regex': 0,
            'no-else-return': 2,
            'no-empty-function': 2,
            'no-empty-pattern': 2,
            'no-eq-null': 2,
            'no-eval': 2,
            'no-extend-native': 2,
            'no-extra-bind': 2,
            'no-extra-label': 2,
            'no-fallthrough': 2,
            '@stylistic/no-floating-decimal': 2,
            'no-global-assign': 2,
            'no-implicit-coercion': 2,
            'no-implicit-globals': 2,
            'no-implied-eval': 2,
            'no-invalid-this': 2,
            'no-iterator': 2,
            'no-labels': 2,
            'no-lone-blocks': 2,
            'no-loop-func': 2,
            'no-magic-numbers': 0,
            '@stylistic/no-multi-spaces': 2,
            'no-multi-str': 2,
            'no-new': 2,
            'no-new-func': 2,
            'no-new-wrappers': 2,
            'no-octal': 2,
            'no-octal-escape': 2,
            'no-param-reassign': 2,
            'no-proto': 2,
            'no-redeclare': 2,
            'no-return-assign': 2,
            'no-script-url': 2,
            'no-self-assign': 2,
            'no-self-compare': 2,
            'no-sequences': 2,
            'no-throw-literal': 2,
            'no-unmodified-loop-condition': 2,
            'no-unused-expressions': [ 'error', {
                allowShortCircuit: true,
                allowTernary: true
            } ],
            'no-unused-labels': 2,
            'no-useless-call': 2,
            'no-useless-concat': 2,
            'no-useless-escape': 2,
            'no-useless-return': 2,
            'no-void': 0,
            'no-warning-comments': 0,
            'no-with': 2,
            'radix': 2,
            'vars-on-top': 2,
            'wrap-iife': [ 'error', 'inside' ],
            'yoda': 2,

            // Variables group
            'init-declarations': 0,
            'no-delete-var': 2,
            'no-label-var': 2,
            'no-shadow': 2,
            'no-shadow-restricted-names': 2,
            'no-undef': 2,
            'no-undef-init': 2,
            'no-undefined': 0,
            'no-unused-vars': [ 'error', { argsIgnorePattern: '^_' } ],
            'no-use-before-define': [ 'error', { functions: false } ],

            // Stylistic issues group (форматирование — @stylistic-аналоги правил jitsi)
            '@stylistic/array-bracket-spacing': [ 'error', 'always', { objectsInArrays: true } ],
            '@stylistic/block-spacing': [ 'error', 'always' ],
            '@stylistic/brace-style': 2,
            'camelcase': 2,
            '@stylistic/comma-dangle': 2,
            '@stylistic/comma-spacing': 2,
            '@stylistic/comma-style': 2,
            '@stylistic/computed-property-spacing': 2,
            'consistent-this': [ 'error', 'self' ],
            '@stylistic/eol-last': 2,
            'func-names': 0,
            'func-style': 0,
            'id-length': 0,
            '@stylistic/indent': [ 'error', 4, {
                CallExpression: { arguments: 'off' },
                FunctionDeclaration: { body: 1,
                    parameters: 2 },
                FunctionExpression: { parameters: 2 },
                MemberExpression: 'off',
                SwitchCase: 0
            } ],
            '@stylistic/key-spacing': 2,
            '@stylistic/keyword-spacing': 2,
            '@stylistic/linebreak-style': [ 'error', 'unix' ],
            '@stylistic/lines-around-comment': [ 'error', {
                allowBlockStart: true,
                allowObjectStart: true,
                beforeBlockComment: true,
                beforeLineComment: true
            } ],
            'max-depth': 2,
            'max-len': [ 'error', 120 ],
            'max-nested-callbacks': 2,
            'max-params': [ 'error', 4 ],
            'max-statements-per-line': 2,
            'multiline-ternary': 0,
            'new-cap': 2,
            '@stylistic/new-parens': 2,
            '@stylistic/newline-per-chained-call': 2,
            'no-array-constructor': 2,
            'no-bitwise': 2,
            'no-continue': 0,
            'no-inline-comments': 0,
            'no-lonely-if': 2,
            'no-mixed-operators': 2,
            '@stylistic/no-mixed-spaces-and-tabs': 2,
            '@stylistic/no-multiple-empty-lines': 2,
            'no-negated-condition': 2,
            'no-nested-ternary': 0,
            'no-new-object': 2,
            'no-plusplus': 0,
            '@stylistic/function-call-spacing': [ 'error', 'never' ],
            '@stylistic/no-tabs': 2,
            'no-ternary': 0,
            '@stylistic/no-trailing-spaces': 2,
            'no-underscore-dangle': 0,
            'no-unneeded-ternary': 2,
            '@stylistic/no-whitespace-before-property': 2,
            'object-curly-newline': 0,
            '@stylistic/object-curly-spacing': [ 'error', 'always' ],
            '@stylistic/object-property-newline': 2,
            'one-var': 0,
            'one-var-declaration-per-line': 0,
            'operator-assignment': 0,
            '@stylistic/operator-linebreak': [ 'error', 'before' ],
            '@stylistic/padded-blocks': 0,
            'quote-props': 0,
            '@stylistic/quotes': [ 'error', 'single' ],
            '@stylistic/semi': [ 'error', 'always' ],
            '@stylistic/semi-spacing': 2,
            'sort-vars': 2,
            '@stylistic/space-before-blocks': 2,
            '@stylistic/space-before-function-paren': [ 'error', {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always'
            } ],
            '@stylistic/space-in-parens': [ 'error', 'never' ],
            '@stylistic/space-infix-ops': 2,
            '@stylistic/space-unary-ops': 2,
            '@stylistic/spaced-comment': 2,
            'unicode-bom': 0,
            'wrap-regex': 0,
            'prefer-object-spread': 2,

            // ES6 group rules
            'arrow-body-style': [ 'error', 'as-needed', { requireReturnForObjectLiteral: true } ],
            '@stylistic/arrow-parens': [ 'error', 'as-needed' ],
            '@stylistic/arrow-spacing': 2,
            'constructor-super': 2,
            '@stylistic/generator-star-spacing': 2,
            'no-class-assign': 2,
            'no-confusing-arrow': 2,
            'no-const-assign': 2,
            'no-dupe-class-members': 2,
            'no-new-symbol': 2,
            'no-useless-computed-key': 2,
            'no-useless-constructor': 2,
            'no-useless-rename': 2,
            'no-var': 2,
            'object-shorthand': [ 'error', 'always', { avoidQuotes: true } ],
            'prefer-arrow-callback': [ 'error', { allowNamedFunctions: true } ],
            'prefer-const': 2,
            'prefer-rest-params': 2,
            'prefer-spread': 2,
            'prefer-template': 2,
            'require-yield': 2,
            '@stylistic/rest-spread-spacing': 2,
            'sort-imports': [ 'error', { ignoreDeclarationSort: true } ],
            '@stylistic/template-curly-spacing': 2,
            '@stylistic/yield-star-spacing': 2,
            'import/no-duplicates': 2,
            'import/order': [ 'error', {
                alphabetize: { order: 'asc' },
                groups: [ [ 'builtin', 'external' ], 'parent', 'sibling', 'index' ],
                'newlines-between': 'always'
            } ],
            'require-await': 2,
            'no-duplicate-imports': 2
        }
    },

    // recommended из typescript-eslint (область действия ограничена TS-файлами;
    // аналог extends plugin:@typescript-eslint/recommended в jitsi-конфиге)
    ...tseslint.configs.recommended.map(cfg => {
        return {
            ...cfg,
            files: [ '**/*.ts', '**/*.tsx' ]
        };
    }),

    // ===== TypeScript (копия @jitsi/eslint-config/typescript) =====
    {
        files: [ '**/*.ts', '**/*.tsx' ],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { project: true }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            'typescript-sort-keys': tsSortKeys
        },
        rules: {
            // Замены ядровых правил на @typescript-eslint
            '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
            '@stylistic/arrow-parens': [ 'error', 'as-needed' ],
            'brace-style': 0,
            '@stylistic/brace-style': [ 'error', '1tbs' ],
            'comma-dangle': 0,
            '@stylistic/comma-dangle': [ 'error', 'only-multiline' ],
            'dot-notation': 0,
            '@typescript-eslint/dot-notation': 2,
            'keyword-spacing': 0,
            '@stylistic/keyword-spacing': 2,
            'no-array-constructor': 0,
            '@typescript-eslint/no-array-constructor': 2,
            'no-dupe-class-members': 0,
            '@typescript-eslint/no-dupe-class-members': 2,
            'no-empty-function': 0,
            '@typescript-eslint/no-empty-function': 2,
            'no-extra-semi': 0,
            '@stylistic/no-extra-semi': 2,
            'no-implied-eval': 0,
            '@typescript-eslint/no-implied-eval': 2,
            'no-invalid-this': 0,
            '@typescript-eslint/no-invalid-this': 2,
            'no-loop-func': 0,
            '@typescript-eslint/no-loop-func': 2,
            'no-redeclare': 0,
            '@typescript-eslint/no-redeclare': 2,
            'no-shadow': 0,
            '@typescript-eslint/no-shadow': 2,
            'no-throw-literal': 0,
            '@typescript-eslint/only-throw-error': 2,
            'no-unused-expressions': 0,
            '@typescript-eslint/no-unused-expressions': [ 'error', {
                allowShortCircuit: true,
                allowTernary: true
            } ],
            'no-unused-vars': 0,
            '@typescript-eslint/no-unused-vars': [ 'error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrors: 'none',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                ignoreRestSiblings: true
            } ],
            'no-use-before-define': 0,
            '@typescript-eslint/no-use-before-define': [ 'error', { functions: false } ],
            'no-useless-constructor': 0,
            '@typescript-eslint/no-useless-constructor': 2,
            'object-curly-spacing': 0,
            '@stylistic/object-curly-spacing': [ 'error', 'always' ],
            'padding-line-between-statements': 0,
            '@stylistic/padding-line-between-statements': [ 'error',
                { blankLine: 'always',
                    prev: [ 'const', 'let', 'var' ],
                    next: '*' },
                { blankLine: 'any',
                    prev: [ 'const', 'let', 'var' ],
                    next: [ 'const', 'let', 'var' ] },
                { blankLine: 'always',
                    prev: '*',
                    next: 'return' }
            ],
            'quotes': 0,
            '@stylistic/quotes': [ 'error', 'single' ],
            'semi': 0,
            '@stylistic/semi': [ 'error', 'always' ],
            'space-before-blocks': 0,
            '@stylistic/space-before-blocks': 2,
            'space-before-function-paren': 0,
            '@stylistic/space-before-function-paren': [ 'error', {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always'
            } ],
            'space-infix-ops': 0,
            '@stylistic/space-infix-ops': 2,
            'no-undef': 0,
            'no-prototype-builtins': 0,

            // Правила typescript-eslint из jitsi
            '@typescript-eslint/ban-ts-comment': 0,
            '@stylistic/member-delimiter-style': [ 'error', {
                multiline: { delimiter: 'semi',
                    requireLast: true },
                singleline: { delimiter: 'semi',
                    requireLast: true }
            } ],
            '@typescript-eslint/method-signature-style': 2,
            '@typescript-eslint/no-confusing-non-null-assertion': 2,
            '@typescript-eslint/no-duplicate-enum-values': 2,
            '@typescript-eslint/no-explicit-any': 0,
            '@typescript-eslint/no-unnecessary-type-constraint': 2,
            '@typescript-eslint/prefer-as-const': 1,
            '@typescript-eslint/prefer-enum-initializers': 1,
            '@typescript-eslint/prefer-optional-chain': 1,
            '@typescript-eslint/naming-convention': [ 'error', {
                selector: 'interface',
                format: [ 'PascalCase' ],
                custom: { regex: '^I[A-Z]',
                    match: true }
            } ],
            '@typescript-eslint/no-empty-object-type': 0,
            '@stylistic/type-annotation-spacing': [ 'error', {
                before: true,
                after: true,
                overrides: { colon: { before: false,
                    after: true } }
            } ],
            'typescript-sort-keys/interface': 2,
            'typescript-sort-keys/string-enum': 2,
            '@stylistic/indent': [ 'error', 4, {
                CallExpression: { arguments: 'off' },
                FunctionDeclaration: { body: 1,
                    parameters: 2 },
                FunctionExpression: { parameters: 2 },
                MemberExpression: 'off',
                SwitchCase: 0
            } ],
            '@stylistic/jsx-equals-spacing': [ 'error', 'always' ],
            '@stylistic/jsx-closing-bracket-location': [ 'error', 'after-props' ],
            '@stylistic/jsx-quotes': [ 'error', 'prefer-single' ],
            'react/jsx-indent-props': 0,
            '@stylistic/jsx-indent-props': 0,
            '@stylistic/jsx-curly-spacing': [ 'error', 'always', {
                spacing: { objectLiterals: 'never' }
            } ],
            '@stylistic/quote-props': 0,
            '@stylistic/indent-binary-ops': 0,
            '@stylistic/no-multiple-empty-lines': [ 'error', { max: 2,
                maxEOF: 1,
                maxBOF: 1 } ],
            '@stylistic/padded-blocks': 0,
            '@stylistic/multiline-ternary': 0,
            '@stylistic/jsx-wrap-multilines': 0,
            '@stylistic/jsx-curly-brace-presence': 0,
            '@stylistic/jsx-curly-newline': 0,
            '@stylistic/jsx-function-call-newline': 0,
            '@stylistic/jsx-one-expression-per-line': 0,
            '@stylistic/jsx-tag-spacing': 0,
            '@stylistic/jsx-closing-tag-location': 0,
            '@stylistic/type-generic-spacing': 0,

            // Сортировка импортов и ключей
            'sort-imports': [ 'error', { ignoreDeclarationSort: true } ],
            'import/no-duplicates': 2,
            'import/order': [ 'error', {
                alphabetize: { order: 'asc' },
                groups: [ [ 'builtin', 'external' ], 'parent', 'sibling', 'index' ],
                'newlines-between': 'always'
            } ],
            'no-duplicate-imports': 2
        }
    },

    // ===== React/JSX (копия @jitsi/eslint-config/jsx + @jitsi/eslint-config/react) =====
    {
        files: [ '**/*.tsx', '**/*.jsx' ],
        languageOptions: {
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        plugins: {
            'react': reactPlugin
        },
        settings: {
            react: { version: 'detect' }
        },
        rules: {
            // jsx.js
            'jsx-quotes': [ 'error', 'prefer-single' ],
            'react/jsx-boolean-value': [ 'error', 'always' ],
            'react/jsx-closing-bracket-location': [ 'error', 'after-props' ],
            'react/jsx-curly-spacing': [ 'error', 'always', {
                spacing: { objectLiterals: 'never' }
            } ],
            'react/jsx-equals-spacing': [ 'error', 'always' ],
            'react/jsx-filename-extension': 0,
            'react/jsx-handler-names': [ 'error', {
                eventHandlerPrefix: '_on',
                eventHandlerPropPrefix: 'on'
            } ],
            'react/jsx-indent': [ 'error', 4 ],

            // 4 пробела у пропсов (в jitsi-конфиге правило для TS выключено;
            // здесь включено по AGENTS mint-client: отступ — 4 пробела)
            'react/jsx-indent-props': [ 'error', 4 ],
            'react/jsx-key': 2,
            'react/jsx-max-props-per-line': 2,
            'react/jsx-no-bind': 2,
            'react/jsx-no-comment-textnodes': 2,
            'react/jsx-no-duplicate-props': 2,
            'react/jsx-no-literals': 0,
            'react/jsx-no-target-blank': 2,
            'react/jsx-no-undef': 2,
            'react/jsx-pascal-case': 2,
            'react/jsx-sort-props': 2,
            'react/jsx-tag-spacing': [ 'error', { beforeSelfClosing: 'always' } ],
            'react/jsx-uses-vars': 2,
            'react/jsx-wrap-multilines': 2,

            // react.js
            'react/display-name': 0,
            'react/forbid-prop-types': 0,
            'react/no-danger': 2,
            'react/no-deprecated': 2,
            'react/no-did-mount-set-state': 2,
            'react/no-did-update-set-state': 2,
            'react/no-direct-mutation-state': 2,
            'react/no-find-dom-node': 2,
            'react/no-is-mounted': 2,
            'react/no-multi-comp': 2,
            'react/no-render-return-value': 2,
            'react/no-set-state': 0,
            'react/no-string-refs': 2,
            'react/no-unknown-property': 2,
            'react/prefer-es6-class': 2,
            'react/prefer-stateless-function': 0,
            'react/prop-types': 0,
            'react/react-in-jsx-scope': 0,
            'react/require-optimization': 0,
            'react/require-render-return': 2,
            'react/self-closing-comp': 2,
            'react/sort-comp': 0,
            'react/sort-prop-types': 2,
            'react/jsx-uses-react': 0
        }
    }
];
