import type { PageData, MetaData, Source } from 'fumadocs-core/source';
import type { ReactNode } from 'react';

type MDXContent = (props: { components?: Record<string, unknown> }) => ReactNode;

interface DocPageData extends PageData {
  body: MDXContent;
  toc: Array<{ title: string; url: string; depth: number }>;
  structuredData: unknown;
}

declare module 'fumadocs-mdx:collections/server' {
  export const docs: {
    toFumadocsSource: () => Source<{
      pageData: DocPageData;
      metaData: MetaData;
    }>;
  };
}
