import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, BookOpen, Check, ChevronRight, ExternalLink, Github, GraduationCap, Search, Sparkles, Target, Trophy } from 'lucide-react';
import ResourceLayout from '@/components/resources/ResourceLayout';

type Resource = { id:string; title:string; url:string; type:string; level:string; free?:boolean };
type Topic = { id:string; title:string; section:string; resources:string[]; practice:string };
type Stage = { id:string; title:string; topics:string[] };
type MapData = { title:string; resources:Resource[]; topics:Topic[]; roadmap:Stage[] };

const STORAGE='aicc-ioai-2026-progress';

function loadProgress(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch { return {}; }
}

const typeLabel=(t:string)=>({course:'Course',docs:'Docs',video:'Video',book:'Book',practice:'Practice',interactive:'Interactive',notebook:'Notebook',code:'Code',paper:'Paper',tool:'Tool'}[t] || t);

export default function IOAI2026() {
  const [data,setData]=useState<MapData|null>(null);
  const [view,setView]=useState<'home'|'roadmap'|'topics'>('home');
  const [query,setQuery]=useState('');
  const [level,setLevel]=useState('all');
  const [progress,setProgress]=useState<Record<string,boolean>>(loadProgress);
  const [selected,setSelected]=useState<Topic|null>(null);

  useEffect(()=>{ fetch('/ioai2026-resource-map.json').then(r=>r.json()).then(setData).catch(()=>{}); },[]);
  useEffect(()=>{ localStorage.setItem(STORAGE,JSON.stringify(progress)); },[progress]);

  const topics=data?.topics ?? [];
  const resources=data?.resources ?? [];
  const byId=useMemo(()=>new Map(resources.map(r=>[r.id,r])),[resources]);
  const filtered=useMemo(()=>topics.filter(t=>{
    const q=query.toLowerCase().trim();
    if(q && !(t.title+' '+t.section).toLowerCase().includes(q)) return false;
    if(level!=='all' && !t.resources.some(id=>byId.get(id)?.level===level)) return false;
    return true;
  }),[topics,query,level,byId]);

  const done=topics.filter(t=>progress[t.id]).length;
  const pct=topics.length ? Math.round(done/topics.length*100) : 0;
  const toggle=(id:string)=>setProgress(p=>({...p,[id]:!p[id]}));

  if(!data) return <ResourceLayout><main className="mx-auto max-w-7xl px-4 py-24 text-center text-gray-600 dark:text-gray-300"><Sparkles className="mx-auto mb-4 h-7 w-7 text-aicc-purple animate-pulse"/><p>Loading the IOAI 2026 map…</p></main></ResourceLayout>;

  return <ResourceLayout>
    <div className="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-aicc-purple">IOAI 2026</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">A simple syllabus-aligned path for learning, practice and progress.</p>
          </div>
          <div className="flex gap-1 rounded-lg border border-gray-200 p-1 dark:border-white/10">
            {([['home','Overview'],['roadmap','Roadmap'],['topics','Topics']] as const).map(([id,label])=>
              <button key={id} onClick={()=>{setView(id);setSelected(null)}} className={`rounded-md px-3 py-1.5 text-[13px] transition-colors ${view===id?'bg-aicc-purple text-white':'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'}`}>{label}</button>
            )}
          </div>
        </div>
      </div>
    </div>

    <main className="mx-auto max-w-7xl px-4 py-10 pb-20">
      {view==='home' && !selected && <Home setView={setView} pct={pct} done={done} topics={topics} resourcesCount={resources.length}/>}
      {view==='roadmap' && !selected && <Roadmap data={data} progress={progress} toggle={toggle} onTopic={setSelected}/>}
      {view==='topics' && !selected && <Topics filtered={filtered} query={query} setQuery={setQuery} level={level} setLevel={setLevel} progress={progress} onTopic={setSelected}/>}
      {selected && <TopicDetail topic={selected} byId={byId} done={!!progress[selected.id]} toggle={toggle} onBack={()=>setSelected(null)}/>}
    </main>

    <div className="border-t border-gray-200 bg-white dark:border-white/10 dark:bg-[#0a0a0f]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2"><Github className="h-4 w-4 text-aicc-purple"/><span>Open-source and community curated.</span></div>
        <a href="https://github.com/JithunMethusahan/AICC-Resources/issues/new/choose" target="_blank" rel="noreferrer" className="font-medium text-aicc-purple hover:opacity-80">Suggest or report a resource →</a>
      </div>
    </div>
  </ResourceLayout>;
}

