import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ResourceLayout from '@/components/resources/ResourceLayout';
import ResourceSidebar from '@/components/resources/ResourceSidebar';
import ResourceBreadcrumb from '@/components/resources/ResourceBreadcrumb';
import MdxGuide from '@/components/resources/MdxGuide';
import ResourceCard from '@/components/resources/ResourceCard';
import { getGeneralCategoryById, getSortedGeneralCategories, type Resource } from '@/data/resources';

export default function ResourceCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? getGeneralCategoryById(categoryId) : undefined;
  const [query, setQuery] = useState('');
  const resources = useMemo(() => category?.resources.filter((r: Resource) =>
    !query || [r.title, r.description, ...(r.tags ?? [])].some(v => v?.toLowerCase().includes(query.toLowerCase()))
  ) ?? [], [category, query]);

  if (!category) return <Navigate to="/resources" replace />;
  const categories = getSortedGeneralCategories();
  const index = categories.findIndex(c => c.id === category.id);
  const prev = categories[index - 1], next = categories[index + 1];

  return <ResourceLayout><main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:flex-row">
    <ResourceSidebar className="md:block" />
    <section className="min-w-0 flex-1">
      <ResourceBreadcrumb crumbs={[{label:'Resources',to:'/resources'},{label:'General',to:'/resources'},{label:category.title}]} className="mb-5"/>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">{category.title}</h1><p className="mt-2 text-gray-600 dark:text-gray-300">{category.description}</p></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search this topic..." className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white sm:w-64"/></div>
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"><MdxGuide path={category.guideMdxPath}/></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{resources.map(r=><ResourceCard key={r.id} resource={r}/>)}</div>
      <div className="mt-10 flex justify-between border-t border-gray-200 pt-5 text-sm dark:border-white/10">{prev?<Link to={`/resources/general/${prev.id}`}>← {prev.title}</Link>:<span/>}{next?<Link to={`/resources/general/${next.id}`}>{next.title} →</Link>:<span/>}</div>
    </section>
  </main></ResourceLayout>;
}
