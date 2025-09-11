"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Globe, Gamepad2, Sparkles, Shield, Cloud, Palette, Briefcase, Building } from "lucide-react";

const Domains = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

const technicalDomains = [
  {
    icon: Brain,
    title: "R & D",
    description: "Explore advanced technologies, research methodologies, and strategies to drive innovation in cutting-edge projects",
  },
  {
    icon: Globe,
    title: "Web/App Development",
    description: "Build responsive websites and mobile applications using modern frameworks, full-stack technologies, and best practices",
  },
  {
    icon: Gamepad2,
    title: "Metaverse",
    description: "Create immersive virtual worlds, extended reality experiences, and interactive environments for next-gen gaming",
  },
  {
    icon: Sparkles,
    title: "Generative AI",
    description: "Leverage large language models, creative AI tools, and prompt engineering to generate innovative content and solutions",
  },
];

const nonTechnicalDomains = [
  {
    icon: Briefcase,
    title: "Management",
    description: "Develop leadership, strategy, and organizational skills to plan and execute impactful events and experiences",
  },
  {
    icon: Palette,
    title: "Creatives",
    description: "Master design thinking, content creation, and multimedia arts to craft visually compelling and innovative experiences",
  },
  {
    icon: Building,
    title: "Corporate",
    description: "Understand business operations, organizational frameworks, and industry practices to drive corporate strategy and efficiency",
  }
];

  return (
    <section className="py-20 relative bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Our Domains</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover cutting-edge fields and build expertise across technical and creative domains
          </p>
        </motion.div>

        {/* Technical Domains */}
        <div className="mb-20">
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-8 text-center gradient-text-alt"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Technical Domains
          </motion.h3>
          
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {technicalDomains.map((domain) => (
              <motion.div
                key={domain.title}
                variants={cardVariants}
                className="glass p-8 rounded-2xl hover:glass-hover transition-all duration-300 group tilt-3d glow-hover border-white/10"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto">
                  <domain.icon className="w-8 h-8 text-gradient-cyan group-hover:text-gradient-violet transition-colors float" />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white text-center">
                  {domain.title}
                </h4>
                <p className="text-gray-300 text-center leading-relaxed">
                  {domain.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Non-Technical Domains */}
        <div className="mb-16">
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-8 text-center gradient-text-alt"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Non - Technical Domains
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {nonTechnicalDomains.map((domain) => (
              <motion.div
                key={domain.title}
                variants={cardVariants}
                className="glass p-8 rounded-2xl hover:glass-hover transition-all duration-300 group tilt-3d glow-hover border-white/10"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto">
                  <domain.icon className="w-8 h-8 text-gradient-violet group-hover:text-gradient-cyan transition-colors float" />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white text-center">
                  {domain.title}
                </h4>
                <p className="text-gray-300 text-center leading-relaxed">
                  {domain.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Note Section */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Registrations are currently closed. We will open the next round next year. Better luck next time!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Domains;
