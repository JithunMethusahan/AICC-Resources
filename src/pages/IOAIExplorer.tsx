import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Clock3, ExternalLink,
  Github, Search, Sparkles, Target, Trophy, Zap
} from 'lucide-react';
import ResourceLayout from '@/components/resources/ResourceLayout';
import {
  ioaiRoadmap, ioaiTopics, getIOAIStage, getStageTopics, getIOAITopic,
  getTopicResources, type IOAITopic, type IOAIStage
} from '@/data/ioai2026';

const progressKey = 'aicc-ioai-progress-v1';

function readProgress(): string[] {
  try { return JSON.parse(localStorage.getItem(progressKey) || '[]'); } catch { return []; }
}
function toggleProgress(id: string) {
  const current = new Set(readProgress());
  current.has(id) ? current.delete(id) : current.add(id);
  localStorage.setItem(progressKey, JSON.stringify([...current]));
}

function ResourceCard({ resource }: { resource: ReturnType<typeof getTopicResources>[number] }) {
  return (
    <a href={resource.url} target="_blank" rel="noreferrer"
      className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-aicc-purple/50 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-aicc-purple/10 px-2.5 py-1 text-xs font-semibold text-aicc-purple dark:text-aicc-purple-light">{resource.type}</span>
        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-aicc-purple" />
      </div>
      <h3 className="mt-4 font-bold text-gray-900 dark:text-white">{resource.title}</h3>
      <div className="mt-3 flex gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>{resource.level}</span>{resource.free && <><span>•</span><span>Free</span></>}
      </div>
    </a>
  );
}

