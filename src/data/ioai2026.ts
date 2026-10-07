import map from './ioai2026-resource-map.json';

export type IOAIResource = {
  id: string;
  title: string;
  url: string;
  type: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  free?: boolean;
};

export type IOAITopic = {
  id: string;
  title: string;
  section: string;
  resources: string[];
  practice: string;
};

export type IOAIStage = {
  id: string;
  title: string;
  topics: string[];
};

export const ioaiMap = map as {
  version: string;
  title: string;
  source: string;
  resources: IOAIResource[];
  topics: IOAITopic[];
  roadmap: IOAIStage[];
};

export const ioaiResources = ioaiMap.resources;
export const ioaiTopics = ioaiMap.topics;
export const ioaiRoadmap = ioaiMap.roadmap;

export const getIOAIResource = (id: string) => ioaiResources.find(r => r.id === id);
export const getIOAITopic = (id: string) => ioaiTopics.find(t => t.id === id);
export const getIOAIStage = (id: string) => ioaiRoadmap.find(s => s.id === id);

export const getStageTopics = (stage: IOAIStage) =>
  stage.topics.map(getIOAITopic).filter(Boolean) as IOAITopic[];

export const getTopicResources = (topic: IOAITopic) =>
  topic.resources.map(getIOAIResource).filter(Boolean) as IOAIResource[];
