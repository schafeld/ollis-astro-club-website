import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  common: {
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  },
};

const meta = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Story />
        </ThemeProvider>
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
