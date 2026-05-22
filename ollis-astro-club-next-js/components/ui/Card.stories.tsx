import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rotate: {
      control: 'boolean',
      description: 'Enable slight rotation on hover',
    },
    children: {
      control: 'text',
      description: 'Card content',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h3 className="text-xl font-heading mb-2">Card Title</h3>
        <p className="text-base">
          This is a card with some content. It has the hand-drawn design system with wobbly borders
          and hard offset shadows.
        </p>
      </>
    ),
  },
};

export const WithRotate: Story = {
  args: {
    rotate: true,
    children: (
      <>
        <h3 className="text-xl font-heading mb-2">Rotating Card</h3>
        <p className="text-base">Hover over this card to see the rotation effect!</p>
      </>
    ),
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <>
        <h3 className="text-xl font-heading mb-2">Card with Long Content</h3>
        <p className="text-base mb-2">
          This card contains a lot of content to demonstrate how the card component handles longer
          text. The card should expand to fit its content while maintaining the design system
          aesthetic.
        </p>
        <p className="text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </>
    ),
  },
};
