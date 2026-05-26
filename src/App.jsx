import { resolveActiveTopic } from "./motion/registry.js";

export default function App() {
  const topic = resolveActiveTopic();
  const Deck = topic.component;
  return <Deck />;
}
