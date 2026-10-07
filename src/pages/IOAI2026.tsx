import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronRight, ExternalLink, Github, GraduationCap, Search, Sparkles, Target, Trophy, X } from 'lucide-react';

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

  const done=Object.values(progress).filter(Boolean).length;
  const pct=topics.length ? Math.round(done/topics.length*100) : 0;

  const toggle=(id:string)=>setProgress(p=>({...p,[id]:!p[id]}));

  if(!data) return <div className="min-h-screen bg-[#0a001a] text-white grid place-items-center"><div className="text-center"><Sparkles className="mx-auto mb-4 h-8 w-8 text-purple-300 animate-pulse"/><p>Loading the IOAI 2026 map…</p></div></div>;

  return <div className="min-h-screen bg-[#08060d] text-white">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08060d]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <button onClick={()=>{setView('home');setSelected(null)}} className="flex items-center gap-2 font-bold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-purple-500 to-orange-400">A</span><span>AICC <span className="text-white/50">/</span> IOAI 2026</span></button>
        <nav className="hidden items-center gap-1 md:flex">
          {([['home','Home'],['roadmap','Roadmap'],['topics','Topics']] as const).map(([id,label])=><button key={id} onClick={()=>{setView(id);setSelected(null)}} className={`rounded-lg px-4 py-2 text-sm ${view===id?'bg-white/10 text-white':'text-white/60 hover:text-white'}`}>{label}</button>)}
        </nav>
        <a href="https://github.com/JithunMethusahan/AICC-Resources" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/10"><Github className="h-4 w-4"/> <span className="hidden sm:inline">Contribute</span></a>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {view==='home' && !selected && <Home setView={setView} pct={pct} done={done} topics={topics} roadmap={data.roadmap} />}
      {view==='roadmap' && !selected && <Roadmap data={data} progress={progress} toggle={toggle} onTopic={setSelected}/>}
      {view==='topics' && !selected && <Topics filtered={filtered} query={query} setQuery={setQuery} level={level} setLevel={setLevel} progress={progress} onTopic={setSelected}/>}
      {selected && <TopicDetail topic={selected} byId={byId} done={!!progress[selected.id]} toggle={toggle} onBack={()=>setSelected(null)}/>}
    </main>

    <footer className="border-t border-white/10 py-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-white/45 md:flex-row md:items-center md:justify-between"><p>Built for students preparing for AI Olympiad-level learning.</p><a href="https://github.com/JithunMethusahan/AICC-Resources/issues/new/choose" target="_blank" rel="noreferrer" className="text-purple-300 hover:text-white">Suggest or report a resource →</a></div></footer>
  </div>
}

function Home({setView,pct,done,topics,roadmap}:{setView:(v:'home'|'roadmap'|'topics')=>void;pct:number;done:number;topics:Topic[];roadmap:Stage[]}) {
 return <div>
  <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#19002f] via-[#100b1b] to-[#16100b] p-7 md:p-12">
   <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl"/>
   <div className="relative max-w-3xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1.5 text-xs text-purple-200"><Sparkles className="h-3.5 w-3.5"/> Official-syllabus aligned learning map</div>
   <h1 className="text-4xl font-black tracking-tight md:text-6xl">Stop searching.<br/><span className="bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent">Start learning.</span></h1>
   <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">AICC turns the IOAI 2026 syllabus into a clear path: learn → practice → check your progress → move to the next skill.</p>
   <div className="mt-7 flex flex-wrap gap-3"><button onClick={()=>setView('roadmap')} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-black hover:bg-white/90">Start the roadmap <ArrowRight className="h-4 w-4"/></button><button onClick={()=>setView('topics')} className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/10">Explore topics</button></div>
   </div>
  </section>
  <section className="mt-6 grid gap-4 md:grid-cols-3">
   <Stat icon={<Target/>} value={`${topics.length}`} label="syllabus skills mapped"/>
   <Stat icon={<BookOpen/>} value="Free" label="starting resources"/>
   <Stat icon={<Trophy/>} value={`${pct}%`} label={`${done} topics completed`}/>
  </section>
  <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
   <div className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Your progress</h2><p className="mt-1 text-sm text-white/50">Saved on this device.</p></div><span className="text-2xl font-black">{pct}%</span></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-orange-400" style={{width:`${pct}%`}}/></div><button onClick={()=>setView('roadmap')} className="mt-5 text-sm font-semibold text-purple-300">Continue learning <ArrowRight className="ml-1 inline h-4 w-4"/></button></div>
   <div className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><GraduationCap className="h-7 w-7 text-orange-300"/><h2 className="mt-4 text-xl font-bold">How to use it</h2><ol className="mt-3 space-y-2 text-sm text-white/60"><li>01 — Pick your stage</li><li>02 — Learn from the best starting resource</li><li>03 — Do the practice task</li><li>04 — Mark the topic complete</li></ol></div>
  </section>
 </div>
}