function TopicRow({ topic, done, onToggle }: { topic: IOAITopic; done: boolean; onToggle: (id: string) => void }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <button aria-label={done ? 'Mark incomplete' : 'Mark complete'} onClick={() => onToggle(topic.id)}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${done ? 'border-aicc-purple bg-aicc-purple text-white' : 'border-gray-300 dark:border-white/20'}`}>
        {done && <Check className="h-4 w-4" />}
      </button>
      <Link to={`/ioai/topic/${topic.id}`} className="min-w-0 flex-1">
        <p className={`font-semibold ${done ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{topic.title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{topic.section}</p>
      </Link>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </div>
  );
}

function Home() {
  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState(readProgress());
  const completed = progress.length;
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ioaiTopics.slice(0, 12);
    return ioaiTopics.filter(t => t.title.toLowerCase().includes(q) || t.section.toLowerCase().includes(q));
  }, [query]);

  const toggle = (id: string) => { toggleProgress(id); setProgress(readProgress()); };

  return <ResourceLayout>
    <main className="mx-auto max-w-7xl px-4 pb-20">
      <section className="relative overflow-hidden rounded-b-3xl bg-[#0A001A] px-6 py-14 text-white md:px-12 md:py-20">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-aicc-purple/30 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> IOAI 2026 • AICC Learning Map
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Stop searching. Start learning.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">A syllabus-aligned path from Python foundations to competition-level AI. Learn a topic, practice it, mark it complete, then move forward.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#roadmap" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#0A001A]">Start the roadmap <ArrowRight className="h-4 w-4"/></a>
            <a href="https://github.com/JithunMethusahan/AICC-Resources/issues/new/choose" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10"><Github className="h-4 w-4"/> Contribute</a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-8 md:grid-cols-3">
        {[
          [<Target className="h-5 w-5"/>, 'Syllabus aligned', 'Built around the official IOAI 2026 topic structure.'],
          [<Zap className="h-5 w-5"/>, 'Learn → practice', 'Every topic has a next action instead of just a list of links.'],
          [<Trophy className="h-5 w-5"/>, 'Track progress', `${completed} of ${ioaiTopics.length} topics completed on this device.`]
        ].map(([icon,title,desc]) => <div key={String(title)} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"><div className="mb-3 text-aicc-purple">{icon}</div><h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p></div>)}
      </section>

      <section id="roadmap" className="scroll-mt-24 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-wider text-aicc-purple">The path</p><h2 className="mt-1 text-3xl font-black text-gray-900 dark:text-white">IOAI 2026 Roadmap</h2><p className="mt-2 text-gray-500 dark:text-gray-400">Six stages. Follow them in order, or jump to the skill you need.</p></div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"><Check className="h-4 w-4 text-aicc-purple"/><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{completed}/{ioaiTopics.length} complete</span></div>
        </div>
        <div className="space-y-5">
          {ioaiRoadmap.map((stage: IOAIStage, i) => {
            const topics = getStageTopics(stage); const done = topics.filter(t => progress.includes(t.id)).length;
            return <section key={stage.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Link to={`/ioai/stage/${stage.id}`} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aicc-purple text-lg font-black text-white">{i+1}</div>
                  <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">{stage.title}</h3><p className="text-sm text-gray-500">{done}/{topics.length} topics complete</p></div>
                </Link>
                <Link to={`/ioai/stage/${stage.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-aicc-purple">Open stage <ArrowRight className="h-4 w-4"/></Link>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10"><div className="h-full rounded-full bg-aicc-purple transition-all" style={{width: `${topics.length ? done/topics.length*100 : 0}%`}}/></div>
              <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {topics.slice(0,6).map(t => <TopicRow key={t.id} topic={t} done={progress.includes(t.id)} onToggle={toggle}/>)}
              </div>
              {topics.length > 6 && <Link to={`/ioai/stage/${stage.id}`} className="mt-3 inline-block text-sm font-semibold text-gray-500 hover:text-aicc-purple">+ {topics.length-6} more topics</Link>}
            </section>
          })}
        </div>
      </section>

      <section className="py-8">
        <div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-aicc-purple">Find a skill</p><h2 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">Browse topics</h2></div><div className="relative w-full max-w-xs"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Python, CNN, BERT..." className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-aicc-purple dark:border-white/10 dark:bg-white/5 dark:text-white"/></div></div>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">{filtered.map(t => <TopicRow key={t.id} topic={t} done={progress.includes(t.id)} onToggle={toggle}/>)}</div>
      </section>
    </main>
  </ResourceLayout>;
}

function StagePage() {
  const { stageId } = useParams(); const stage = stageId ? getIOAIStage(stageId) : undefined;
  const [progress, setProgress] = useState(readProgress());
  if (!stage) return <Home />;
  const topics = getStageTopics(stage); const done = topics.filter(t => progress.includes(t.id)).length;
  const toggle = (id: string) => { toggleProgress(id); setProgress(readProgress()); };
  return <ResourceLayout><main className="mx-auto max-w-5xl px-4 py-10 pb-20">
    <Link to="/ioai" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-aicc-purple"><ArrowLeft className="h-4 w-4"/> Back to roadmap</Link>
    <div className="mt-6 rounded-3xl bg-[#0A001A] p-7 text-white md:p-10"><p className="text-sm font-bold text-white/50">STAGE {stage.id}</p><h1 className="mt-2 text-3xl font-black md:text-5xl">{stage.title}</h1><p className="mt-4 text-white/70">{done} of {topics.length} topics complete.</p><div className="mt-6 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-aicc-purple" style={{width:`${topics.length ? done/topics.length*100 : 0}%`}}/></div></div>
    <div className="mt-8 space-y-2">{topics.map(t=><TopicRow key={t.id} topic={t} done={progress.includes(t.id)} onToggle={toggle}/>)}</div>
  </main></ResourceLayout>;
}

function TopicPage() {
  const { topicId } = useParams(); const topic = topicId ? getIOAITopic(topicId) : undefined;
  const [done,setDone]=useState(()=>topic ? readProgress().includes(topic.id):false);
  if (!topic) return <Home />;
  const resources=getTopicResources(topic);
  const mark=()=>{toggleProgress(topic.id);setDone(readProgress().includes(topic.id));};
  return <ResourceLayout><main className="mx-auto max-w-5xl px-4 py-10 pb-20">
    <Link to="/ioai" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-aicc-purple"><ArrowLeft className="h-4 w-4"/> Back to roadmap</Link>
    <div className="mt-6"><span className="rounded-full bg-aicc-purple/10 px-3 py-1 text-xs font-bold text-aicc-purple">{topic.section}</span><h1 className="mt-4 text-4xl font-black text-gray-900 dark:text-white md:text-5xl">{topic.title}</h1><p className="mt-3 text-gray-500 dark:text-gray-400">A focused learning stop in the IOAI 2026 path.</p></div>
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"><div className="flex items-start gap-3"><BookOpen className="mt-1 h-5 w-5 shrink-0 text-aicc-purple"/><div><h2 className="font-bold text-gray-900 dark:text-white">Learn</h2><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Start with one resource. Use the others when you need a different explanation or more depth.</p></div></div></section>
    <div className="mt-5 grid gap-4 md:grid-cols-3">{resources.map(r=><ResourceCard key={r.id} resource={r}/>)}</div>
    <section className="mt-8 rounded-2xl border border-aicc-purple/20 bg-aicc-purple/5 p-6"><div className="flex items-center gap-2 text-aicc-purple"><Target className="h-5 w-5"/><h2 className="font-bold">Practice now</h2></div><p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-200">{topic.practice}</p><button onClick={mark} className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${done?'bg-aicc-purple text-white':'bg-[#0A001A] text-white'}`}>{done?<><Check className="h-4 w-4"/> Completed</>:<>Mark topic complete <ArrowRight className="h-4 w-4"/></>}</button></section>
  </main></ResourceLayout>;
}

export default function IOAIExplorer() {
  const { stageId, topicId } = useParams();
  if (topicId) return <TopicPage />;
  if (stageId) return <StagePage />;
  return <Home />;
}
