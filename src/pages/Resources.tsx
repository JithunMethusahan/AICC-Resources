import { ArrowRight, BookOpen, Github, Star } from 'lucide-react';
import ResourceLayout from '@/components/resources/ResourceLayout';
import ResourceHero from '@/components/resources/ResourceHero';
import ResourceCategoryNav from '@/components/resources/ResourceCategoryNav';
import ResourceCard from '@/components/resources/ResourceCard';
import { getFeaturedResources } from '@/data/resources';

export default function Resources() {
  const featured = getFeaturedResources().slice(0, 6);
  return <ResourceLayout>
    <ResourceHero title="AI" titleAccent="Resources" subtitle="A curated collection of free resources for learning AI and preparing for AI competitions." />
    <main className="mx-auto max-w-7xl px-4 py-10 pb-20">
      <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3"><BookOpen className="mt-1 h-5 w-5 shrink-0 text-aicc-purple"/><div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Learn by topic</h2><p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Browse the general collection or follow the IOAI syllabus topic by topic.</p></div></div>
          <a href="https://github.com/JithunMethusahan/ioai-community-contest/issues/new/choose" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-aicc-purple px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Suggest a resource <ArrowRight className="h-4 w-4"/></a>
        </div>
      </section>
      <ResourceCategoryNav />
      {featured.length > 0 && <section className="mt-16"><div className="mb-5 flex items-center gap-3"><Star className="h-5 w-5 text-aicc-orange"/><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Resources</h2></div><div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{featured.map(r => <ResourceCard key={r.id} resource={r}/>)}</div></section>}
      <section className="mt-16 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
        <Github className="mb-2 h-5 w-5 text-aicc-purple"/><p>All resources should be free to access. Every submission is reviewed before it is added to the curated collection.</p>
      </section>
    </main>
  </ResourceLayout>;
}
