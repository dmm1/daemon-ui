import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold font-mono tracking-tight">
          daemon-ui
        </h1>
        <p className="text-xl text-fd-muted-foreground max-w-xl mx-auto">
          Dark HUD terminal-style component library for React 19.
          Built with Tailwind CSS 4, CVA, and Motion.
        </p>
        <p className="text-sm text-fd-muted-foreground font-mono">
          The shadcn/ui for hackers.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/docs"
          className="inline-flex items-center justify-center px-6 py-3 font-mono text-sm uppercase tracking-wider border border-fd-primary text-fd-primary hover:bg-fd-primary hover:text-fd-primary-foreground transition-colors"
        >
          Get Started
        </Link>
        <a
          href="https://github.com/dmm1/daemon-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 font-mono text-sm uppercase tracking-wider border border-fd-border text-fd-foreground hover:border-fd-primary hover:text-fd-primary transition-colors"
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
