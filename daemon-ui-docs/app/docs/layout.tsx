import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: 'daemon-ui',
        url: '/',
      }}
      links={[
        { text: 'GitHub', url: 'https://github.com/dmm1/daemon-ui' },
        { text: 'npm', url: 'https://www.npmjs.com/package/@dmm1/daemon-ui' },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
