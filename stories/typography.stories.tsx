import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Lead,
  Code,
  InlineCode,
  BlockQuote,
} from '../src/components/typography'

const meta: Meta = {
  title: 'Components/Typography',
  tags: ['autodocs'],
}
export default meta

export const Heading1: StoryObj = {
  render: () => <H1>Heading 1</H1>,
}
export const Heading2: StoryObj = {
  render: () => <H2>Heading 2</H2>,
}
export const Heading3: StoryObj = {
  render: () => <H3>Heading 3</H3>,
}
export const Heading4: StoryObj = {
  render: () => <H4>Heading 4</H4>,
}
export const Heading5: StoryObj = {
  render: () => <H5>Heading 5</H5>,
}
export const Heading6: StoryObj = {
  render: () => <H6>Heading 6</H6>,
}
export const Paragraph: StoryObj = {
  render: () => (
    <P>
      Market analysis indicates a bullish trend with volume confirmation across
      major pairs.
    </P>
  ),
}
export const LeadText: StoryObj = {
  render: () => (
    <Lead>Autonomous trading powered by deep learning signals.</Lead>
  ),
}
export const CodeBlock: StoryObj = {
  render: () => <Code>{'const signal = await analyze(pair)'}</Code>,
}
export const InlineCodeExample: StoryObj = {
  render: () => (
    <P>
      Use the <InlineCode>kill-switch</InlineCode> to halt all trades.
    </P>
  ),
}
export const Quote: StoryObj = {
  render: () => (
    <BlockQuote>The trend is your friend until it bends at the end.</BlockQuote>
  ),
}
