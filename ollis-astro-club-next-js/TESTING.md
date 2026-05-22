# Storybook and Testing

## Storybook

### Running Storybook in Development

To run Storybook in development mode:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006` where you can view and interact with all UI components.

### Building Storybook for Production

To build Storybook as a static site:

```bash
npm run build-storybook
```

This builds Storybook and moves it to `public/storybook-static`, making it accessible at `/storybook-static/` when the Next.js app is running.

### Public Access

Once Storybook is built, it's available at:
- Development: `http://localhost:3000/storybook-static/`
- Production: `https://yourdomain.com/storybook-static/`

### Component Stories

Stories are located alongside components:
- `components/ui/Button.stories.tsx`
- `components/ui/Card.stories.tsx`
- `components/ui/Badge.stories.tsx`
- `components/ui/ThemeToggle.stories.tsx`

### Creating New Stories

When creating a new UI component, add a corresponding `.stories.tsx` file:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta = {
  title: 'UI/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for props
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

## Unit Testing

### Running Tests

Run all unit tests once:
```bash
npm test
```

Run tests in watch mode (re-runs on file changes):
```bash
npm run test:watch
```

Run tests with UI (interactive test viewer):
```bash
npm run test:ui
```

### Test Files

Test files are located alongside components with `.test.tsx` extension:
- `components/ui/Button.test.tsx`
- `components/ui/Card.test.tsx`
- `components/ui/Badge.test.tsx`

### Writing Tests

Tests use Vitest and React Testing Library. Example:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent>Content</YourComponent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('handles props', () => {
    render(<YourComponent variant="primary">Button</YourComponent>);
    const element = screen.getByRole('button');
    expect(element).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Test user behavior**, not implementation details
2. **Query by accessibility roles** when possible: `getByRole`, `getByLabelText`
3. **Use semantic queries**: `getByText`, `getByAltText`
4. **Avoid** querying by class names or test IDs unless necessary
5. **Write descriptive test names** that explain what is being tested

### Vitest Configuration

Tests are configured in `vitest.config.ts` with two projects:
- **unit**: Standard component unit tests (jsdom environment)
- **storybook**: Story-based browser tests using Playwright

## Storybook Features

### Theme Switching

Storybook includes a theme switcher addon that allows you to preview components in both light and dark modes. Use the theme toggle in the toolbar to switch between themes.

### Accessibility Testing

The a11y addon is enabled and will show accessibility violations in the "Accessibility" panel. Current setting is `'todo'` which shows violations but doesn't fail builds.

### Automated Documentation

Components with proper TypeScript types and JSDoc comments will have their documentation automatically generated in Storybook.

## Continuous Integration

To run tests in CI/CD:

```bash
# Run tests
npm test

# Build Storybook
npm run build-storybook
```

Consider adding these commands to your CI pipeline to ensure components and tests remain functional.