function Home({setView,pct,done,topics,resourcesCount}:{setView:(v:'home'|'roadmap'|'topics')=>void;pct:number;done:number;topics:Topic[];resourcesCount:number}) {
 return <div>
  <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5 md:p-7">
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-aicc-purple"><Sparkles className="h-4 w-4"/> IOAI 2026 learning map</div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">Learn the syllabus.<br/><span className="text-aicc-purple">Practice what you learn.</span></h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-6 text-gray-600 dark:text-gray-300">AICC organizes the official IOAI 2026 topics into a clear path, with curated resources and a direct route to AICC practice for every topic.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={()=>setView('roadmap')} className="inline-flex items-center gap-2 rounded-lg bg-aicc-purple px-4 py-2 text-xs font-semibold text-white hover:opacity-90">Start the roadmap <ArrowRight className="h-4 w-4"/></button>
        <button onClick={()=>setView('topics')} className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-white/15 dark:text-white dark:hover:bg-white/10">Browse topics</button>
      </div>
    </div>
  </section>

  <section className="mt-5 grid gap-3 md:grid-cols-3">
    <Stat icon={<Target/>} value={String(topics.length)} label="syllabus topics mapped"/>
    <Stat icon={<BookOpen/>} value={String(resourcesCount)} label="resources mapped"/>
    <Stat icon={<Trophy/>} value={`${pct}%`} label={`${done} topics completed`}/>
  </section>

  <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Your progress</h2><p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">Saved on this device.</p></div><span className="text-xl font-bold text-gray-900 dark:text-white">{pct}%</span></div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10"><div className="h-full rounded-full bg-aicc-purple transition-all" style={{width:`${pct}%`}}/></div>
      <button onClick={()=>setView('roadmap')} className="mt-4 text-xs font-semibold text-aicc-purple hover:opacity-80">Continue learning <ArrowRight className="ml-1 inline h-4 w-4"/></button>
    </div>
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <GraduationCap className="h-6 w-6 text-aicc-orange"/><h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">Simple flow</h2>
      <ol className="mt-3 space-y-2 text-[13px] text-gray-600 dark:text-gray-300"><li>01 — Pick a stage</li><li>02 — Learn from a resource</li><li>03 — Do the practice task</li><li>04 — Mark it complete</li></ol>
    </div>
  </section>
 </div>
}

function Stat({icon,value,label}:{icon:ReactNode;value:string;label:string}){return <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"><div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">{icon}<span className="text-sm">{label}</span></div><div className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{value}</div></div>}

