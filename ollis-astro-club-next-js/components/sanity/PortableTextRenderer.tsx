import { PortableText, type PortableTextBlock } from 'next-sanity';

interface PortableTextRendererProps {
  value: PortableTextBlock[];
  className?: string;
}

export function PortableTextRenderer({ value, className = '' }: PortableTextRendererProps) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;

  return (
    <div className={`portable-text font-body space-y-4 ${className}`}>
      <PortableText value={value} />
    </div>
  );
}
