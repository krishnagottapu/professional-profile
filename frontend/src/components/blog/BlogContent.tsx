'use client';

import DOMPurify from 'dompurify';

interface Props {
  html: string;
}

export function BlogContent({ html }: Props) {
  const clean =
    typeof window !== 'undefined'
      ? DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
      : html;

  return (
    <article
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
