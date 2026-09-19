import { useEffect, useState, type ComponentType } from 'react';
import { MDXProvider } from '@mdx-js/react';

const mdxModules = import.meta.glob('@/resources/**/*.mdx');

const components = {
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} target="_blank" rel="noreferrer" />
  ),
};

export default function MdxGuide({ path }: { path: string }) {
  const [Content, setContent] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const importer = mdxModules[`/src/resources/${path}`] || mdxModules[`@/resources/${path}`] || mdxModules[path];
    if (!importer) { setContent(null); setLoading(false); return; }
    importer().then((mod: any) => {
      if (!cancelled) setContent(() => mod.default);
    }).catch(() => {
      if (!cancelled) setContent(null);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [path]);

  if (loading) return <div className="animate-pulse space-y-3"><div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-white/10"/><div className="h-4 rounded bg-gray-200 dark:bg-white/10"/><div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-white/10"/></div>;
  if (!Content) return <p className="text-sm text-gray-500">Guide content not found.</p>;

  return (
    <article className="prose max-w-none text-left dark:prose-invert prose-headings:font-bold prose-p:my-2 prose-li:my-0.5 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
      <MDXProvider components={components}><Content components={components} /></MDXProvider>
    </article>
  );
}
