// eslint 配置文件，规则 0：禁用 off、1：警告 error、2：错误 warn
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  ignorePatterns: [
    '**/coverage',
    '**/dist',
    '**/build',
    '**/node_modules',
    '**/.next',
    '!.stylelintrc.*',
  ],
  extends: [
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module', // script 或者 module
    // allowImportExportEverywhere: false, // 设置为 true，import 和 export 声明 可以出现在文件的任务位置，否则只能出现在顶部
    ecmaFeatures: {
      globalReturn: false, // 设置为 true，当 sourceType 为 script 时，允许全局 return
    },
  },
  plugins: ['import', 'react', 'react-hooks'],
  rules: {
    // prettier.config可以加到这里
    'prettier/prettier': [
      'warn',
      {
        tailwindConfig: './tailwind.config.cjs',
        plugins: ['prettier-plugin-tailwindcss'], // Tailwind 类名排序
        singleQuote: true, // 使用单引号
        endOfLine: 'auto',
      },
    ],
    'react/self-closing-comp': [
      //自闭合标签
      'error',
      {
        component: true,
        html: false,
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'sibling',
          'parent',
          'index',
          'unknown',
        ],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: './index.module.less',
            group: 'unknown',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: [],
        alphabetize: { order: 'asc', caseInsensitive: true },
        // warnOnUnassignedImports: false,
      },
    ],
    'import/no-duplicates': 'error',
  },
};
