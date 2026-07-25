import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: 'ghost-ui',
        url: '/',
      }}
      links={[
        { text: 'GitHub', url: 'https://github.com/dmm1/ghost-ui' },
        { text: 'npm', url: 'https://www.npmjs.com/package/ghost-ui' },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
