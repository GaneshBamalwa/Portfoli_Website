import { forwardRef, memo, useState } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

const SKILL_CATEGORIES = [
  {
    num: "01",
    title: "AI / LLM CORE",
    delay: "0s",
    skills: [
      "LangChain",
      "Model Context Protocol (MCP)",
      "OpenAI GPT-4o",
      "Groq Llama 3",
      "Gemini 2.0",
      "OpenRouter APIs",
      "ChromaDB (Vector)",
      "ReAct Orchestration",
      "TensorFlow & PyTorch",
      "Scikit-learn",
    ],
  },
  {
    num: "02",
    title: "FULL-STACK HUB",
    delay: "0.15s",
    skills: [
      "React 18/19 & Vite",
      "TypeScript & JavaScript",
      "FastAPI & asyncio",
      "Pydantic v2",
      "Tailwind CSS 4.0",
      "Three.js & Framer Motion",
      "Recharts",
      "ReactFlow",
    ],
  },
  {
    num: "03",
    title: "SYSTEMS & EXECUTION",
    delay: "0.3s",
    skills: [
      "Docker & docker-compose",
      "Redis & Queue Architecture",
      "PostgreSQL & MySQL & SQLite",
      "Elasticsearch",
      "Playwright Crawling",
      "JWT & OAuth2 (Google / Azure AD)",
      "bcrypt & RBAC",
      "Raw SQL & Hybrid DB Architecture",
      "Pandas & Parquet Exports",
      "Git & Linux",
    ],
  },
  {
    num: "04",
    title: "LANGUAGES",
    delay: "0.15s",
    skills: ["Python", "C & C++", "Java", "TypeScript", "JavaScript", "SQL"],
  },
  {
    num: "05",
    title: "COURSEWORK",
    delay: "0.3s",
    skills: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Object Oriented Programming",
      "Computer Networks & Communications",
      "Software Engineering",
      "Machine Learning Fundamentals",
      "Probability & Statistics",
      "Linear Algebra",
      "Discrete Mathematics",
    ],
  },
] as const;

function SkillCard({
  num,
  title,
  delay,
  skills,
}: {
  num: string;
  title: string;
  delay: string;
  skills: readonly string[];
}) {
  const [hovered, setHovered] = useState(false);
  const tier = useDeviceTier();

  const canHover = tier !== "low";

  return (
    <div
      className="arsenal-card flex flex-col h-full p-8 rounded-xl border border-white/10 bg-card/20 backdrop-blur-xl text-left"
      style={{
        animationDelay: delay,
        border: hovered
          ? "1.5px solid rgba(212, 175, 55, 0.45)"
          : "1.5px solid rgba(255, 255, 255, 0.08)",
        boxShadow: hovered
          ? "0 0 24px 4px rgba(212, 175, 55, 0.1), inset 0 0 16px 0px rgba(212, 175, 55, 0.05)"
          : "0 0 0px 0px rgba(212, 175, 55, 0)",
        transition:
          "border-color 0.7s ease, box-shadow 0.7s ease, background-color 0.7s ease",
        backgroundColor: hovered ? "rgba(212,175,55,0.03)" : "transparent",
      }}
      onMouseEnter={canHover ? () => setHovered(true) : undefined}
      onMouseLeave={canHover ? () => setHovered(false) : undefined}
    >
      <div className="w-8 h-8 rounded bg-accent/5 border border-accent/25 flex items-center justify-center text-accent mb-6 font-mono text-sm">
        {num}
      </div>
      <h3 className="text-xl font-light uppercase tracking-wider text-white mb-6 font-mono">
        {title}
      </h3>
      <div className="space-y-3 flex flex-col items-start flex-grow">
        {skills.map(skill => (
          <div
            key={skill}
            className="flex items-center gap-3 group/skill cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/skill:bg-accent transition-[opacity,transform] duration-300" />
            <span className="text-sm font-light text-white/60 group-hover/skill:text-white transition-[opacity,transform] duration-300">
              {skill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MemoSkillCard = memo(SkillCard);

const ArsenalSection = forwardRef<HTMLElement>(function ArsenalSection(_, ref) {
  return (
    <section
      id="chapter-skills"
      ref={ref}
      className="relative w-full min-h-screen py-12 md:py-32 flex items-center justify-center bg-[#050505] border-t border-white/5 px-4"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="max-w-6xl mx-auto w-full md:px-16 lg:px-24">
        <div className="text-left mb-16">
          <span className="arsenal-label text-xs font-light uppercase tracking-[0.35em] text-accent mb-3 block">
            04 // THE ARSENAL
          </span>
          <h2
            className="arsenal-headline text-4xl md:text-6xl font-light tracking-tight text-white uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Weaponry & Tools
          </h2>
          <p className="arsenal-sub text-sm md:text-base text-white/40 mt-2 font-light">
            Highly specialized technologies, frameworks, and core architectures
            designed to build thinking systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch auto-rows-fr">
          {SKILL_CATEGORIES.map(cat => (
            <MemoSkillCard key={cat.num} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default memo(ArsenalSection);
