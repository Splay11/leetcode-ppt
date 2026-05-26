import TopicHub from "./components/TopicHub.jsx";
import { getTopicById, getTopicIdFromLocation } from "./motion/registry.js";

export default function App() {
  const topicId = getTopicIdFromLocation();

  if (!topicId) {
    return <TopicHub />;
  }

  const topic = getTopicById(topicId);
  if (!topic?.component) {
    return <TopicHub missingId={topicId} />;
  }

  const Deck = topic.component;
  return <Deck />;
}