function Roadmap({data,progress,toggle,onTopic}:{data:MapData;progress:Record<string,boolean>;toggle:(id:string)=>void;onTopic:(t:Topic)=>void}){
 const byId=new Map(data.topics.map(t=>[t.id,t]));
 return <div><PageTitle title="IOAI 2026 Roadmap" text="Follow the stages in order, but start practicing as soon as you can."/>
 <div className="space-y-4">{data.roadmap.map((s,i)=>{const stageTopics=s.topics.map(id=>byId.get(id)).filter(Boolean) as Topic[];const finished=stageTopics.filter(t=>progress[t.id]).length;return <section key={s.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5 md:p-4"><div className="flex items-start gap-4"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-aicc-purple text-sm font-bold text-white">{i+1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-gray-900 dark:text-white">{s.title}</h2><p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">{finished}/{stageTopics.length} complete</p></div><div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10"><div className="h-full bg-aicc-purple" style={{width:`${stageTopics.length?finished/stageTopics.length*100:0}%`}}/></div></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{stageTopics.map(t=><button key={t.id} onClick={()=>onTopic(t)} className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3.5 text-left transition-colors hover:border-aicc-purple/40 hover:bg-purple-50 dark:border-white/10 dark:bg-black/10 dark:hover:bg-white/10"><span onClick={e=>{e.stopPropagation();toggle(t.id)}} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${progress[t.id]?'border-green-500 bg-green-500 text-white':'border-gray-300 text-transparent dark:border-white/20'}`}><Check className="h-3.5 w-3.5"/></span><span className={`min-w-0 flex-1 text-[14px] ${progress[t.id]?'text-gray-400 line-through dark:text-white/40':'text-gray-700 dark:text-gray-200'}`}>{t.title}</span><ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-aicc-purple dark:text-white/20"/></button>)}</div></div></div></section>})}</div></div>
}

function Topics({filtered,query,setQuery,level,setLevel,progress,onTopic}:{filtered:Topic[];query:string;setQuery:(s:string)=>void;level:string;setLevel:(s:string)=>void;progress:Record<string,boolean>;onTopic:(t:Topic)=>void}){
 return <div><PageTitle title="Explore every topic" text="Search by skill and open a topic for resources and practice."/><div className="mb-5 flex flex-col gap-2 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search topics…" className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-900 outline-none focus:border-aicc-purple dark:border-white/10 dark:bg-white/5 dark:text-white"/></div><select value={level} onChange={e=>setLevel(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 dark:border-white/10 dark:bg-[#15151c] dark:text-white"><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div><p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{filtered.length} topics</p><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{filtered.map(t=><button key={t.id} onClick={()=>onTopic(t)} className="group rounded-lg border border-gray-200 bg-white p-3.5 text-left transition-colors hover:border-aicc-purple/40 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"><div className="flex items-center justify-between gap-3"><span className="text-[12px] font-semibold uppercase tracking-wider text-aicc-purple">{t.section}</span>{progress[t.id]&&<span className="text-xs text-green-600 dark:text-green-400">✓ Complete</span>}</div><h3 className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">{t.title}</h3><p className="mt-1 line-clamp-2 text-[13px] leading-5 text-gray-500 dark:text-gray-400">{t.practice}</p><span className="mt-2 inline-flex items-center text-[13px] font-semibold text-gray-600 group-hover:text-aicc-purple dark:text-gray-300">Open topic <ChevronRight className="ml-1 h-4 w-4"/></span></button>)}</div></div>
}

function TopicDetail({topic,byId,done,toggle,onBack}:{topic:Topic;byId:Map<string,Resource>;done:boolean;toggle:(id:string)=>void;onBack:()=>void}){
 return <div className="mx-auto max-w-4xl"><button onClick={onBack} className="mb-5 text-[13px] text-gray-500 hover:text-aicc-purple">← Back to topics</button><div className="rounded-xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-white/5 md:p-8"><div className="text-[13px] font-semibold text-aicc-purple">{topic.section}</div><h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-white md:text-2xl">{topic.title}</h1><p className="mt-3 max-w-2xl text-[15px] text-gray-600 dark:text-gray-300">Choose a starting resource, learn the concept, then do the practice task.</p><button onClick={()=>toggle(topic.id)} className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${done?'bg-green-500 text-white':'bg-aicc-purple text-white hover:opacity-90'}`}>{done?<><Check className="h-4 w-4"/> Completed</>:<>Mark as complete</>}</button></div>
 <section className="mt-6"><h2 className="text-lg font-bold text-gray-900 dark:text-white">Resources</h2><div className="mt-3 space-y-2">{topic.resources.map((id,i)=>{const r=byId.get(id);if(!r)return null;return <a key={id} href={r.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-aicc-purple/40 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gray-100 text-xs font-bold text-gray-700 dark:bg-white/10 dark:text-white">{i+1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 text-[12px] text-gray-500 dark:text-gray-400"><span>{typeLabel(r.type)}</span><span>•</span><span>{r.level}</span></div><h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{r.title}</h3></div><ExternalLink className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-aicc-purple"/></a>})}</div></section>
 <section className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-400/20 dark:bg-orange-400/5"><div className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-aicc-orange"/><div><h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Practice</h2><p className="mt-1 text-[13px] leading-5 text-gray-700 dark:text-gray-300">Practice this topic on AICC using a real competition problem.</p><a href="https://aicc-official.org/contests" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-aicc-orange hover:opacity-80">Open AICC practice problems <ExternalLink className="h-3.5 w-3.5"/></a></div></div></section>
 </div>
}

function PageTitle({title,text}:{title:string;text:string}){return <div className="mb-5"><h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{title}</h1><p className="mt-1.5 max-w-2xl text-[15px] text-gray-600 dark:text-gray-300">{text}</p></div>}
