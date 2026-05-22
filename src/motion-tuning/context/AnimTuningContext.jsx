import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { applyGroupDefaults, applyTimelineDefaults, mergeSavedIntoDefaults } from "../utils/payload.js";
import { deepCloneConfig } from "../utils/clone.js";

const MAX_HISTORY = 5;
const AnimTuningContext = createContext(null);

export function AnimTuningProvider({
  enabled,
  cloneConfig,
  staticConfig,
  slideTuning,
  manipRegistry,
  applyCssVars,
  saveUrl,
  playbackStorageKey = "motion-tuning-playback",
  cssVarUnitRules,
  cssVarsBlock = "DECK_CSS_VARS",
  deckId = null,
  configPath = null,
  ignoreClickSelector,
  children,
}) {
  const deckRef = useRef(null);
  const [live, setLive] = useState(() => cloneConfig());
  const liveRef = useRef(live);
  const defaultsRef = useRef(cloneConfig());
  const staticConfigRef = useRef(staticConfig);
  const [playback, setPlayback] = useState(null);
  const playbackRef = useRef(null);
  const undoStackRef = useRef([]);
  const gestureStartRef = useRef(null);
  const [undoCount, setUndoCount] = useState(0);
  const [focusTarget, setFocusTarget] = useState(null);

  staticConfigRef.current = staticConfig;
  liveRef.current = live;

  const getCssVars = useCallback(
    (state = liveRef.current) => state[cssVarsBlock] ?? {},
    [cssVarsBlock],
  );

  const registerPlayback = useCallback((pb) => {
    playbackRef.current = pb;
    setPlayback((prev) => {
      if (
        prev?.slideKey === pb.slideKey &&
        prev?.slideIndex === pb.slideIndex &&
        prev?.fragment === pb.fragment &&
        prev?.maxFragment === pb.maxFragment
      ) {
        return prev;
      }
      return pb;
    });
  }, []);

  const getUndoSnapshot = useCallback(() => {
    const pb = playbackRef.current;
    return {
      live: deepCloneConfig(liveRef.current),
      playback: pb
        ? { fragment: pb.fragment, slideIndex: pb.slideIndex }
        : null,
    };
  }, []);

  const applyPlaybackSnapshot = useCallback((playbackSnap) => {
    if (!playbackSnap || !playbackRef.current) return;
    playbackRef.current.setSlideIndex?.(playbackSnap.slideIndex);
    playbackRef.current.setFragment?.(playbackSnap.fragment);
    playbackRef.current.setAnimateForward?.(false);
  }, []);

  const syncCssVarsToDeck = useCallback(
    (vars) => {
      if (deckRef.current && applyCssVars) applyCssVars(deckRef.current, vars);
    },
    [applyCssVars],
  );

  const setDeckNode = useCallback(
    (node) => {
      deckRef.current = node;
      if (node && applyCssVars) applyCssVars(node, getCssVars());
    },
    [applyCssVars, getCssVars],
  );

  const pushUndoSnapshot = useCallback((snapshot) => {
    undoStackRef.current = [snapshot, ...undoStackRef.current].slice(0, MAX_HISTORY);
    setUndoCount(undoStackRef.current.length);
  }, []);

  const beginGesture = useCallback(() => {
    if (gestureStartRef.current === null) {
      gestureStartRef.current = getUndoSnapshot();
    }
  }, [getUndoSnapshot]);

  const endGesture = useCallback(() => {
    if (gestureStartRef.current === null) return;
    const before = gestureStartRef.current;
    gestureStartRef.current = null;
    if (JSON.stringify(before) !== JSON.stringify(getUndoSnapshot())) {
      pushUndoSnapshot(before);
    }
  }, [getUndoSnapshot, pushUndoSnapshot]);

  const undoLastChange = useCallback(() => {
    const snapshot = undoStackRef.current.shift();
    if (!snapshot) return { ok: false, remaining: 0 };
    setLive(snapshot.live);
    syncCssVarsToDeck(getCssVars(snapshot.live));
    applyPlaybackSnapshot(snapshot.playback);
    const remaining = undoStackRef.current.length;
    setUndoCount(remaining);
    return { ok: true, remaining };
  }, [syncCssVarsToDeck, applyPlaybackSnapshot, getCssVars]);

  const updateBlockField = useCallback((block, key, value) => {
    setLive((prev) => ({
      ...prev,
      [block]: { ...prev[block], [key]: value },
    }));
  }, []);

  const updateCssVar = useCallback(
    (name, value) => {
      const formatted = String(value);
      deckRef.current?.style.setProperty(name, formatted);
      setLive((prev) => ({
        ...prev,
        [cssVarsBlock]: { ...prev[cssVarsBlock], [name]: formatted },
      }));
    },
    [cssVarsBlock],
  );

  const updateArrayField = useCallback((block, index, key, value) => {
    setLive((prev) => {
      const arr = prev[block].map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      );
      return { ...prev, [block]: arr };
    });
  }, []);

  const resetSlide = useCallback(
    (slideKey) => {
      const meta = slideTuning[slideKey];
      if (!meta) return;
      undoStackRef.current = [];
      gestureStartRef.current = null;
      setUndoCount(0);
      setLive((prev) => {
        const next = deepCloneConfig(prev);
        meta.groups.forEach((group) =>
          applyGroupDefaults(next, group, defaultsRef.current, cssVarsBlock),
        );
        syncCssVarsToDeck(next[cssVarsBlock]);
        return next;
      });
    },
    [slideTuning, syncCssVarsToDeck, cssVarsBlock],
  );

  const resetGroup = useCallback(
    (slideKey, groupId) => {
      const group = slideTuning[slideKey]?.groups?.find((g) => g.id === groupId);
      if (!group) return;
      setLive((prev) => {
        const next = deepCloneConfig(prev);
        applyGroupDefaults(next, group, defaultsRef.current, cssVarsBlock);
        syncCssVarsToDeck(next[cssVarsBlock]);
        return next;
      });
    },
    [slideTuning, syncCssVarsToDeck, cssVarsBlock],
  );

  const resetTimeline = useCallback(
    (slideKey, fragment) => {
      const slideMeta = slideTuning[slideKey];
      if (!slideMeta) return;
      setLive((prev) => {
        const next = deepCloneConfig(prev);
        applyTimelineDefaults(next, slideMeta, fragment, defaultsRef.current, cssVarsBlock);
        syncCssVarsToDeck(next[cssVarsBlock]);
        return next;
      });
    },
    [slideTuning, syncCssVarsToDeck, cssVarsBlock],
  );

  const commitSavedDefaults = useCallback(
    (payload) => {
      defaultsRef.current = mergeSavedIntoDefaults(
        defaultsRef.current,
        payload,
        cssVarsBlock,
      );
    },
    [cssVarsBlock],
  );

  const setFocusFromElement = useCallback((el) => {
    if (!el?.dataset?.tuningTarget) return;
    const next = {
      groupId: el.dataset.tuningTarget,
      nodeId: el.dataset.tuningNode || null,
      pickRole: el.dataset.tuningPickRole || null,
    };
    setFocusTarget((prev) => {
      if (
        prev?.groupId === next.groupId &&
        prev?.nodeId === next.nodeId &&
        prev?.pickRole === next.pickRole
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const clearFocusTarget = useCallback(() => {
    setFocusTarget((prev) => (prev === null ? prev : null));
  }, []);

  useEffect(() => {
    setFocusTarget(null);
  }, [playback?.slideKey]);

  const value = useMemo(
    () => ({
      enabled,
      live,
      defaults: defaultsRef.current,
      slideTuning,
      manipRegistry,
      saveUrl,
      playbackStorageKey,
      cssVarUnitRules,
      cssVarsBlock,
      deckId,
      configPath,
      ignoreClickSelector,
      playback,
      registerPlayback,
      updateBlockField,
      updateArrayField,
      updateCssVar,
      resetSlide,
      resetGroup,
      resetTimeline,
      commitSavedDefaults,
      setDeckNode,
      getBlock: (name) => live[name],
      getCssVars: () => live[cssVarsBlock],
      beginGesture,
      endGesture,
      undoLastChange,
      undoCount,
      maxHistory: MAX_HISTORY,
      focusTarget,
      setFocusFromElement,
      clearFocusTarget,
    }),
    [
      enabled,
      live,
      slideTuning,
      manipRegistry,
      saveUrl,
      playbackStorageKey,
      cssVarUnitRules,
      cssVarsBlock,
      deckId,
      configPath,
      ignoreClickSelector,
      playback,
      registerPlayback,
      updateBlockField,
      updateArrayField,
      updateCssVar,
      resetSlide,
      resetGroup,
      resetTimeline,
      commitSavedDefaults,
      setDeckNode,
      beginGesture,
      endGesture,
      undoLastChange,
      undoCount,
      focusTarget,
      setFocusFromElement,
      clearFocusTarget,
    ],
  );

  useEffect(() => {
    syncCssVarsToDeck(live[cssVarsBlock]);
  }, [live, cssVarsBlock, syncCssVarsToDeck]);

  return <AnimTuningContext.Provider value={value}>{children}</AnimTuningContext.Provider>;
}

export function useAnimTuning() {
  return useContext(AnimTuningContext);
}

export function useAnimBlock(blockName, staticFallback) {
  const ctx = useAnimTuning();
  if (ctx) return ctx.live[blockName];
  return staticFallback;
}

export function useDeckCssVars(staticFallback) {
  const ctx = useAnimTuning();
  if (ctx) return ctx.live[ctx.cssVarsBlock];
  return staticFallback;
}
