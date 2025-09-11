"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ParticleSystem } from "@/components/ui/particles";
import { ArrowRight, Users, Code, Zap, Globe, X, FlaskConical, Target, Eye, Rocket } from "lucide-react";
import { useEffect, useState, ReactNode, MouseEvent } from "react";

// ======================
// Magnetic Animation
// ======================
interface MagneticProps {
  children: ReactNode;
  strength?: number;
  scale?: number;
  className?: string;
}

function Magnetic({ children, strength = 0.4, scale = 1.05, className = "" }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (left + width / 2);
    const offsetY = e.clientY - (top + height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

// ======================
// Rotating Typewriter
// ======================
function RotatingTypewriter({
  words,
  prefix = "",
  typingSpeedMs = 100,
  eraseSpeedMs = 50,
  holdAfterTypeMs = 1200,
  pauseBetweenWordsMs = 400,
  className = "",
}: {
  words: string[];
  prefix?: string;
  typingSpeedMs?: number;
  eraseSpeedMs?: number;
  holdAfterTypeMs?: number;
  pauseBetweenWordsMs?: number;
  className?: string;
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIndex] || "";

    if (!isDeleting) {
      if (displayedText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, typingSpeedMs);
      } else {
        timer = setTimeout(() => setIsDeleting(true), holdAfterTypeMs);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length - 1));
        }, eraseSpeedMs);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        timer = setTimeout(() => {}, pauseBetweenWordsMs);
      }
    }

    return () => clearTimeout(timer);
  }, [
    displayedText,
    isDeleting,
    currentWordIndex,
    words,
    typingSpeedMs,
    eraseSpeedMs,
    holdAfterTypeMs,
    pauseBetweenWordsMs,
  ]);

  return (
    <span className={`whitespace-nowrap ${className}`}>
      {prefix}
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ======================
// PlayCard Modal
// ======================
interface PlayCardProps {
  title: string;
  description: string;
  onClose: () => void;
}

function PlayCard({ title, description, onClose }: PlayCardProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-lg w-[90%] shadow-xl relative font-serif"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold gradient-text mb-4">{title}</h2>
        <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
}

// ======================
// StaggeredReveal
// ======================
function StaggeredReveal({
  direction = "up",
  staggerDelay = 0.2,
  children,
}: {
  direction?: "up" | "down";
  staggerDelay?: number;
  children: ReactNode;
}) {
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 20 : -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };
  return <motion.div initial="hidden" whileInView="visible" variants={variants} viewport={{ once: true }}>{children}</motion.div>;
}

// ======================
// AnimatedText
// ======================
function AnimatedText({
  text,
  type = "gradient",
  className = "",
  duration = 1,
}: {
  text: string;
  type?: "gradient" | "solid";
  className?: string;
  duration?: number;
}) {
  const animation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration } },
  };
  return (
    <motion.span
      className={type === "gradient" ? "gradient-text" : ""}
      initial="hidden"
      animate="visible"
      variants={animation}
    >
      {text}
    </motion.span>
  );
}

// ======================
// About Section inside Hero
// ======================
function About() {
  const coreValues = [
    { icon: <Target className="w-8 h-8 text-neon-cyan" />, title: "Mission", description: "Empower students technically, foster a strong network, and bridge the gap between academia and industry." },
    { icon: <Eye className="w-8 h-8 text-neon-cyan" />, title: "Vision", description: "To be the most dynamic, future-driven student tech community at SRMIST, producing innovators who solve real-world problems." },
    { icon: <Rocket className="w-8 h-8 text-neon-cyan" />, title: "Motto", description: '"Code. Connect. Conquer." Learn and innovate, build bridges between people and ideas, and lead change in tech.' },
  ];

  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden text-white">
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="container mx-auto relative z-10">
        <StaggeredReveal direction="up" staggerDelay={0.2}>
          <motion.h2 className="text-4xl font-bold text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <AnimatedText text="Who We Are" type="gradient" className="text-5xl md:text-6xl" duration={1.5} />
          </motion.h2>
        </StaggeredReveal>
        <StaggeredReveal direction="up" staggerDelay={0.3}>
          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 50, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }} viewport={{ once: true }} whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}>
                <div className="text-center border border-gray-800 rounded-xl p-6 hover:border-neon-cyan transition-colors h-full">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-2xl font-semibold mb-2 text-neon-cyan group-hover:text-white transition-colors">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </StaggeredReveal>
      </div>
    </section>
  );
}

// ======================
// Hero Section
// ======================
export default function Hero() {
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const roles: Record<string, string> = {
    "Web Dev": "As a Web Developer, you’ll build scalable frontends, backends, and full-stack apps that bring real-world ideas to life.",
    "R&D": "In Research & Development, you’ll explore cutting-edge technologies, experiment, and innovate to push the boundaries of applied computing.",
    "Gen-AI": "In Gen-AI, you’ll experiment with large language models, prompt engineering, and build next-gen applications powered by AI.",
    "Metaverse": "Metaverse developers create immersive experiences using 3D engines, spatial design, and extended reality technologies.",
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <ParticleSystem particleCount={35} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="text-8xl md:text-[10rem] font-extrabold gradient-text blur-sm">
          ACM
        </motion.div>
      </div>
      <div className="container mx-auto px-6 text-center z-10 relative">
        <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-extrabold tracking-tight gradient-text drop-shadow-[0_0_20px_rgba(0,200,255,0.4)]">
          SRM ACM <span className="gradient-text">SIGAPP</span>
        </motion.h1>
        <motion.h2 className="mt-6 text-2xl md:text-4xl font-semibold text-gray-200 leading-snug" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <span className="gradient-text">Connecting Minds, </span>
          <RotatingTypewriter prefix="Creating " words={["Innovation", "Solutions", "Change"]} className="inline gradient-text" typingSpeedMs={80} eraseSpeedMs={40} holdAfterTypeMs={1000} pauseBetweenWordsMs={300} />
        </motion.h2>
        <motion.div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
          <Magnetic>
            <Button size="xl" className="btn-magnetic group" asChild>
              <a href="#events" className="flex items-center gap-2">
                Explore Events
                <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button variant="glass" size="xl" className="btn-magnetic group" asChild>
              <a href="#about" className="flex items-center gap-2">
                <Users className="mr-2" />
                About Us
              </a>
            </Button>
          </Magnetic>
        </motion.div>
        <motion.div className="mt-14 flex flex-wrap justify-center gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}>
          {[
            { icon: Code, label: "Web Dev" },
            { icon: FlaskConical, label: "R&D" },
            { icon: Zap, label: "Gen-AI" },
            { icon: Globe, label: "Metaverse" },
          ].map(({ icon: Icon, label }) => (
            <motion.div key={label} className="cursor-pointer flex flex-col items-center gap-2 p-4 rounded-xl glass w-28 h-28 hover:scale-110 transition-transform" whileTap={{ scale: 0.95 }} onClick={() => setActiveRole(label)}>
              <Icon className="w-8 h-8 gradient-text" />
              <span className="text-gray-200 font-medium">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <About />
      <AnimatePresence>
        {activeRole && <PlayCard title={activeRole} description={roles[activeRole]} onClose={() => setActiveRole(null)} />}
      </AnimatePresence>
    </div>
  );
}
