// css、less 等样式文件格式校验配置
module.exports = {
  customSyntax: 'postcss-less', // stylelint v14 后不在内置 less 等处理，需自行配置
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order', // 书写顺序
  ],
  rules: {
    'no-empty-source': null, // 取消空文件校验
    // 禁止低优先级的选择器出现在高优先级的选择器之后。
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['/^global$/'],
      },
    ],
    'selector-class-pattern': null,
    'alpha-value-notation': null,
    'color-function-notation': 'legacy',
    'keyframes-name-pattern': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
  },
};
