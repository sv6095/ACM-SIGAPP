"use client";

import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Github, Mail, Instagram } from "lucide-react";
import { AnimatedSection, AnimatedCard } from "@/components/ui/AnimatedSection";
import { useScrollAnimation, useStaggeredReveal } from "@/hooks/useScrollAnimation";

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
    className="glass p-6 rounded-2xl hover:glass-hover transition-all duration-300 group text-center tilt-3d border-white/10 relative overflow-hidden h-full flex flex-col"
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
    <p className={`text-sm mb-3 font-semibold ${
      member.role === 'Head' 
        ? 'text-gradient-cyan font-bold text-base' 
        : member.role === 'Lead' 
        ? 'text-gradient-violet font-bold text-base' 
        : 'gradient-text-alt'
    }`}>{member.role}</p>
    <p className="text-gray-300 text-sm flex-grow">{member.bio}</p>
    <div className="flex justify-center space-x-3 mt-4">
      {member.social.linkedin && <SocialIcon href={member.social.linkedin} Icon={Linkedin} />}
      {member.social.instagram && <SocialIcon href={member.social.instagram} Icon={Instagram} />} {/* Add this line */}
      {member.social.twitter && <SocialIcon href={member.social.twitter} Icon={Twitter} />}
      {member.social.github && <SocialIcon href={member.social.github} Icon={Github} />}
      {member.social.email && <SocialIcon href={`mailto:${member.social.email}`} Icon={Mail} />}
    </div>
  </motion.div>
);

