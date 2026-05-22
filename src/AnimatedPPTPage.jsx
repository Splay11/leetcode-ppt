import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers3,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const slides = [
  {
    id: 1,
    eyebrow: "AI Strategy Presentation",
    title: "智能页面升级方案",
    subtitle: "从静态页面升级为带节奏、层次和视觉冲击力的 4 页动画 PPT 页面",
  },
  {
    id: 2,
    eyebrow: "Core Message",
    title: "先聚焦核心内容",
    subtitle: "让观众先理解左侧主信息：价值主张、业务逻辑、关键优势与核心结论。",
  },
  {
    id: 3,
    eyebrow: "Expansion",
    title: "再展开右侧能力卡片",
    subtitle: "左侧内容平滑移动到页面左侧，右侧卡片依次出现，形成完整的信息结构。",
  },
  {
    id: 4,
    eyebrow: "Summary",
    title: "最后呈现结果表格",
    subtitle: "通过下方表格承接前面的视觉叙事，让数据与结论完成闭环。",
  },
];

const cards = [
  {
    icon: Layers3,
    title: "结构清晰",
    desc: "标题、内容、卡片、表格按顺序出现，降低理解成本。",
  },
  {
    icon: Sparkles,
    title: "动效高级",
    desc: "使用 Framer Motion 实现淡入、位移、缩放与交错动画。",
  },
  {
    icon: TrendingUp,
    title: "重点突出",
    desc: "左侧主内容作为叙事中心，右侧卡片作为能力补充。",
  },
  {
    icon: ShieldCheck,
    title: "可扩展性强",
    desc: "内容、卡片、表格都可以快速替换为真实项目资料。",
  },
];

