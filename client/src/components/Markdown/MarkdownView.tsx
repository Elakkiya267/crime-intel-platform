import React from 'react';

// Minimal markdown renderer to avoid adding heavy dependencies.
// Supports: **bold**, _italic_, and basic headings and lists as plain text.
export default function MarkdownView({ markdown }: { markdown: string }) {
  // For production, replace with react-markdown + sanitization.
  // Here we do a safe rendering by treating markdown as text.
  return (
    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
      {markdown}
    </pre>
  );
}