// Team Section Component
const TeamSection = ({ title, members }) => {
  const { containerVariants, itemVariants } = useStaggeredReveal(0.15);

  const gridCols = members.length === 1 ? "grid-cols-1" :
                   members.length === 2 ? "grid-cols-1 sm:grid-cols-2 justify-items-center" :
                   members.length === 3 ? "grid-cols-1 sm:grid-cols-3" :
                   members.length === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
                   "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="mb-16">
      <AnimatedSection direction="fade" delay={0.1}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">{title}</h2>
        </div>
      </AnimatedSection>
      
      <motion.div
        className={`grid ${gridCols} gap-8 max-w-5xl mx-auto`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {members.map((member, index) => (
          <motion.div 
            key={member.name} 
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
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
    { name: "Giridharan", role: "Chair", bio: "Leading the club’s vision and mission towards impactful computing solutions.", image: "/images/Giridharan.JPG", social: {linkedin:"https://www.linkedin.com/in/girirraju", instagram:"https://www.instagram.com/_giriraju?igsh=MTI4emt0YnhjdjZtYg=="} },
    { name: "Divyan", role: "Vice Chair", bio: "Supporting leadership efforts and coordinating various initiatives.", image: "/images/divyan.jpg", social: {linkedin:"https://www.linkedin.com/in/h-divyan", instagram:"https://www.instagram.com/divyan_.h?igsh=MWxrcWxyZ2dzYXh1bw=="} },
    { name: "Yukta", role: "Treasurer", bio: "Managing resources and ensuring smooth operational functions.", image: "/images/Yukta.JPG", social: {linkedin:"https://www.linkedin.com/in/yukta-bhardwaj-806467288", instagram:"https://www.instagram.com/yukta2106?igsh=YW9wcWd2bDRkemgx"} },
    { name: "Shantanu", role: "Technical Director", bio: "Overseeing technical projects and innovation pipelines.", image: "/images/Shantanu.jpg", social: {linkedin:"https://www.linkedin.com/in/shantanu-v-", instagram:"https://www.instagram.com/shan.tanu07_?igsh=aTJpb3UzaTZsOWx5"} }
  ];

  const technicalTeam = {
    "Gen AI": [
      { name: "Kavinraj", role: "Head", bio: "Exploring generative AI and large language models.", image: "/images/Kavinraj.JPG", social: {linkedin:"https://www.linkedin.com/in/kavinraj-mayilsamy", instagram:"https://www.instagram.com/srmacmsigapp?igsh=MTNmNzd2eTFycHBmNQ=="} },
      { name: "Pragya", role: "Lead", bio: "Supporting AI projects and research.", image: "/images/Pragya.jpg", social: {linkedin:"https://www.linkedin.com/in/pragya-paramita-sahoo-514bb2281", instagram:"https://www.instagram.com/_pragyaa02_?igsh=MnNic3g3N2F6cG43"} }
    ],
    "R&D": [
      { name: "Samrithaa", role: "Head", bio: "Driving research and development across domains.", image: "/images/Samrithaa.JPG", social: {linkedin:"https://www.linkedin.com/in/samrithaa-prabakar-034514295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", instagram:"https://www.instagram.com/samrithaa_prabakar?igsh=MWtpcTF1Mzkzanl1bQ=="} }
    ],
    "Web/App Development": [
      { name: "Bhuvanesh", role: "Head", bio: "Developing cutting-edge web and application solutions.", image: "/images/Bhuvanesh.jpg", social: {linkedin: "https://www.linkedin.com/in/bhuvanesh-s-5bb4922a9/", instagram:"https://www.instagram.com/bhuvan_7?igsh=MTl3ZzZzMXdwdjF1MA=="} },
      { name: "Anushka Banerjee", role: "Lead", bio: "Leading the charge in smart on web/app development.", image: "/images/Anushka.JPG", social: {linkedin: "https://www.linkedin.com/in/anu7hka/", instagram:"https://www.instagram.com/anusrkive?igsh=MWhlM25nMmZqY2Fjcw=="} }
    ],
    "Metaverse": [
      { name: "Ankit", role: "Head", bio: "Innovating immersive experiences and virtual worlds.", image: "/images/Ankit.JPG", social: {linkedin:"https://www.linkedin.com/in/ankit-mandal-724890359", instagram:"https://www.instagram.com/srmacmsigapp?igsh=MTNmNzd2eTFycHBmNQ=="} },
      { name: "Rishav", role: "Lead", bio: "Designing interactive environments and game elements.", image: "/images/Rishav.jpg", social: {linkedin:"https://www.linkedin.com/in/rishav-goswami-279789354", instagram:"https://www.instagram.com/srmacmsigapp?igsh=MTNmNzd2eTFycHBmNQ=="} }
    ]
  };

  const nonTechnicalTeam = {
     "Management": [
      { name: "Mukilan", role: "Head", bio: "Driving leadership and team development.", image: "/images/Mukilan.jpg", social: {linkedin:"https://www.linkedin.com/in/mukilan-krishna-92574a2ab?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", instagram:"https://www.instagram.com/mukilan_k_24?igsh=MXM0NWxiOG5jejl1OA=="} },
      { name: "Aditya", role: "Lead", bio: "Supporting management processes and planning.", image: "/images/Aditya.png", social: {linkedin:"https://www.linkedin.com/in/adityagautam2005?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", instagram:"https://www.instagram.com/adihere1483?igsh=MWFnazBzZmNnMzE3ZA=="} },
      { name: "Shedin", role: "Lead", bio: "Enhancing organizational efficiency and communication.", image: "/images/Shedin.JPG", social: {linkedin:"https://www.linkedin.com/company/srm-acm-sigapp/", instagram:"https://www.instagram.com/shedin.ashraf?igsh=c2lsZ2VyNGxvbXdi"} }
    ],
    "Creatives": [
      { name: "Aqeel", role: "Head", bio: "Leading creative design and content initiatives.", image: "/images/Aqeel.JPG", social: {linkedin:"https://www.linkedin.com/in/aqeel-umar-287aa8245", instagram:"https://www.instagram.com/aqeel_3301?igsh=dTN6NWowdXBtdWNk"} },
      { name: "Shreya", role: "Lead", bio: "Supporting multimedia projects and storytelling.", image: "/images/Shreya.jpg", social: {linkedin:"https://www.linkedin.com/in/shreyatiwar4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", instagram:"https://www.instagram.com/shreyy_a04?igsh=MXMwZGNhazZjMmtydQ=="} },
      { name: "Praveen", role: "Lead", bio: "Enhancing visual communication and branding strategies.", image: "/images/Praveen.JPG", social: {linkedin:"https://www.linkedin.com/in/praveen-saravanan", instagram:"https://www.instagram.com/thegraxwizard?igsh=MThrb3Ywc3duOXVmOQ=="} }
    ],
   
    "Corporate": [
      { name: "Alka Sunil", role: "Head", bio: "Managing organizational and strategic initiatives.", image: "/images/Alka.JPG", social: {linkedin:"https://www.linkedin.com/in/alka-sunil-52326b278", instagram:"https://www.instagram.com/alkaftw?igsh=NzR6ajZ0cGQ3M3Rj"} },
      { name: "Vinay", role: "Lead", bio: "Streamlining operations and partnerships.", image: "/images/vinay.jpg", social: {linkedin:"https://www.linkedin.com/in/vinay-bollineni-0abbb9287", instagram:"https://www.instagram.com/_vinaybollineni_?igsh=MXI1ODU2MWl2YWplZw=="} },
      { name: "Saket", role: "Lead", bio: "Optimizing corporate governance and outreach.", image: "/images/Saket.jpg", social: {linkedin:"https://www.linkedin.com/in/saketjha09?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", instagram:"https://www.instagram.com/saket_jha09?igsh=dHlsdmVoaGhnbTBv"} }
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