const tableRows = [
  ["页面结构", "4 页 PPT 式布局", "已升级"],
  ["动画逻辑", "标题 → 左侧内容 → 右侧卡片 → 表格", "已完成"],
  ["交互控制", "按钮 / 键盘左右键 / 数字键", "已支持"],
  ["视觉表现", "玻璃拟态、渐变背景、卡片阴影", "已优化"],
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function PrimaryPanel({ compact = false }) {
  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/15 shadow-2xl backdrop-blur-xl ${
        compact ? "w-full p-7" : "w-full max-w-3xl p-10"
      }`}
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.div
          variants={itemVariants}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm text-white/80"
        >
          <BarChart3 className="h-4 w-4" />
          Core Section
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className={`${compact ? "text-3xl" : "text-5xl"} font-semibold tracking-tight text-white`}
        >
          左侧核心内容模块
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className={`${compact ? "mt-4 text-base" : "mt-6 text-lg"} leading-8 text-white/72`}
        >
          这里承载页面的主叙事：可以放产品定位、项目背景、核心观点、商业价值或方案介绍。
          动画会先让它居中出现，再在下一页平滑移动到左侧，为右侧卡片腾出空间。
        </motion.p>

        <motion.div variants={itemVariants} className="mt-7 grid grid-cols-3 gap-3">
          {["清晰", "高级", "可复用"].map((tag) => (
            <div
              key={tag}
              className="rounded-2xl border border-white/15 bg-black/10 px-4 py-3 text-center text-sm font-medium text-white/80"
            >
              {tag}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PageTitle({ slide }) {
  return (
    <motion.div
      key="title-page"
      className="mx-auto flex min-h-[650px] max-w-6xl flex-col items-center justify-center px-8 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -40, transition: { duration: 0.35 } }}
    >
      <motion.div
        variants={itemVariants}
        className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm uppercase tracking-[0.28em] text-cyan-100/80 backdrop-blur-md"
      >
        {slide.eyebrow}
      </motion.div>
      <motion.h1
        variants={itemVariants}
        className="max-w-5xl text-7xl font-semibold leading-tight tracking-tight text-white"
      >
        {slide.title}
      </motion.h1>
      <motion.p variants={itemVariants} className="mt-7 max-w-3xl text-xl leading-9 text-white/72">
        {slide.subtitle}
      </motion.p>
      <motion.div variants={itemVariants} className="mt-12 h-1.5 w-72 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-white/80"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
}

function PageCoreOnly({ slide }) {
  return (
    <motion.div
      key="core-page"
      className="mx-auto flex min-h-[650px] max-w-6xl flex-col items-center justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.35 } }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-8 text-center"
      >
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">{slide.eyebrow}</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">{slide.title}</h2>
        <p className="mt-3 text-white/65">{slide.subtitle}</p>
      </motion.div>
      <PrimaryPanel />
    </motion.div>
  );
}

function PageCards({ slide }) {
  return (
    <motion.div
      key="cards-page"
      className="mx-auto flex min-h-[650px] max-w-7xl flex-col justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-8"
      >
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">{slide.eyebrow}</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">{slide.title}</h2>
        <p className="mt-3 max-w-3xl text-white/65">{slide.subtitle}</p>
      </motion.div>

      <div className="grid items-stretch gap-6 lg:grid-cols-[0.95fr_1.25fr]">
        <motion.div
          layout
          initial={{ opacity: 0, x: 240, scale: 1.04 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <PrimaryPanel compact />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={{
                  hidden: { opacity: 0, x: 70, y: 20, scale: 0.94 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-[1.6rem] border border-white/15 bg-white/12 p-6 shadow-xl backdrop-blur-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 leading-7 text-white/66">{card.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

function PageTable({ slide }) {
  return (
    <motion.div
      key="table-page"
      className="mx-auto flex min-h-[650px] max-w-7xl flex-col justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
        <motion.p variants={itemVariants} className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">
          {slide.eyebrow}
        </motion.p>
        <motion.h2 variants={itemVariants} className="mt-3 text-4xl font-semibold text-white">
          {slide.title}
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-3 max-w-3xl text-white/65">
          {slide.subtitle}
        </motion.p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.35fr]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PrimaryPanel compact />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/12 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">升级结果总览</h3>
                <p className="text-sm text-white/55">Presentation Output Summary</p>
              </div>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-white/8 text-white/68">
              <tr>
                <th className="px-6 py-4 font-medium">模块</th>
                <th className="px-6 py-4 font-medium">说明</th>
                <th className="px-6 py-4 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <motion.tr
                  key={row[0]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.32 + index * 0.1 }}
                  className="border-t border-white/10 text-white/78"
                >
                  <td className="px-6 py-5 font-medium text-white">{row[0]}</td>
                  <td className="px-6 py-5">{row[1]}</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full border border-emerald-200/20 bg-emerald-300/12 px-3 py-1 text-xs font-medium text-emerald-100">
                      {row[2]}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function AnimatedPPTPage() {
  const [page, setPage] = useState(0);

  const activeSlide = slides[page];
  const progress = useMemo(() => ((page + 1) / slides.length) * 100, [page]);

  const goNext = () => setPage((prev) => Math.min(prev + 1, slides.length - 1));
  const goPrev = () => setPage((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (["1", "2", "3", "4"].includes(event.key)) {
        setPage(Number(event.key) - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.32),transparent_35%),radial-gradient(circle_at_82%_28%,rgba(217,70,239,0.28),transparent_36%),radial-gradient(circle_at_50%_90%,rgba(45,212,191,0.2),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(210deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <div>
          <p className="text-sm text-white/50">React Animated PPT</p>
          <p className="mt-1 text-lg font-semibold text-white">4 Pages Interactive Showcase</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-xl">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setPage(index)}
              className={`h-8 w-8 rounded-full text-sm transition ${
                page === index
                  ? "bg-white text-slate-950"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {slide.id}
            </button>
          ))}
        </div>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {page === 0 && <PageTitle slide={activeSlide} />}
          {page === 1 && <PageCoreOnly slide={activeSlide} />}
          {page === 2 && <PageCards slide={activeSlide} />}
          {page === 3 && <PageTable slide={activeSlide} />}
        </AnimatePresence>
      </main>

      <footer className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-8 pb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={page === 0}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={page === slides.length - 1}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <p className="text-sm text-white/50">支持左右键、空格键、数字键 1-4 切换</p>
        </div>

        <div className="w-72">
          <div className="mb-2 flex justify-between text-xs text-white/45">
            <span>Page {page + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-white"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
