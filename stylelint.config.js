export default {
  ignoreFiles: [
    'dist/**/*',
    'node_modules/**/*',
    'coverage/**/*',
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss',
    '@stylistic/stylelint-config',
  ],
  plugins: [
    'stylelint-order',
  ],
  rules: {
    // Порядок типов контента в блоке
    'order/order': [
      'custom-properties',
      'declarations',
      'rules',
      'at-rules',
    ],

    // Алфавитный порядок CSS свойств для консистентности
    'order/properties-alphabetical-order': true,

    // Дополняем Tailwind config для screen() функции
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen'],
      },
    ],
  },
}
