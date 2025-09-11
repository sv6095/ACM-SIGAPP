"use client";

import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";

// Glitter Background Component
const GlitterBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
    <div className="absolute inset-0">
      {[...Array(50)].map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-75 animate-glitter"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>

    {/* Glitter animation styles */}
    <style>
      {`
        @keyframes glitterTwinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.6) translateY(0px);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) translateY(-5px);
          }
        }

        .animate-glitter {
          animation-name: glitterTwinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}
    </style>
  </div>
);


// Social Icon Component
const SocialIcon = ({ href, Icon }) => (
  <motion.a
    href={href}
    className="w-8 h-8 glass rounded-full flex items-center justify-center hover:glass-hover transition-all group/social"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="w-4 h-4 text-gray-300 group-hover/social:text-gradient-cyan transition-colors" />
  </motion.a>
);

// Team Card Component
const TeamCard = ({ member }) => (
  <motion.div
    className="glass p-6 rounded-2xl hover:glass-hover transition-all duration-300 group text-center tilt-3d border-white/10 relative overflow-hidden"
    whileHover={{ y: -5 }}
  >
    <div className="relative mb-4">
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gradient-cyan/30 group-hover:border-gradient-violet/50 transition-all duration-300 relative bg-gradient-to-br from-gradient-cyan/20 to-gradient-violet/20 flex items-center justify-center text-white text-2xl font-bold">
        {member.image ? (
          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          member.name
            .split(' ')
            .map(n => n[0])
            .join('')
        )}
      </div>
    </div>
    <h3 className="text-lg font-bold mb-1 text-white group-hover:gradient-text transition-all">
      {member.name}
    </h3>
    <p className="gradient-text-alt text-sm mb-3">{member.role}</p>
    <p className="text-gray-300 text-sm">{member.bio}</p>
    <div className="flex justify-center space-x-3 mt-4">
      {member.social.linkedin && <SocialIcon href={member.social.linkedin} Icon={Linkedin} />}
      {member.social.twitter && <SocialIcon href={member.social.twitter} Icon={Twitter} />}
      {member.social.github && <SocialIcon href={member.social.github} Icon={Github} />}
      {member.social.email && <SocialIcon href={`mailto:${member.social.email}`} Icon={Mail} />}
    </div>
  </motion.div>
);

// Team Section Component
const TeamSection = ({ title, members }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const gridCols = members.length === 1 ? "grid-cols-1" :
                   members.length === 2 ? "grid-cols-1 sm:grid-cols-2 justify-items-center" :
                   members.length === 3 ? "grid-cols-1 sm:grid-cols-3" :
                   "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="mb-12">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold gradient-text">{title}</h2>
      </motion.div>
      <motion.div
        className={`grid ${gridCols} gap-8 max-w-5xl mx-auto`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {members.map((member) => (
          <motion.div key={member.name} variants={cardVariants}>
            <TeamCard member={member} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Main Team Component
const Team = () => {
  const clubInCharge = [
    { name: "Giridharan", role: "Chair", bio: "Leading the club’s vision and mission towards impactful computing solutions.", image: "", social: {} },
    { name: "Divyan", role: "Vice Chair", bio: "Supporting leadership efforts and coordinating various initiatives.", image: "", social: {} },
    { name: "Yukta", role: "Treasurer", bio: "Managing resources and ensuring smooth operational functions.", image: "", social: {} },
    { name: "Shantanu", role: "Technical Director", bio: "Overseeing technical projects and innovation pipelines.", image: "", social: {} }
  ];

  const technicalTeam = {
    "Gen AI": [
      { name: "Kavinraj", role: "Head", bio: "Exploring generative AI and large language models.", image: "", social: {} },
      { name: "Pragya", role: "Lead", bio: "Supporting AI projects and research.", image: "", social: {} }
    ],
    "R&D": [
      { name: "Samrithaa", role: "Head", bio: "Driving research and development across domains.", image: "", social: {} }
    ],
    "Web/App Development": [
      { name: "Bhuvanesh", role: "Head", bio: "Developing cutting-edge web and application solutions.", image: "", social: {} }
    ],
    "Metaverse": [
      { name: "Ankit", role: "Head", bio: "Innovating immersive experiences and virtual worlds.", image: "", social: {} },
      { name: "Rishav", role: "Lead", bio: "Designing interactive environments and game elements.", image: "", social: {} }
    ]
  };

  const nonTechnicalTeam = {
     "Management": [
      { name: "Mukilan", role: "Head", bio: "Driving leadership and team development.", image: "", social: {} },
      { name: "Aditya", role: "Lead", bio: "Supporting management processes and planning.", image: "", social: {} },
      { name: "Shedin", role: "Lead", bio: "Enhancing organizational efficiency and communication.", image: "", social: {} }
    ],
    "Creatives": [
      { name: "Aqeel", role: "Head", bio: "Leading creative design and content initiatives.", image: "", social: {} },
      { name: "Shreya", role: "Lead", bio: "Supporting multimedia projects and storytelling.", image: "", social: {} },
      { name: "Praveen", role: "Lead", bio: "Enhancing visual communication and branding strategies.", image: "", social: {} }
    ],
   
    "Corporate": [
      { name: "", role: "Head", bio: "Managing organizational and strategic initiatives.", image: "", social: {} },
      { name: "Vinay", role: "Lead", bio: "Streamlining operations and partnerships.", image: "", social: {} },
      { name: "Saket", role: "Lead", bio: "Optimizing corporate governance and outreach.", image: "", social: {} }
    ]
  };

  return (
    <section className="py-20 relative overflow-hidden text-white">
      <GlitterBackground />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Introducing Our Team</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Meet the passionate leaders and members driving innovation and community engagement.
          </p>
        </motion.div>

        <TeamSection title="Club In-Charge" members={clubInCharge} />

        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center gradient-text">Technical Team</h2>
        {Object.keys(technicalTeam).map((section) => (
          <TeamSection key={section} title={section} members={technicalTeam[section]} />
        ))}

        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center gradient-text">Non-Technical Team</h2>
        {Object.keys(nonTechnicalTeam).map((section) => (
          <TeamSection key={section} title={section} members={nonTechnicalTeam[section]} />
        ))}
      </div>
    </section>
  );
};

export default Team;