function Stat({icon,value,label}:{icon:React.ReactNode;value:string;label:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="flex items-center gap-3 text-white/45">{icon}<span className="text-sm">{label}</span></div><div className="mt-3 text-3xl font-black">{value}</div></div>}

function Roadmap({data,progress,toggle,onTopic}:{data:MapData;progress:Record<string,boolean>;toggle:(id:string)=>void;onTopic:(t:Topic)=>void}){
 const byId=new Map(data.topics.map(t=>[t.id,t])); return <div><PageTitle title="IOAI 2026 Roadmap" text="Follow the stages in order. You do not need to finish everything before practicing."/>
 <div className="space-y-5">{data.roadmap.map((s,i)=>{const stageTopics=s.topics.map(id=>byId.get(id)).filter(Boolean) as Topic[];const finished=stageTopics.filter(t=>progress[t.id]).length;return <section key={s.id} className="rounded-2xl border border-white/10 bg-white/[.03] p-5 md:p-7"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-500/30 to-orange-400/20 font-black">{i+1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-xl font-bold">{s.title}</h2><p className="mt-1 text-sm text-white/45">{finished}/{stageTopics.length} complete</p></div><div className="h-2 w-24 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-purple-400" style={{width:`${stageTopics.length?finished/stageTopics.length*100:0}%`}}/></div></div><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{stageTopics.map(t=><button key={t.id} onClick={()=>onTopic(t)} className="group flex items-center gap-3 rounded-xl border border-white/8 bg-black/10 p-3 text-left hover:border-purple-400/40 hover:bg-white/5"><span onClick={e=>{e.stopPropagation();toggle(t.id)}} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${progress[t.id]?'border-green-400 bg-green-400 text-black':'border-white/20 text-transparent'}`}><Check className="h-3.5 w-3.5"/></span><span className={`min-w-0 flex-1 text-sm ${progress[t.id]?'text-white/40 line-through':'text-white/80'}`}>{t.title}</span><ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/60"/></button>)}</div></div></div></section>})}</div></div>
}

function Topics({filtered,query,setQuery,level,setLevel,progress,onTopic}:{filtered:Topic[];query:string;setQuery:(s:string)=>void;level:string;setLevel:(s:string)=>void;progress:Record<string,boolean>;onTopic:(t:Topic)=>void}){
 return <div><PageTitle title="Explore every topic" text="Search by skill, then open a topic to get resources and a practice task."/><div className="mb-6 flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-white/30"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search topics…" className="w-full rounded-xl border border-white/10 bg-white/[.04] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-400/50"/></div><select value={level} onChange={e=>setLevel(e.target.value)} className="rounded-xl border border-white/10 bg-[#15111c] px-4 py-2.5 text-sm"><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div><p className="mb-4 text-sm text-white/40">{filtered.length} topics</p><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{filtered.map(t=><button key={t.id} onClick={()=>onTopic(t)} className="group rounded-2xl border border-white/10 bg-white/[.03] p-5 text-left hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-white/[.05] transition"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-wider text-purple-300">{t.section}</span>{progress[t.id]&&<span className="text-xs text-green-300">✓ Complete</span>}</div><h3 className="mt-3 font-bold">{t.title}</h3><p className="mt-2 line-clamp-2 text-sm text-white/45">{t.practice}</p><span className="mt-4 inline-flex items-center text-sm font-semibold text-white/55 group-hover:text-white">Open topic <ChevronRight className="ml-1 h-4 w-4"/></span></button>)}</div></div>
}

function TopicDetail({topic,byId,done,toggle,onBack}:{topic:Topic;byId:Map<string,Resource>;done:boolean;toggle:(id:string)=>void;onBack:()=>void}){
 return <div className="mx-auto max-w-4xl"><button onClick={onBack} className="mb-6 text-sm text-white/50 hover:text-white">← Back to topics</button><div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#19002f] to-white/[.03] p-7 md:p-10"><div className="text-sm font-semibold text-purple-300">{topic.section}</div><h1 className="mt-2 text-4xl font-black">{topic.title}</h1><p className="mt-4 max-w-2xl text-white/55">Choose one starting resource, learn the concept, then do the practice task before moving on.</p><button onClick={()=>toggle(topic.id)} className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold ${done?'bg-green-400 text-black':'bg-white text-black'}`}>{done?<><Check className="h-4 w-4"/> Completed</>:<>Mark as complete</>}</button></div>
 <section className="mt-7"><h2 className="text-2xl font-bold">Start here</h2><div className="mt-4 space-y-3">{topic.resources.map((id,i)=>{const r=byId.get(id);if(!r)return null;return <a key={id} href={r.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 hover:border-purple-400/30 hover:bg-white/[.05]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-sm font-bold">{i+1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 text-xs text-white/40"><span>{typeLabel(r.type)}</span><span>•</span><span>{r.level}</span>{r.free&&<><span>•</span><span className="text-green-300">Free</span></>}</div><h3 className="mt-1 font-semibold">{r.title}</h3></div><ExternalLink className="h-4 w-4 shrink-0 text-white/30 group-hover:text-white"/></a>})}</div></section>
 <section className="mt-8 rounded-2xl border border-orange-400/20 bg-orange-400/5 p-6"><div className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-orange-300"/><div><h2 className="font-bold">Practice before you leave</h2><p className="mt-2 leading-7 text-white/65">{topic.practice}</p></div></div></section>
 </div>
}

function PageTitle({title,text}:{title:string;text:string}){return <div className="mb-8"><h1 className="text-3xl font-black md:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-white/50">{text}</p></div>}
