import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const markdownPath = resolve(root, 'IOAI-RESOURCES.md');
const outputPath = resolve(root, 'public/ioai2026-resource-map.json');
const markdown = readFileSync(markdownPath, 'utf8');

const sectionPattern = /^## (.+)$/gm;
const topicPattern = /^### (.+?) <!-- id: ([a-z0-9-]+) -->$/gm;
const sectionMatches = [...markdown.matchAll(sectionPattern)]
  .filter((match) => !['How to use this file', 'Quality checklist', 'Review record template'].includes(match[1].trim()));

const topics = [];
const resourcesByUrl = new Map();
let currentSection = '';

const lines = markdown.split(/\r?\n/);
for (let i = 0; i < lines.length; i += 1) {
  const sectionMatch = lines[i].match(/^## (.+)$/);
  if (sectionMatch) {
    const value = sectionMatch[1].trim();
    if (sectionMatches.some((match) => match[1].trim() === value)) currentSection = value;
    continue;
  }

  const topicMatch = lines[i].match(/^### (.+?) <!-- id: ([a-z0-9-]+) -->$/);
  if (!topicMatch || !currentSection) continue;

  const topic = {
    id: topicMatch[2],
    title: topicMatch[1].trim(),
    section: currentSection,
    resources: [],
    practice: '',
  };

  let j = i + 1;
  while (j < lines.length && !/^### /.test(lines[j]) && !/^## /.test(lines[j])) {
    const practiceMatch = lines[j].match(/^\*\*Practice goal:\*\* (.+)$/);
    if (practiceMatch) topic.practice = practiceMatch[1].trim();

    const resourceMatch = lines[j].match(/^- \*\*[^—]+— \[([^\]]+)\]\((https?:\/\/[^)]+)\)\*\*$/);
    if (resourceMatch) {
      const title = resourceMatch[1].trim();
      const url = resourceMatch[2].trim();
      const metaLines = lines.slice(j + 1, Math.min(j + 5, lines.length));
      const roleLine = metaLines.find((line) => line.includes('**Role:**')) || '';
      const whyLine = metaLines.find((line) => line.includes('**Why it helps:**')) || '';
      const reviewLine = metaLines.find((line) => line.includes('**Review status:**')) || '';
      const role = (roleLine.match(/\*\*Role:\*\* ([^·]+)/) || [,'Learn'])[1].trim();
      const level = (roleLine.match(/\*\*Level:\*\* ([^·]+)/) || [,'beginner'])[1].trim();
      const estimatedTime = (roleLine.match(/\*\*Time:\*\* (.+)$/) || [,'20–40 min'])[1].trim();
      const why = (whyLine.match(/\*\*Why it helps:\*\* (.+)$/) || [,'A focused resource for this topic.'])[1].trim();
      const reviewStatus = (reviewLine.match(/\*\*Review status:\*\* (.+)$/) || [,'Needs verification'])[1].trim();
      const id = 'resource-' + slug(title);
      const type = role === 'Visualize' ? 'video'
        : role === 'Explore' ? 'interactive'
        : role === 'Reference' ? 'docs'
        : role === 'Build' ? (url.includes('github.com') ? 'code' : 'notebook')
        : role === 'Go deeper' ? 'paper'
        : role === 'Practice' ? 'practice'
        : role === 'Learn' ? (url.includes('youtube.com') ? 'video' : 'course')
        : 'docs';

      if (!resourcesByUrl.has(url)) {
        resourcesByUrl.set(url, {
          id, title, url, type, level, role, estimatedTime, description: why, reviewStatus,
        });
      }
      const resourceId = resourcesByUrl.get(url).id;
      if (!topic.resources.includes(resourceId)) topic.resources.push(resourceId);
      j += 3;
    }
    j += 1;
  }

  if (topic.title && topic.resources.length) topics.push(topic);
  i = j - 1;
}

if (!topics.length) {
  throw new Error('No topics were parsed from IOAI-RESOURCES.md. Check the Markdown heading format.');
}
if (topics.some((topic) => topic.resources.length === 0)) {
  throw new Error('At least one topic has no resources. Every topic needs at least one resource.');
}

const roadmap = [];
for (const topic of topics) {
  let stage = roadmap.find((item) => item.title === topic.section);
  if (!stage) {
    stage = { id: slug(topic.section), title: topic.section, topics: [] };
    roadmap.push(stage);
  }
  stage.topics.push(topic.id);
}

const data = {
  version: new Date().toISOString().slice(0, 10),
  title: 'AICC — IOAI 2026 Resource Map',
  source: 'IOAI-RESOURCES.md (single editable source of truth)',
  status: 'curated-draft',
  resource_policy: 'Prefer 2–3 focused, topic-matched resources with a clear purpose and realistic time estimate. Review links before marking verified.',
  resources: [...resourcesByUrl.values()],
  topics,
  roadmap,
};

writeFileSync(outputPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Generated ${topics.length} topics and ${data.resources.length} unique resources at public/ioai2026-resource-map.json`);

function slug(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
