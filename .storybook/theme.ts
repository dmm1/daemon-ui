import { create } from '@storybook/theming'

export default create({
  base: 'dark',
  brandTitle: 'ghost-ui',
  brandUrl: 'https://github.com/dmm1/ghost-ui',

  colorPrimary: '#07edc7',
  colorSecondary: '#0ae5f5',

  appBg: '#11161d',
  appContentBg: '#0e1217',
  appBorderColor: 'rgba(7, 237, 199, 0.12)',
  appBorderRadius: 2,

  textColor: '#96a8c0',
  textMutedColor: '#56595d',

  barTextColor: '#96a8c0',
  barSelectedColor: '#07edc7',
  barBg: '#0e1217',

  inputBg: '#11161d',
  inputBorder: 'rgba(7, 237, 199, 0.12)',
  inputTextColor: '#96a8c0',
  inputBorderRadius: 2,

  fontBase: "'JetBrains Mono', monospace",
  fontCode: "'JetBrains Mono', monospace",
})
