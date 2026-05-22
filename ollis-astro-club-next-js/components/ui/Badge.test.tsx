import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    expect(screen.getByText('Default Badge')).toBeInTheDocument();
  });

  it('renders with accent variant', () => {
    render(<Badge variant="accent">Accent Badge</Badge>);
    expect(screen.getByText('Accent Badge')).toBeInTheDocument();
  });

  it('renders with blue variant', () => {
    render(<Badge variant="blue">Blue Badge</Badge>);
    expect(screen.getByText('Blue Badge')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Custom Badge</Badge>);
    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-badge');
  });

  it('renders children correctly', () => {
    render(<Badge>Test Content</Badge>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies wobbly-sm border styles', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('wobbly-sm');
  });
});
