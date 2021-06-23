import { Story, Meta } from "@storybook/react/types-6-0";
import Header from ".";

export default {
  title: "Header",
  component: Header,
} as Meta;

const Template = (args: any) => <Header {...args}></Header>;

export const Default: Story<any> = Template.bind({});
Default.args = {};