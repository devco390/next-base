import { Story, Meta } from "@storybook/react/types-6-0";
import UserList from ".";

export default {
  title: "UserList",
  component: UserList,
} as Meta;

const Template = (args: any) => <UserList {...args}></UserList>;

export const Default: Story<any> = Template.bind({});
Default.args = {};