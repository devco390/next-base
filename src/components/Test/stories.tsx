import { Story, Meta } from '@storybook/react/types-6-0'
import Test from '.'

export default {
  title: 'Test',
  component: Test
} as Meta

const Template = (args: any) => <Test {...args}></Test>

export const Default: Story<any> = Template.bind({})
Default.args = {}
