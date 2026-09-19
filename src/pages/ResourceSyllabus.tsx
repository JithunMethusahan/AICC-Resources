import { Link, Navigate, useParams } from 'react-router-dom';
import ResourceLayout from '@/components/resources/ResourceLayout';
import ResourceSidebar from '@/components/resources/ResourceSidebar';
import ResourceBreadcrumb from '@/components/resources/ResourceBreadcrumb';
import MdxGuide from '@/components/resources/MdxGuide';
import ResourceCard from '@/components/resources/ResourceCard';
import { getSyllabusSectionById, getSyllabusSubsection, getSortedSubsections } from '@/data/resources';

export default function ResourceSyllabus() {
  const { sectionId, subsectionId } = useParams<{sectionId:string; subsectionId?:string}>();
  const section = sectionId ? getSyllabusSectionById(sectionId) : undefined;
  if (!section) return <Navigate to="/resources" replace />;
  const subs = getSortedSubsections(section);
  const subsection = subsectionId ? getSyllabusSubsection(section, subsectionId) : subs[0];
  if (!subsection) return <Navigate to={`/resources/syllabus/${section.id}`} replace />;
  const resources = subsection.resources;
  const idx = subs.findIndex(s=>s.id===subsection.id);
  const prev=subs[idx-1], next=subs[idx+1];

  return <ResourceLayout><main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:flex-row">
    <ResourceSidebar className="md:block"/>
    <section className="min-w-0 flex-1">
      <ResourceBreadcrumb crumbs={[{label:'Resources',to:'/resources'},{label:'IOAI Syllabus',to:'/resources'},{label:section.title}]} className="mb-5"/>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">{section.title}</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{section.description}</p>
      <nav className="my-6 flex gap-2 overflow-x-auto pb-2">{subs.map(s=><Link key={s.id} to={`/resources/syllabus/${section.id}/${s.id}`} className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${s.id===subsection.id?'bg-aicc-purple text-white border-aicc-purple':'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'}`}>{s.title}</Link>)}</nav>
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"><MdxGuide path={subsection.guideMdxPath}/></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{resources.map(r=><ResourceCard key={r.id} resource={r}/>)}</div>
      <div className="mt-10 flex justify-between border-t border-gray-200 pt-5 text-sm dark:border-white/10">{prev?<Link to={`/resources/syllabus/${section.id}/${prev.id}`}>← {prev.title}</Link>:<span/>}{next?<Link to={`/resources/syllabus/${section.id}/${next.id}`}>{next.title} →</Link>:<span/>}</div>
    </section>
  </main></ResourceLayout>;
}
