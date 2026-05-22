import { useMemo, useState } from "react";
import MaxDepthCoverSlide from "../assets/md/components/CoverSlide.jsx";
import TwoSumBriefSlide from "../assets/ts/components/BriefSlide.jsx";
import TwoSumIdeaSlide from "../assets/ts/components/IdeaSlide.jsx";
import TwoSumSimSlide from "../assets/ts/components/SimSlide.jsx";
import TwoSumSummarySlide from "../assets/ts/components/SummarySlide.jsx";
import CdSimSlide from "../assets/cd/components/SimSlide.jsx";
import DfsSlide from "../assets/md/components/DfsSlide.jsx";
import SummarySlide from "../assets/md/components/SummarySlide.jsx";
import HeroSlide from "../assets/dfs/components/HeroSlide.jsx";
import ConceptSlide from "../assets/dfs/components/ConceptSlide.jsx";
import StackSlide from "../assets/dfs/components/StackSlide.jsx";
import DfsSummarySlide from "../assets/dfs/components/SummarySlide.jsx";
import { buildPrefixHashSteps } from "../assets/ts/prefixHashSteps.js";
import { HASH_STEPS } from "../assets/cd/hashSteps.js";
import PreviewFrame from "../components/PreviewFrame.jsx";
import { DEMO_ARRAY, DEMO_TARGET } from "../demoData.js";

function StepControl({ min, max, value, onChange, label }) {
  return (
    <div className="al-step-control">
      <button type="button" className="al-btn" disabled={value <= min} onClick={() => onChange(value - 1)}>
        −
      </button>
      <span>
        {label} {value} / {max}
      </span>
      <button type="button" className="al-btn" disabled={value >= max} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

export function AlgoPrefixHashPreview({ compact = false }) {
  const steps = useMemo(() => buildPrefixHashSteps(DEMO_ARRAY, DEMO_TARGET), []);
  const [step, setStep] = useState(compact ? 0 : Math.min(3, steps.length));
  return (
    <PreviewFrame
      deckClass="ts-deck"
      compact={compact}
      controls={
        compact ? null : (
          <StepControl min={0} max={steps.length} value={step} onChange={setStep} label="步" />
        )
      }
    >
      <TwoSumSimSlide stepCount={step} caseConfig={{ nums: DEMO_ARRAY, target: DEMO_TARGET, label: "示例" }} />
    </PreviewFrame>
  );
}

export function AlgoHashSetPreview({ compact = false }) {
  const [step, setStep] = useState(compact ? 0 : 4);
  return (
    <PreviewFrame
      deckClass="cd-deck"
      compact={compact}
      controls={
        compact ? null : (
          <StepControl min={0} max={HASH_STEPS.length} value={step} onChange={setStep} label="步" />
        )
      }
    >
      <CdSimSlide stepCount={step} animateForward={false} />
    </PreviewFrame>
  );
}

export function AlgoDfsTreePreview({ compact = false }) {
  const [step, setStep] = useState(compact ? 0 : 5);
  return (
    <PreviewFrame
      deckClass="md-deck"
      compact={compact}
      controls={
        compact ? null : (
          <StepControl min={0} max={12} value={step} onChange={setStep} label="步" />
        )
      }
    >
      <div className="md-dfs-stage al-dfs-mini">
        <DfsSlide stepCount={step} animateForward={false} />
      </div>
    </PreviewFrame>
  );
}

export function AlgoLeafFlashPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <div className="md-dfs-stage al-dfs-mini">
        <DfsSlide stepCount={compact ? 6 : 8} animateForward={false} />
      </div>
    </PreviewFrame>
  );
}

export function LayoutCoverPreview({ compact = false }) {
  const [phase, setPhase] = useState(compact ? 1 : 1);
  return (
    <PreviewFrame
      deckClass="md-deck"
      compact={compact}
      controls={
        compact ? null : <StepControl min={0} max={1} value={phase} onChange={setPhase} label="节拍" />
      }
    >
      <MaxDepthCoverSlide phase={phase} />
    </PreviewFrame>
  );
}

export function LayoutBriefPreview({ compact = false }) {
  const [step, setStep] = useState(compact ? 0 : 0);
  return (
    <PreviewFrame
      deckClass="ts-deck"
      compact={compact}
      controls={
        compact ? null : <StepControl min={0} max={2} value={step} onChange={setStep} label="节拍" />
      }
    >
      <TwoSumBriefSlide step={step} />
    </PreviewFrame>
  );
}

export function LayoutIdeaPreview({ compact = false }) {
  const [step, setStep] = useState(compact ? 0 : 0);
  return (
    <PreviewFrame
      deckClass="ts-deck"
      compact={compact}
      controls={
        compact ? null : <StepControl min={0} max={2} value={step} onChange={setStep} label="卡" />
      }
    >
      <TwoSumIdeaSlide step={step} />
    </PreviewFrame>
  );
}

export function LayoutSimArrayPreview({ compact = false }) {
  return <AlgoPrefixHashPreview compact={compact} />;
}

export function LayoutSummaryListPreview({ compact = false }) {
  const [step, setStep] = useState(compact ? 0 : 2);
  return (
    <PreviewFrame
      deckClass="ts-deck"
      compact={compact}
      controls={
        compact ? null : <StepControl min={0} max={4} value={step} onChange={setStep} label="条" />
      }
    >
      <TwoSumSummarySlide step={step} />
    </PreviewFrame>
  );
}

export function LayoutDualPanelPreview({ compact = false }) {
  const [step, setStep] = useState(compact ? 0 : 0);
  return (
    <PreviewFrame
      deckClass="md-deck"
      compact={compact}
      controls={
        compact ? null : <StepControl min={0} max={2} value={step} onChange={setStep} label="节拍" />
      }
    >
      <SummarySlide step={step} animateForward={false} />
    </PreviewFrame>
  );
}

export function LayoutDfsTreePreview({ compact = false }) {
  return <AlgoDfsTreePreview compact={compact} />;
}

export function LayoutHeroSplitPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="dfs-deck" compact={compact}>
      <HeroSlide />
    </PreviewFrame>
  );
}

export function LayoutConceptCenterPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="dfs-deck" compact={compact}>
      <ConceptSlide />
    </PreviewFrame>
  );
}

export function LayoutStackSplitPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="dfs-deck" compact={compact}>
      <StackSlide />
    </PreviewFrame>
  );
}

export function LayoutGlassTablePreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="dfs-deck" compact={compact}>
      <DfsSummarySlide />
    </PreviewFrame>
  );
}
